/*global chrome: false */
/*global calendarApp: false */
/*jslint white: true */

calendarApp.factory('Push', function (Server, $q, $http, $rootScope, Database) {

  var log = function (parm) {
    console.log("Push " + parm);
  };

  log('init factory');

  var push = {
    senderId: '675106829084'
  };

  var gcm = {};

  function guid() {
    function _p8(s) {
      var p = (Math.random().toString(16) + "000000000").substr(2, 8);
      return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
  }

  function messageReceived(message) {
    var channelFound = false;
    console.dir(message);

    if (message.data && message.data.channel) {
      angular.forEach(gcm, function (item, key) {
        if (item.id === message.data.channel) {
          channelFound = true;
          log('message channel is found ' + message.data.channel + ' resourceId ' + message.data.resourceId + ' key ' + key + ' state ' + message.data.state);
          if (message.data.state === 'exists') {
            push.notify(key);
          }
        }
      });
      if (channelFound === false) {
        log('message channel not found ' + message.data.channel + ' resourceId ' + message.data.resourceId);
        push.stop(message.data.channel, message.data.resourceId);
      }
    }
  }

  function messageDelete(message) {
    // var channelFound = false;
    log('messageDelete');
    console.dir(message);
  }

  function savePush() {
    log('savePush');
    Database.set('gcm', gcm);
  }

  function loadPush() {
    log('loadPush');
    Database.get('gcm').then(function (result) {
      gcm = result;
    });
  }

  push.notify = function (key) {
    log('notify ' + key + ' ' + new Date().toISOString());
    $rootScope.$broadcast('pushChange', key);
  };

  push.checkCalendars = function (calendars) {
    angular.forEach(gcm, function (item, key) {
      if (key !== 'calendarList' && (!calendars[key] || calendars[key].enabled === false)) {
        push.stop(item.id, item.resourceId);
        delete gcm[key];
      }
    });
    savePush();
  };

  push.watchAll = function (calendars) {
    push.checkCalendars(calendars);
    if (push.regId) {
      log('watchAll');
      push.watch('calendarList');
      angular.forEach(calendars, function (calendar, id) {
        if (calendar.enabled) {
          push.watch(id);
        }
      });
    }
  };

  push.clear = function () {
    gcm = {};
    savePush();
    push.regId = null;
  };

  push.stop = function (id, resourceId) {
    var deferred = $q.defer();
    Server.signIn(false).then(function (token) {
        var request = {
          method: 'POST',
          url: 'https://www.googleapis.com/calendar/v3/channels/stop',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          data: {
            "id": id, // Your channel ID.
            "resourceId": resourceId
          }
        };
        $http(request).success(function () {
          log('stop suceed ' + id);
          deferred.resolve();
        }).error(function () {
          log('stop error ' + id);
          deferred.reject();
        });
      },
      function (err) {
        log(err);
        deferred.reject();
      });
    return deferred.promise;
  };

  push.watch = function (url) {
    var deferred = $q.defer();
    if (push.regId) {
      if (gcm[url] && gcm[url].expiration > new Date().getTime()) {
        log('watch ' + url + ' not expired yet');
        deferred.reject();
      } else if (gcm[url] && gcm[url].supported === false){
        log('watch ' + url + ' not support, skipped');
        deferred.reject();
      } else{
        Server.signIn(false).then(function (token) {
            var path;
            if (url === 'calendarList') {
              path = 'https://www.googleapis.com/calendar/v3/users/me/calendarList/watch';
            } else {
              path = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(url) + '/events/watch';
            }
            gcm[url] = {
              id: guid()
            };
            var request = {
              method: 'POST',
              url: path,
              headers: {
                'Authorization': 'Bearer ' + token
              },
              data: {
                "id": gcm[url].id, // Your channel ID.
                "type": "web_hook",
                "address": "https://chromeism.herokuapp.com/notifications", // Your receiving URL.
                "token": push.regId,
                "expiration": new Date().getTime() + 3600 * 1000
              }
            };
            $http(request).success(function (data) {
              log('watch suceed ' + url + ' expire ' + data.expiration + ' current time ' + new Date().getTime());
              gcm[url].expiration = data.expiration;
              gcm[url].resourceId = data.resourceId;
              gcm[url].supported = true;
              savePush();
              deferred.resolve();
            }).error(function (data) {
              // Currently if calendar doesn't support watch, it has error code of 400
              if (data.error && data.error.code === 400) {
                gcm[url].supported = false;
                savePush();
              }
              log('watch error ' + url + ' message ' + data.error.message);
              deferred.reject();
            });
          },
          function (err) {
            log(err);
            deferred.reject();
          });
      }
    } else {
      log('regId null');
      deferred.reject();
    }
    return deferred.promise;
  };

  push.register = function () {
    log('register');
    var deferred = $q.defer();
    chrome.gcm.register([push.senderId], function (registrationId) {
      if (registrationId) {
        push.regId = registrationId;
        log('regId ' + push.regId);
        chrome.gcm.onMessage.addListener(messageReceived);
        chrome.gcm.onMessagesDeleted.addListener(messageDelete);
        deferred.resolve();
      } else {
        log('chrome.gcm.register error ' + chrome.runtime.lastError.message);
        deferred.resolve();
      }
    });
    return deferred.promise;
  };

  loadPush();

  return push;
});
