var app = angular.module('moneystuff');
app.directive('piggy', function () {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    this.init = function() {
      $scope.currentMonth = getMonth(new Date());

      $scope.budgetArray = dataService.getAllBudgetsFBArray();
      $scope.budgetArray.$loaded()
        .then(function() {
          $scope.currentBudget = $scope.budgetArray[$scope.budgetArray.length -1];
          console.log("got initial current budget");

          if ($scope.currentBudget.date != $scope.currentMonth) {
            console.log("wrong month, do something");
          }
        }).catch(function(error) {
          console.log("error fetching budgets", error);
        });

      $scope.transactionArray = dataService.getAllTransactionsFBArray();
      $scope.transactionArray.$loaded()
        .then(function() {
          $scope.transactionsChanged();
        }).catch(function(error) {
          console.log("error fetching transactions", error)
        });
    };

    $scope.transactionsChanged = function() {
      if ($scope.transactionArray && $scope.currentBudget) {
        // update aggregates
        var aggregates = aggregateTransactionsForMonth($scope.transactionArray, $scope.currentMonth);

        $scope.paid = aggregates[1];
        var jot = $scope.paid.tian - $scope.paid.joe;
        if (jot > 0) {
          $scope.paidText = "Joe owes Tian " + jot/2.0;
        } else if (jot < 0) {
          $scope.paidText = "Tian owes Joe " + jot/-2.0;
        } else {
          $scope.paidText = "All good";
        }

        // recalculate current budget
        updateBudget($scope.currentBudget, aggregates[0]);
        // save current budget
        $scope.budgetArray.$save($scope.currentbudget);
        // dataService.saveBudget($scope.currentBudget);
        // $scope.currentBudget.$save();
        $scope.updateProgressBars();
      }
    };

// {
//     "all": {
//         "categories": {
//             "food": [5432, 1234, 123],
//             "travel": [2356, 0, 0]
//         },
//         "rollover": {
//             "food": true
//         }
//     },
//     "date": "201609",
//     "joe": {
//         "categories": {
//             "electronics": [1234, 0, 0],
//             "games": [321, 12, 0]
//         },
//         "rollover": {
//             "games": true
//         }
//     },
//     "tian": {
//         "categories": {
//             "discretionary": [1335, 0, 0]
//         }
//     },
//     "$id": "201609",
//     "$priority": null
// }

    $scope.updateProgressBars = function() {
      for (var user in {"all": 1, "tian": 1, "joe": 1}) {
        for (var category in $scope.currentBudget[user]["categories"]) {
          var values = $scope.currentBudget[user]["categories"][category];
          var selector = "#" + user + "-" + category + "-progress";
          var bar = $(selector);
          bar.progress("set total", values[0]);
          bar.progress("set progress", values[2]);
        }
      }
    };

    $scope.$watch('transactionArray',function(newVal,oldVal){
      $scope.transactionsChanged();
    }, true);

    this.init();
  }];
  return {
    restrict: 'E', //Default in 1.3+
    scope: {
    },
    controller: controller,
    templateUrl: 'javascripts/piggyBar/piggyTemplate.html'
  };
});
