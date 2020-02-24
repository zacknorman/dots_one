/*global calendarApp: false */

calendarApp.controller('about', function ($scope, $http) {

  $http.get('manifest.json').success(function (data) {
    $scope.manifestData = data;
  });

});
