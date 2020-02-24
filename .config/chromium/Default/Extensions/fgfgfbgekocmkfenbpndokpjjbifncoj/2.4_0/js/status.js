/*global chrome: false */
/*global calendarApp: false */
'use strict';

calendarApp.factory('Status', function (Database, $window, $rootScope) {

  var log = function (parm) {
    console.log('Status ' + parm);
  };

  log('init factory');

  var state = {
    syncTime: null,
    primaryCalendar: null,
    connected: false,
    online: false,
    idle: 'active'
  };

  var status = {};

  function saveStatus() {
    Database.set('status', state);
    $rootScope.$broadcast('statusChange', state);
  }

  function loadStatus() {
    log('loadStatus');
    Database.get('status').then(function (result) {
      // To handle missing fields in different version
      if (result.syncTime !== undefined) {
        state.syncTime = result.syncTime;
      }
      if (result.primaryCalendar !== undefined) {
        state.primaryCalendar = result.primaryCalendar;
      }
      if (result.connected !== undefined) {
        state.connected = result.connected;
      }
      if (result.online !== undefined) {
        state.online = result.online;
      }
      if (result.idle !== undefined) {
        state.idle = result.idle;
      }
      status.updateStatus('online', $window.navigator.onLine);
      chrome.idle.queryState(60, function (idle) {
        log('idle queryState ' + idle);
        status.updateStatus('idle', idle);
        $rootScope.$broadcast('statusChange', state);
      });
    }, function () {
      status.updateStatus('online', $window.navigator.onLine);
      chrome.idle.queryState(60, function (idle) {
        log('idle queryState ' + idle);
        status.updateStatus('idle', idle);
        $rootScope.$broadcast('statusChange', state);
      });
    });
  }

  status.updateStatus = function (field, value) {
    if (state[field] !== undefined && state[field] !== value) {
      log(field + ' changes to ' + value);
      state[field] = value;
      saveStatus();
    }
  };

  status.getStatus = function (field) {
    if (state[field] !== undefined) {
      return state[field];
    }
  };

  chrome.idle.setDetectionInterval(60);

  chrome.idle.onStateChanged.addListener(function (idle) {
    log('idle onStateChanged ' + idle + ' ' + new Date());
    status.updateStatus('idle', idle);
  });

  $window.addEventListener('offline', function () {
    status.updateStatus('online', false);
  });

  $window.addEventListener('online', function () {
    status.updateStatus('online', true);
  });

  loadStatus();

  return status;
});
