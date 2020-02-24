/*global chrome: false */
/*global calendarApp: false */
/*global XMLHttpRequest: false */
/*global Audio: false */
/*jslint white: true */

"use strict";

calendarApp.factory('Server', function ($q, $rootScope, $http, Status) {

  var log = function (parm) {
    console.log("Server " + parm);
  };

  log('init factory');

  var server = {
    connected: false,
    current_token: null
  };

  server.getCalendarEvent = function (calendarId, futureDay) {
    var deferred = $q.defer();
    var timeMax = new Date(new Date().getTime() + futureDay * 24 * 60 * 60 * 1000).toISOString();
    var timeMin = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); // one previous week

    var request = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(calendarId) + '/events?orderBy=startTime&singleEvents=true&showDeleted=true&timeMax=' + timeMax + '&timeMin=' + timeMin;

    return server.getRequest(request);
  };

  server.getCalendarEvents = function (calendarIds, futureDay) {
    var deferred = $q.defer();
    var prom = [];

    angular.forEach(calendarIds, function (calendarId) {
      prom.push(server.getCalendarEvent(calendarId, futureDay));
    });
    $q.all(prom).then(function (results) {
      deferred.resolve(results);
    }, function (errors) {
      deferred.reject(errors);
    });
    return deferred.promise;
  };

  server.signIn = function (interactive) {
    log("signIn");
    var deferred = $q.defer();
    var newConnected = server.connected;
    chrome.identity.getAuthToken({
      'interactive': interactive
    }, function (token) {
      if (chrome.runtime.lastError) {
        log('chrome.runtime.lastError ' + chrome.runtime.lastError.message);
        log('getAuthToken failed token: ' + token);
        newConnected = false;
        if (token) {
          chrome.identity.removeCachedAuthToken({
            'token': token
          }, function () {
            log('removeCachedAuthToken succeed');
          });
        }
        deferred.reject('getAuthToken failed');
      } else {
        newConnected = true;
        log('Token acquired:' + token +
          '. See chrome://identity-internals for details.');
        server.current_token = token;
        deferred.resolve(token);
      }
      if (newConnected !== server.connected) {
        server.connected = newConnected;
      }
      Status.updateStatus('connected', server.connected);
    });
    return deferred.promise;
  };

  server.revokeToken = function () {
    log('revokeToken');
    var deferred = $q.defer();
    var newConnected = false;
    chrome.identity.getAuthToken({
        'interactive': false
      },
      function (current_token) {
        if (chrome.runtime.lastError) {
          log('getAuthToken failed');
        } else {
          if (current_token) {
            // Remove the local cached token
            chrome.identity.removeCachedAuthToken({
              token: current_token
            }, function () {
              log('removeCachedAuthToken succeed');
            });

            // Make a request to revoke token in the server
            $http.get('https://accounts.google.com/o/oauth2/revoke?token=' +
              current_token);

            log('Token revoked and removed from cache. ' +
              'Check chrome://identity-internals to confirm.');
          }
        }
        if (newConnected !== server.connected) {
          server.connected = newConnected;
        }
        Status.updateStatus('connected', server.connected);
        deferred.resolve();
      });
    return deferred.promise;
  };

  server.syncCalendar = function (interactive) {
    var deferred = $q.defer();

    this.signIn(interactive).then(
      function () {
        var obj = {};
        var promiseOne = server.getRequest('https://www.googleapis.com/calendar/v3/users/me/calendarList');
        var promiseTwo = server.getRequest('https://www.googleapis.com/calendar/v3/colors');

        $q.all([promiseOne, promiseTwo])
          .then(function (results) {
            obj.calendarList = results[0];
            obj.colors = results[1];
            deferred.resolve(obj);
          }, function (error) {
            deferred.reject(error);
          });
      }, function (error) {
        deferred.reject(error);
      });
    return deferred.promise;
  };

  server.getRequest = function (url) {
    var deferred = $q.defer();
    var request = {
      method: 'GET',
      url: url,
      headers: {
        'Authorization': 'Bearer ' + server.current_token
      }
    };
    $http(request).success(function (data, status, headers, config) {
      deferred.resolve(data);
    }).error(function (data, status, headers, config) {
      log('error status ' + status);
      deferred.reject();
    });
    return deferred.promise;
  };

  return server;
});
