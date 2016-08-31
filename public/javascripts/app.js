'use strict';

angular
  .module('moneystuff', [
    'ngRoute',
    'firebase',
    'dataService'
  ])
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '<landing></landing>',
      });
  }]);