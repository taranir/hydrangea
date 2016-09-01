var app = angular.module('moneystuff');
app.directive('piggy', function () {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    function init() {}
    init();
  }];
  return {
    restrict: 'E', //Default in 1.3+
    scope: {
    },
    controller: controller,
    templateUrl: 'javascripts/piggyBar/piggyTemplate.html'
  };
});
