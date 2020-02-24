/*global chrome: false */
/*global angular: false */
/*jslint browser: true */
/*jslint white: true */
'use strict';

var calendarApp = angular.module('myApp', ['ngRoute']);

calendarApp.controller('MainCtrl', function ($scope, $q, $timeout, $location, Database, Server, Alarm, Push, Status) {

  var log = function (parm) {
    console.log('MainCtrl ' + parm);
  };


  $scope.pollingState = false;

  Push.register();

  $scope.status = {
    syncTime: null,
    primaryCalendar: null,
    connected: false,
    online: true,
    idle: 'active'
  };

  $scope.setting = {
    'reminderTime': 30,
    'sound': true,
    'futureDay': 2,
    'snoozeTime': 10
  };

  // Update functions

  $scope.updateAll = function () {
    log('updateAll');
    $scope.updateEventArray();
    $scope.updateCurrent();
    Alarm.updateReminders($scope.eventArray);
    Alarm.checkReminders($scope.setting);
  };

  $scope.updateCurrent = function () {
    $scope.current = null;
    angular.forEach($scope.eventArray, function (event) {
      if (event.id === $scope.selected) {
        $scope.current = event;
        $scope.snoozeTime = Alarm.snoozeTime($scope.selected);
      }
    });
  };

  $scope.updateCalendars = function (calendarList) {
    var calendars = {};
    angular.forEach(calendarList.items, function (value) {
      var calendar = {};
      calendar.defaultReminders = value.defaultReminders;
      calendar.colorId = value.colorId;
      calendar.summary = value.summary;
      calendar.primary = value.primary;
      // update primary calendar if found
      if (value.primary === true) {
        Status.updateStatus('primaryCalendar', value.id);
      }
      calendar.timeZone = value.timeZone;
      // if calendar is undefined and primary, default enable. Otherwise take previous state
      if ($scope.calendars[value.id] === undefined) {
        calendar.enabled = value.primary === true;
      } else {
        calendar.enabled = $scope.calendars[value.id].enabled;
      }
      calendars[value.id] = calendar;
    });
    $scope.calendars = calendars;
    Push.watchAll(calendars);
  };

  $scope.removeExpiredEvents = function () {
    log('removeExpiredEvents');
    angular.forEach($scope.events, function (calendar, key) {
      angular.forEach(calendar, function (event) {
        var timeStamp = new Date(event.startTime).getTime() + 3 * 24 * 3600 * 1000;
        if (timeStamp < new Date().getTime() && event.dismissStatus === true) {
          log('event ' + event.id + ' is older than three days ago and dismissStatus is true');
          delete $scope.events[key][event.id];
          chrome.notifications.clear(event.id, function () {});
        }
      });
    });
  };

  $scope.removeFutureEvents = function () {
    log('removeFutureEvents');
    var futureTime = new Date(new Date().getTime() + parseInt($scope.setting.futureDay, 10) * 24 * 60 * 60 * 1000);
    angular.forEach($scope.events, function (calendar, key) {
      angular.forEach(calendar, function (event) {
        if (futureTime < new Date(event.startTime)) {
          log('event ' + event.id + ' is further in future hence should be removed');
          delete $scope.events[key][event.id];
          chrome.notifications.clear(event.id, function () {});
        }
      });
    });
  };

  $scope.updateEvents = function (calendars) {
    log('updateEvents');
    angular.forEach(calendars, function (calendar, key) {
      angular.forEach(calendar.items, function (event) {
        if (event.status === 'cancelled') {
          if ($scope.events[key] && $scope.events[key][event.id]) {
            log('cancelled event');
            delete $scope.events[key][event.id];
            chrome.notifications.clear(event.id, function () {});
          }
        } else {
          var item = {};
          item.id = event.id;
          item.summary = event.summary;
          item.htmlLink = event.htmlLink;
          item.reminders = event.reminders;
          item.description = event.description;
          item.recurrence = event.recurrence;
          item.updated = event.updated;
          item.hangoutLink = event.hangoutLink;

          var offset = new Date().getTimezoneOffset();

          if (event.start.date) {
            // handle timeZone offset for all-day event
            item.startTime = new Date(new Date(event.start.date).getTime() + offset * 60 * 1000).toISOString();
            item.allDay = true;
          } else {
            item.startTime = event.start.dateTime;
            item.allDay = false;
          }

          if (event.end.date) {
            // minus 1 here so that all-day event are displayed as one day, instead of spanning over two days
            item.endTime = new Date(new Date(event.end.date).getTime() + offset * 60 * 1000 - 1).toISOString();
          } else {
            item.endTime = event.end.dateTime;
          }
          item.location = event.location;

          if (event.colorId) {
            item.color = {
              'color': $scope.colors.event[event.colorId].background
            };
          } else {
            item.color = {
              'color': $scope.colors.calendar[$scope.calendars[key].colorId].background
            };
          }
          item.calendarId = key;
          item.calendarName = $scope.calendars[key].summary;

          // default dismissOff
          item.dismissStatus = false;
          if ($scope.events[key] && $scope.events[key][event.id]) {
            log('event already exist ' + item.id);

            item.dismissStatus = $scope.events[key][event.id].dismissStatus;

            // if startTime has changed, dismissStatus needs to be off
            if ($scope.events[key][event.id].startTime !== item.startTime) {
              item.dismissStatus = false;
            }
            $scope.events[key][event.id] = item;
          } else {
            // if this calendar key doesn't exist, create one first if the event is after the last 24 hours
            var timeStamp = new Date(item.startTime).getTime() + 24 * 3600 * 1000;
            if (timeStamp > new Date().getTime()) {
              log('new event ' + item.id);
              if ($scope.events[key] == undefined) {
                $scope.events[key] = {};
              }
              $scope.events[key][event.id] = item;
            }
          }
        }
      });
    });
  };

  $scope.updateEventArray = function () {
    log('updateEventArray');
    var eventArray = [];

    angular.forEach($scope.events, function (events, key) {
      if ($scope.calendars[key].enabled) {
        angular.forEach(events, function (event) {
          // ignore dismissed reminder
          if (event.dismissStatus === false) {
            eventArray.push(event);
          }
        });
      }
    });

    eventArray = eventArray.sort(function (a, b) {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    $scope.eventArray = eventArray;
    $timeout(function () {
      $scope.$apply();
    });

    log('eventArray length ' + $scope.eventArray.length);
    if ($scope.eventArray.length === 0) {
      $scope.selected = 'null';
    } else {
      // update selected. If not selected is found, assign first eventArray to be selected
      if ($scope.selectIndex() === -1) {
        $scope.selected = $scope.eventArray[0].id;
      }
    }
  };

  // Sync Functions

  // sync one particular calendar
  $scope.syncOne = function (calendarId) {
    log('syncOne ' + calendarId);
    if ($scope.calendars[calendarId] && $scope.calendars[calendarId].enabled) {
      Server.getCalendarEvent(calendarId, parseInt($scope.setting.futureDay, 10)).then(function (calendar) {
        var obj = {};
        obj[calendarId] = calendar;
        $scope.updateEvents(obj);
        log('syncOne success');
        $scope.updateAll();
      });
    }
  };

  // sync all enalbed calendar events
  $scope.syncEvents = function () {
    log('syncEvents');
    var deferred = $q.defer();
    var calendarIds = [];
    angular.forEach($scope.calendars, function (calendar, key) {
      if (calendar.enabled) {
        calendarIds.push(key);
      }
    });
    Server.getCalendarEvents(calendarIds, parseInt($scope.setting.futureDay, 10)).then(function (calendars) {
      var merged = {};
      angular.forEach(calendars, function (calendar, key) {
        merged[calendarIds[key]] = calendar;
      });
      deferred.resolve(merged);
    }, function () {
      deferred.reject();
    });
    return deferred.promise;
  };

  // If interactive flag is true, it will ignore sync delay
  $scope.syncAll = function (interactive) {
    if (interactive === false && $scope.status.syncTime) {
      var sinceLastSync = new Date().getTime() - new Date($scope.status.syncTime).getTime();
      // if last sync is within 5 mins, skip
      if (sinceLastSync < 300000) {
        log('syncAll ignored, sinceLastSync ' + sinceLastSync / 1000);
        Alarm.checkReminders($scope.setting);
        return;
      }
    }
    Server.syncCalendar(interactive).then(function (data) {
      $scope.colors = data.colors;
      $scope.updateCalendars(data.calendarList);
      Status.updateStatus('syncTime', new Date().toISOString());
      $scope.syncEvents().then(function (calendars) {
        $scope.updateEvents(calendars);
        log('syncAll success');
        $scope.updateAll();
      }, function () {
        log('syncEvents failed');
        $scope.updateAll();
      });
    }, function () {
      log('syncCalendar failed');
      $scope.updateAll();
    });
  };

  $scope.select = function (id) {
    log('select ' + id);
    $scope.selected = id;
  };

  // Helper function

  $scope.selectIndex = function () {
    var result = -1;
    angular.forEach($scope.eventArray, function (event, index) {
      if (event.id === $scope.selected) {
        result = index;
      }
    });
    return result;
  };

  // Polling check
  $scope.polling = function () {
    $scope.pollingState = true; // making sure only one polling loop is running at a time
    log('polling start');
    $timeout(function () {
      log('polling: connected ' + $scope.status.connected + ' online ' + $scope.status.online + ' idle ' + $scope.status.idle + ' ' + new Date().toISOString());
      if ($scope.status.idle === 'active') {
        // sync only when connected and online
        if ($scope.status.connected && $scope.status.online) {
          $scope.syncAll(false);
        } else {
          Alarm.checkReminders($scope.setting);
        }
      }
      $scope.polling();
    }, 300000);
  };

  // Init routines


  $scope.clearData = function () {
    log('clearData');
    $scope.eventArray = [];
    $scope.calendars = [];
    $scope.events = {};
    $scope.colors = [];
    $scope.selected = 'null';
  };

  $scope.clearData();

  $scope.reloadStorage = function () {
    log('reloadStorage');
    var deferred = $q.defer();
    var promise0 = Database.get('setting', true);
    var promise1 = Database.get('colors');
    var promise2 = Database.get('calendars');
    var promise3 = Database.get('events');

    $q.all([promise0, promise1, promise2, promise3]).then(function (results) {
        log('reloadStorage success');
        $scope.setting = results[0];
        $scope.colors = results[1];
        $scope.calendars = results[2];
        $scope.events = results[3];
        $scope.removeExpiredEvents();
        deferred.resolve();
      },
      function (errors) {
        console.dir(errors);
        deferred.resolve();
      }
    );
    return deferred.promise;
  };

  $scope.reloadStorage().then(function () {

    $scope.$on('selectedChange', function (event, data) {
      log('selectedChange ' + data.selected);
      // update selected if it is in eventArray
      angular.forEach($scope.eventArray, function (event) {
        if (event.id === data.selected) {
          $scope.$apply(function () {
            $scope.selected = data.selected;
          });
        }
      });
    });

    $scope.$on('remindersChange', function () {
      log('remindersChange');
      $scope.snoozeTime = Alarm.snoozeTime($scope.selected);
    });

    $scope.$on('pushChange', function (event, data) {
      log('pushChange ' + data);
      // if the push update is per calendar, only sync that calendar
      if (data === 'calendarList') {
        $scope.syncAll(true);
      } else {
        $scope.syncOne(data);
      }
    });

    $scope.$on('statusChange', function (event, data) {
      log('statusChange');
      var sync = false;
      // from offline to online, sync
      if (data.online === true && data.online !== $scope.status.online) {
        sync = true;
      }
      // from idel to active, check alarm
      if (data.idle === 'active' && data.idle !== $scope.status.idle) {
        sync = true;
      }
      if (sync) {
        log('syncAll due to status change');
        $scope.syncAll(false);
      }
      // to prevent error '$digest already in progress'
      $timeout(function () {
        $scope.status.syncTime = data.syncTime;
        $scope.status.primaryCalendar = data.primaryCalendar;
        $scope.status.connected = data.connected;
        $scope.status.online = data.online;
        $scope.status.idle = data.idle;
      });
    });

    $scope.$on('$locationChangeStart', function () {
      log('location change detected, perform syncAll ' + $location.path());
      $scope.syncAll(false);
    });

    $scope.$watch('calendars', function () {
      log('calendars saved');
      chrome.storage.local.set({
        'calendars': $scope.calendars
      });
      // if calendar is disabled, clear its events; if calendar is first enabled, syncAll
      angular.forEach($scope.calendars, function (calendar, key) {
        if (calendar.enabled === false) {
          delete $scope.events[key];
        }
      });
      // if event's calendar is not found, delete as well
      angular.forEach($scope.events, function (events, key) {
        if ($scope.calendars[key] == undefined) {
          delete $scope.events[key];
        }
      });
      $scope.updateAll();
    }, true);

    $scope.$watch('events', function () {
      log('events saved');
      // remove $$hashKey generated by ng-repeat
      angular.forEach($scope.events, function (events, key) {
        angular.forEach(events, function (event, id) {
          if (event.$$hashKey) {
            delete $scope.events[key][id].$$hashKey;
          }
        });
      });
      chrome.storage.local.set({
        'events': $scope.events
      });
      $scope.updateAll();
    }, true);

    $scope.$watch('selected', function () {
      log('selected saved ' + $scope.selected);
      $scope.updateCurrent();
    }, true);

    $scope.$watch('colors', function () {
      log('colors saved');
      chrome.storage.local.set({
        'colors': $scope.colors
      });
    }, true);

    $scope.$watch('setting', function () {
      log('setting saved');
      chrome.storage.sync.set({
        'setting': $scope.setting
      });
    }, true);

    $scope.$watch('setting.futureDay', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        log('futureDay changed ' + newValue);
        $scope.removeFutureEvents();
        $scope.syncAll(true);
      }
    }, true);

    $scope.$watch('setting.reminderTime', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        log('reminderTime changed ' + newValue);
        Alarm.checkReminders($scope.setting);
      }
    }, true);

    // initial sync
    $scope.syncAll(false);
    $scope.polling();
  });
});
