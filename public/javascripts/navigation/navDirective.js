var app = angular.module('moneystuff');
app.directive('navigation', function () {
  var controller = ['$scope', '$location', 'dataService', function ($scope, $location, dataService) {
    function init() {}
    init();

    $scope.links = [
      ['All', '/all'],
      ['Tian', '/tian'],
      ['Joe', '/joe'],
      ['Summary', '/summary'],
      ['Settings', '/settings']
    ];

    $scope.navigate = function (url) {
      $location.path(url);
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
