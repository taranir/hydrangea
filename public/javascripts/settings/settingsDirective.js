var app = angular.module('moneystuff');
app.directive('settings', function () {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    this.init = function() {
      $scope.currentMonth = getMonth(new Date());

      $scope.budgetArray = dataService.getAllBudgetsFBArray();
      $scope.budgetArray.$loaded()
        .then(function() {
          $scope.currentBudget = $scope.budgetArray[$scope.budgetArray.length -1];

          if ($scope.currentBudget.date != $scope.currentMonth) {
            var newBudget = getNewBudget($scope.currentBudget, $scope.currentMonth);
            dataService.saveNewBudget(newBudget);
            $scope.currentBudget = $scope.budgetArray[$scope.budgetArray.length -1];
          }
        }).catch(function(error) {
          console.log("error fetching budgets", error);
        });
    };

    $scope.updateBudget = function() {
      // console.log($scope.currentBudget);
      $scope.budgetArray.$save($scope.budgetArray.$getRecord($scope.currentBudget.$id));
    };

    this.init();

  }];
  return {
    restrict: 'E', //Default in 1.3+
    scope: {
    },
    controller: controller,
    templateUrl: 'javascripts/settings/settingsTemplate.html'
  };
});
