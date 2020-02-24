/*global chrome: false */
/*global calendarApp: false */
/*global angular: false */
'use strict';

calendarApp.controller('main', function ($scope, $document, Alarm, Database) {

  var log = function (parm) {
    console.log('main ' + parm);
  };

  $scope.snooze = Alarm.snooze;
  $scope.cancelSnooze = Alarm.cancelSnooze;

  $scope.dismiss = function () {
    log('dismiss');
    angular.forEach($scope.eventArray, function (event) {
      if (event.id === $scope.selected) {
        log('dismiss event ' + event.id);
        $scope.events[event.calendarId][event.id].dismissStatus = true;
        updateDismissSync(event.id);
        chrome.notifications.clear(event.id, function () {});
      }
    });
  };

  $scope.dismissAll = function () {
    log('dismissAll');
    if ($scope.eventArray.length > 0) {
      angular.forEach($scope.eventArray, function (event) {
        log('dismissAll event ' + event.id);
        $scope.events[event.calendarId][event.id].dismissStatus = true;
        updateDismissSync(event.id);
        chrome.notifications.clear(event.id, function () {});
      });
    }
  };

  $scope.dismissOverdues = function () {
    log('dismissOverdues');
    if ($scope.eventArray.length > 0) {
      var currentTime = new Date();
      angular.forEach($scope.eventArray, function (event) {
        if (currentTime > new Date(event.startTime)) {
          log('clear overdue event ' + event.id);
          $scope.events[event.calendarId][event.id].dismissStatus = true;
          updateDismissSync(event.id);
          chrome.notifications.clear(event.id, function () {});
        }
      });
    }
  };

  function updateDismissSync(id) {
    Database.get('dismiss', true).then(function (results) {
      var found = false;
      results.forEach(function (result) {
        if (result === id) {
          found = true;
        }
      });
      if (found === false) {
        // make sure dismiss list won't go above 200
        if (results.length >= 200) {
          results.shift();
        }
        results.push(id);
        Database.set('dismiss', results, true);
      }
    }, function () {
      Database.set('dismiss', [id], true);
    });
  }

  // Event binding

  $document.bind('keyup', function (event) {
    switch (event.keyCode) {
    case 46: // delete
      $scope.$apply(function () {
        $scope.dismiss();
      });
      break;
    case 40: // down
      if ($scope.selectIndex() < $scope.eventArray.length - 1) {
        $scope.$apply(function () {
          $scope.select($scope.eventArray[$scope.selectIndex() + 1].id);
          log('selected ' + $scope.selected);
        });
      }
      break;
    case 38: // up
      if ($scope.selectIndex() > 0) {
        $scope.$apply(function () {
          $scope.select($scope.eventArray[$scope.selectIndex() - 1].id);
          log('selected ' + $scope.selected);
        });
      }
      break;
    default:
      log('keyup is not recognized ' + event.keyCode);
      break;
    }
  });
});
