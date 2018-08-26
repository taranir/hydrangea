'use strict';

angular
  .module('moneystuff', [
    'ngRoute',
    'firebase',
    'chart.js',
    'ng-currency'
  ])
  .config(['$routeProvider', '$locationProvider', 'ChartJsProvider',
    function($routeProvider, $locationProvider, ChartJsProvider) {
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
      });
    ChartJsProvider.setOptions({
      global: {
        colors: ["#B388EB", "#577DDB", "#E5E5E5", "#8582E3", "#ffa28e", "#f3d980"],
      }
    });
  }]);