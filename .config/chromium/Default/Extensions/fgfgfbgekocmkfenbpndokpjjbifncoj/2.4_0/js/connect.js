/*global calendarApp: false */

calendarApp.controller('connect', function ($scope, Server, Push) {

  $scope.signButton = function () {
    if ($scope.status.connected) {
      Push.clear();
      Server.revokeToken().then(function () {
        $scope.clearData();
        $scope.status.syncTime = null;
      });
    } else {
      Push.register().then(function () {
        $scope.syncAll(true);
      });
    }
  };

  $scope.setCalendarColor = function (calendar) {
    if (calendar.enabled) {
      return {
        'background': $scope.colors.calendar[calendar.colorId].background
      };
    }
    return {
      'background': '#fff',
      'border': '1px solid #dcdcdc'
    };
  };

  $scope.allCalendar = function (enable) {
    angular.forEach($scope.calendars, function (calendar) {
      calendar.enabled = enable;
    });
  };

  $scope.setOpacity = function (show) {
    if (show) {
      return {
        'opacity': 1
      };
    }
    return {
      'opacity': 0.4
    };
  };
});
