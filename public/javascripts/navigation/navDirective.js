var app = angular.module('moneystuff');
app.directive('navigation', function () {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    function init() {}
    init();

    $scope.links = [
      ['All', '/all'],
      ['Tian', '/tianpage'],
      ['Joe', '/joepage'],
      ['Summary', '/summary'],
      ['Settings', '/settings']

    $scope.navigate = function (url) {
      console.log(url);
    };
  }];
  return {
    restrict: 'E', //Default in 1.3+
    scope: {
    },
    controller: controller,
    templateUrl: 'javascripts/navigation/navTemplate.html'
  };
});
