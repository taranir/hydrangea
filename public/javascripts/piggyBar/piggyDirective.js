var app = angular.module('moneystuff');
app.directive('piggy', function () {
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
            console.log("new current budget date: " + $scope.currentBudget.date);
          }
        }).catch(function(error) {
          console.log("error fetching budgets", error);
        });

      $scope.transactionArray = dataService.getAllTransactionsFBArray();
      $scope.transactionArray.$loaded()
        .then(function() {
          $scope.transactionsChanged();
          setTimeout(function(){ $scope.updateProgressBars(); }, 500);
        }).catch(function(error) {
          console.log("error fetching transactions", error)
        });
    };

    $scope.transactionsChanged = function() {
      if ($scope.transactionArray && $scope.currentBudget) {
        // update aggregates
        var aggregates = aggregateTransactionsForMonth($scope.transactionArray, $scope.currentMonth);

        $scope.owes = aggregates[1];
        $scope.monthTotals = aggregates[0];
        var jot = $scope.owes.joe - $scope.owes.tian;

        // var jot = $scope.paid.tian - $scope.paid.joe;
        if (jot > 0) {
          $scope.paidText = "Joe owes Tian " + jot.toFixed(2);
        } else if (jot < 0) {
          $scope.paidText = "Tian owes Joe " + (-1 * jot).toFixed(2);
        } else {
          $scope.paidText = "All good";
        }

        updateBudget($scope.currentBudget, aggregates[0]);
        $scope.budgetArray.$save($scope.budgetArray.$getRecord($scope.currentBudget.$id));
        $scope.updateProgressBars();
      }
    };

    $scope.updateProgressBars = function() {
      for (var user in {"all": 1, "tian": 1, "joe": 1}) {
        for (var category in $scope.currentBudget[user]) {
          var values = $scope.currentBudget[user][category];
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

    $scope.$watch('budgetArray',function(newVal,oldVal){
      // console.log("budget array changed");
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
