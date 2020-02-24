/*global chrome: false */
/*global window: false */
/*global calendarApp: false */
/*global Audio: false */
/*global angular: false */
'use strict';

calendarApp.factory('Alarm', function ($filter, Database, $rootScope, Status) {

  var log = function (parm) {
    console.log('Alarm ' + parm);
  };

  log('init factory');

  var alarm = {
    alarmTime: null
  };

  function saveReminders() {
    Database.set('reminders', alarm.reminders);
    $rootScope.$broadcast('remindersChange');
  }

  function buttonClicked(id, buttonIndex) {
    chrome.notifications.clear(id, function () {});
    var event = alarm.reminders[id];
    if (event && event.buttons && event.buttons[buttonIndex]) {
      var key = event.buttons[buttonIndex];
      switch (key) {
      case 'snoozeTime':
        var snooze = event.snooze;
        log('buttonClicked' + id + ' snoozeTime ' + snooze);
        event.snoozeTime = new Date(new Date().getTime() + snooze * 60 * 1000).toISOString();
        saveReminders();
        break;
      case 'location':
        log('buttonClicked' + id + ' location ' + event.location);
        window.open($filter('locationURL')(event.location), '_blank');
        break;
      case 'hangoutLink':
        log('buttonClicked' + id + ' hangoutLink ' + event.hangoutLink);
        window.open(event.hangoutLink, '_blank');
        break;
      }
    }
  }

  function notificationClicked(id) {
    log('notification ' + id + ' clicked');
    chrome.notifications.clear(id, function () {});
    var obj = {};
    obj.selected = id;

    var currentWindow = chrome.app.window.current();
    if (currentWindow) {
      currentWindow.show(false);
    }

    $rootScope.$broadcast('selectedChange', {
      'selected': id
    });
  }

  function loadReminders() {
    log('loadReminders');
    Database.get('reminders').then(function (result) {
      alarm.reminders = result;
    });
  }

  alarm.updateReminders = function (events) {
    log('updateReminders');
    var newReminders = {};
    angular.forEach(events, function (event) {
      newReminders[event.id] = {
        id: event.id,
        startTime: event.startTime,
        color: event.color,
        summary: event.summary,
        location: event.location,
        hangoutLink: event.hangoutLink,
        snoozeTime: null,
        snooze: 0,
        confirmed: false,
        buttons: [],
      };
      // existing event with same time
      if (alarm.reminders && alarm.reminders[event.id] && alarm.reminders[event.id].startTime === event.startTime) {
        newReminders[event.id].snoozeTime = alarm.reminders[event.id].snoozeTime;
        newReminders[event.id].snooze = alarm.reminders[event.id].snooze;
        newReminders[event.id].confirmed = alarm.reminders[event.id].confirmed;
        newReminders[event.id].buttons = alarm.reminders[event.id].buttons;
      }
    });
    alarm.reminders = newReminders;
    saveReminders();
  };

  alarm.checkReminders = function (setting) {
    log('checkReminders');
    var changed = false;
    var currentTime = new Date();
    angular.forEach(alarm.reminders, function (event) {
      var reminderTime = new Date(new Date(event.startTime).getTime() - setting.reminderTime * 60 * 1000);
      // clear flags once notification is fired
      if (event.snoozeTime && currentTime > new Date(event.snoozeTime)) {
        if (alarm.notify(event, setting) === true) {
          event.snoozeTime = null;
          changed = true;
        }
      } else if (event.confirmed === false && currentTime > reminderTime) {
        if (alarm.notify(event, setting) === true) {
          event.confirmed = true;
          changed = true;
        }
      }
    });
    if (changed) {
      saveReminders();
    }
  };

  alarm.snooze = function (id, snoozeTime) {
    log('snooze ' + id + ' snoozeTime ' + snoozeTime);
    if (snoozeTime && alarm.reminders[id]) {
      alarm.reminders[id].snoozeTime = new Date(new Date().getTime() + snoozeTime * 60 * 1000).toISOString();
      saveReminders();
    }
  };

  alarm.snoozeTime = function (id) {
    log('snoozeTime ' + id);
    if (alarm.reminders && alarm.reminders[id] && alarm.reminders[id].snoozeTime) {
      return alarm.reminders[id].snoozeTime;
    }
    return null;
  };
  alarm.cancelSnooze = function (id) {
    log('cancelSnooze ' + id);
    if (alarm.reminders && alarm.reminders[id] && alarm.reminders[id].snoozeTime) {
      alarm.reminders[id].snoozeTime = null;
      saveReminders();
    }
  };
  alarm.notify = function (event, setting) {
    if (Status.getStatus('idle') !== 'active') {
      log('notify ' + event.id + ' postoned due to inactive');
      return false;
    }
    log('notify ' + event.id);
    var context = $filter('timeFromNow')(event.startTime);
    var time = $filter('date')(event.startTime, 'EEEE, MMM d, h:mm a');
    var iconPath = '/img/colors/' + event.color.color.replace('#', '') + '.png';

    var options = {
      type: 'basic',
      priority: 2,
      title: event.summary,
      message: time,
      contextMessage: context,
      isClickable: true,
      iconUrl: iconPath,
      buttons: []
    };
    alarm.reminders[event.id].buttons = [];
    if (setting.snoozeTime > 0) {
      options.buttons.push({
        title: 'Snooze for ' + $filter('timeString')(setting.snoozeTime * 60),
        iconUrl: '/img/bell.png'
      });
      alarm.reminders[event.id].buttons.push('snoozeTime');
      alarm.reminders[event.id].snooze = setting.snoozeTime;
    }
    if (event.hangoutLink) {
      options.buttons.push({
        title: 'Join video call',
        iconUrl: '/img/video.png'
      });
      alarm.reminders[event.id].buttons.push('hangoutLink');
    }
    // maximum two button so only display location button if there is space
    if (event.location && options.buttons.length < 2) {
      options.buttons.push({
        title: event.location,
        iconUrl: '/img/map.png'
      });
      alarm.reminders[event.id].buttons.push('location');
    }

    if (setting.sound) {
      var currentTime = new Date().getTime();
      var audio = new Audio('audio/notification.mp3');
      if (alarm.alarmTime) {
        if (currentTime > alarm.alarmTime + 5000) {
          audio.play();
          alarm.alarmTime = currentTime;
        }
      } else {
        audio.play();
        alarm.alarmTime = currentTime;
      }
    }
    chrome.notifications.clear(event.id, function () {
      chrome.notifications.create(event.id, options, function () {});
    });
    return true;
  };

  loadReminders();

  chrome.notifications.onButtonClicked.addListener(buttonClicked);
  chrome.notifications.onClicked.addListener(notificationClicked);

  return alarm;
});
