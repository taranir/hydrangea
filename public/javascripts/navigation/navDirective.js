var app = angular.module('moneystuff');
app.directive('navigation', function () {
  var controller = ['$scope', '$location', 'dataService', function ($scope, $location, dataService) {
    function init() {}
    init();

    $scope.links = [
      ['Transactions', '/'],
      ['Summary', '/summary'],
      ['Settings', '/settings'],
      ['Upload', '/upload']
    ];

    $scope.navigate = function (url) {
      $location.path(url);
    };

    $scope.login = function() {
      dataService.login($scope.email, $scope.password);
    }

    $scope.isLoggedIn = function () {
      return dataService.isLoggedIn();
    }

  }];
  return {
    restrict: 'E', //Default in 1.3+
    scope: {
    },
    controller: controller,
    templateUrl: 'javascripts/navigation/navTemplate.html'
  };
});
