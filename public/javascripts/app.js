'use strict';

angular
  .module('moneystuff', [
    'ngRoute',
    'firebase',
    'chart.js'
  ])
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        template: '<transaction-table></transaction-table>',
      })
      .when('/summary', {
        template: '<summary></summary>',
      })
      .when('/settings', {
        template: '<settings></settings>',
      })
      .when('/upload', {
        template: '<upload></upload>',
      })
  }]);