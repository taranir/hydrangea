var app = angular.module('moneystuff');
app.directive('filter', function () {
  var controller = ['$scope', 'dataService', 'filterService', function ($scope, dataService, filterService) {
    function init() {
      $scope.userFilter = "";
      $scope.primaryFilter = "";
      $scope.secondaryFilter = "";
      $scope.monthFilter = "";
      $scope.yearFilter = "";

      $scope.allUsers = dataService.getUserOptions();
      $scope.allPrimaries = dataService.getPrimaryOptions();
      $scope.allSecondaries = dataService.getSecondaryOptions();
      $scope.allMonths = dataService.getMonthOptions();
      $scope.allYears = dataService.getYearOptions();
    }

    $scope.$on('optionsUpdated', function() {
      console.log("got options broadcast from filter directive");
      $scope.allUsers = dataService.getUserOptions();
      $scope.allPrimaries = dataService.getPrimaryOptions();
      $scope.allSecondaries = dataService.getSecondaryOptions();
      $scope.allMonths = dataService.getMonthOptions();
      $scope.allYears = dataService.getYearOptions();
      console.log($scope.allUsers);
    });

    $scope.updateFilter = function() {
      filterService.updateFilters(
        $scope.userFilter,
        $scope.primaryFilter,
        $scope.secondaryFilter,
        $scope.monthFilter,
        $scope.yearFilter);
    }

    init();
  }];
  return {
    restrict: 'E', //Default in 1.3+
    scope: {
    },
    controller: controller,
    templateUrl: 'javascripts/filtering/filterTemplate.html'
  };
});
