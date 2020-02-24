/*global calendarApp: false */

calendarApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.
    when('/main', {
      templateUrl: 'template/main.html'
    }).
    when('/options', {
      templateUrl: 'template/options.html'
    }).
    when('/connect', {
      templateUrl: 'template/connect.html'
    }).
    when('/about', {
      templateUrl: 'template/about.html'
    }).
    otherwise({
      redirectTo: '/main'
    });
  }
]);
