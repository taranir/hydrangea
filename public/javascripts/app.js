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
        template: '<transaction-table date-filter="currentMonth"></transaction-table>',
      })
      .when('/tian', {
        template: '<transaction-table user-filter="tian"></transaction-table>',
      })
      .when('/joe', {
        template: '<transaction-table user-filter="joe"></transaction-table>',
      })
      .when('/summary', {
        template: '<transaction-table></transaction-table>',
      })
      .when('/settings', {
        template: '<settings></settings>',
      })
  }]);