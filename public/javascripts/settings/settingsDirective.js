var app = angular.module('moneystuff');
app.directive('settings', function () {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    this.init = function() {
      $scope.newBudget = getNewBudget();
    };

    var getNewBudget = function() {
      var budget = dataService.getNewBudget();
      budget.filter["usersInput"] = "";
      budget.filter["categoriesInput"] = "";
      return budget;
    };

    $scope.inputKeypress = function(event) {
      if (event.keyCode === 13) {
        $scope.addBudget();
      }
    }

    var prepareBudget = function(b) {
      // TODO: convert user/categories inputs to lists
    };

    var validateBudget = function(b) {
      return "";
    };

    $scope.addBudget = function() {
      prepareBudget($scope.newBudget);
      console.log($scope.newBudget);

      var error = validateBudget($scope.newBudget);
      if (error) {
        console.log(error);
      } else {
        dataService.saveNewBudget($scope.newBudget);
        $scope.newBudget = getNewBudget();
      }
    }

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
