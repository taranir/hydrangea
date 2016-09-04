'use strict';

angular
  .module('moneystuff', [
    'ngRoute',
    'firebase'
  ])
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        template: '<transaction-table></transaction-table>',
      })
      .when('/summary', {
        template: '<transaction-table></transaction-table>',
      })
      .when('/settings', {
        template: '<settings></settings>',
      })
  }]);