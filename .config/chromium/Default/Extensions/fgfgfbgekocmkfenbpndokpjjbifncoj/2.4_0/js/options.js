/*global calendarApp: false */

calendarApp.controller('options', function ($scope) {

  $scope.convertTimeString = function (value, zeroString) {
    console.log('convertTimeString ' + value);
    if (value === 0) {
      return zeroString;
    }
    return timeString(value);
  };
});
