var app = angular.module('moneystuff');
app.directive('navDirective', function () {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    function init() {}
    init();
    $scope.links = [
      ['All', '/all'],
      ['Tian', '/tianpage'],
      ['Joe', '/joepage'],
      ['Summary', '/summary'],
      ['Settings', '/settings']
    ]
    dataService.asdf();
    // $scope.tests = dataService.getAllTestsFBObj();
    // $scope.asdf = {
    //   test: "alskdjf"
    // };
    $scope.navigate = function (url) {
      console.log(url);
      dataService.asdf();
      // $scope.asdf = $firebaseObject(dataService.getRef());
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