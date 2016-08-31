'use strict';

angular
  .module('moneystuff', [
    'ngRoute',
    'firebase'
  ])
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        template: '<transaction-table></transaction-table>',
      });
  }]);