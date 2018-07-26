var app = angular.module('moneystuff');
app.directive('settings', function () {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    this.init = function() {
      $scope.newBudget = getNewBudget();

      var firebaseUsers = dataService.getAllUsers();
      firebaseUsers.$loaded()
        .then(function(v) {
          var users = new Set();
          angular.forEach(firebaseUsers, function(u) {
            users.add(u.$value);
          });

          $scope.allUsers = Array.from(users);
        });
    };

    var getNewBudget = function() {
      var budget = dataService.getNewBudget();
      budget.filter["usersInput"] = {};
      budget.filter["categoriesInput"] = "";
      return budget;
    };

    $scope.inputKeypress = function(event) {
      if (event.keyCode === 13) {
        $scope.addBudget();
      }
    }

    var prepareBudget = function(b) {
      var u = b.filter.usersInput;
      b.filter.users = Object.keys(u).map(function(k) { if (u[k]) { return k; } }).filter(Boolean);
      delete b.filter.usersInput;

      var c = b.filter.categoriesInput;
      b.filter.categories = c.split(",").map(function(s) { return s.trim(); });
      delete b.filter.categoriesInput;

      b.currentLimit = b.amount;
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
