var app = angular.module('moneystuff');
app.directive('piggy', function () {
  var controller = ['$scope', '$rootScope', 'dataService', 'filterService', function ($scope, $rootScope, dataService, filterService) {
    this.init = function() {
      $scope.currentMonth = getMonth(new Date());
      $scope.combinedMonthLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      $scope.combinedMonthData = [300, 500, 100];
      $scope.combinedYearLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      $scope.combinedYearData = [300, 500, 100];

      $scope.tianMonthLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      $scope.tianMonthData = [300, 500, 100];
      $scope.tianYearLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      $scope.tianYearData = [300, 500, 100];

      $scope.joeMonthLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      $scope.joeMonthData = [300, 500, 100];
      $scope.joeYearLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      $scope.joeYearData = [300, 500, 100];
      //////////////////////////////////////////////////////////////////

      $scope.budgetArray = dataService.getAllBudgetsFBArray();
      $scope.budgetArray.$loaded()
        .then(function() {
          // console.log($scope.budgetArray);
          $scope.currentBudget = $scope.budgetArray[$scope.budgetArray.length -1];

          if ($scope.currentBudget.date != $scope.currentMonth) {
            var newBudget = getNewBudget($scope.currentBudget, $scope.currentMonth);
            // dataService.saveNewBudget(newBudget);
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
        $scope.updateValuesForMonth($scope.currentMonth)
      }
    };

    $scope.updateValuesForMonth = function(month) {
      // update aggregates
      var aggregates = aggregateTransactionsForMonth($scope.transactionArray, month);
      var aggregatesTotal = aggregateTransactions($scope.transactionArray);

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

      $scope.owesTotal = aggregatesTotal[1];
      var jotTotal = $scope.owesTotal.joe - $scope.owesTotal.tian;

      // var jot = $scope.paid.tian - $scope.paid.joe;
      if (jotTotal > 0) {
        $scope.paidTextTotal = "Joe owes Tian Total " + jotTotal.toFixed(2);
      } else if (jotTotal < 0) {
        $scope.paidTextTotal = "Tian owes Joe Total " + (-1 * jotTotal).toFixed(2);
      } else {
        $scope.paidTextTotal = "All good";
      }

      updateBudget($scope.currentBudget, aggregates[0]);
      $scope.maxAmount = 0;
      for (var ui in aggregates[0]) {
        for (var ci in aggregates[0][ui]) {
          if (ci != 'Balance') {
            $scope.maxAmount = Math.max($scope.maxAmount, aggregates[0][ui][ci]);
          }
        }
      }
      $scope.budgetArray.$save($scope.budgetArray.$getRecord($scope.currentBudget.$id));
      $scope.updateProgressBars();

      $scope.aggregates = aggregates;
      // console.log("updateValuesForMonth");
      // console.log(aggregates);
    }

    $scope.updateProgressBars = function() {
      for (var user in {"all": 1, "tian": 1, "joe": 1}) {
        for (var category in $scope.currentBudget[user]) {
          var values = $scope.currentBudget[user][category];
          // console.log("values for ", category, values);
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

    $scope.updateCurrentBudget = function() {
      $scope.currentBudget = $scope.budgetArray[$scope.budgetArray.length -1];
      if ($scope.currentBudgetMonth !== "") {
        angular.forEach($scope.budgetArray, function(b, i) {
          if ($scope.currentBudgetMonth == b.date) {
            console.log("found budget for ", $scope.currentBudgetMonth);
            $scope.currentBudget = b;
            console.log($scope.currentBudget);
          }
        });
        $scope.updateValuesForMonth($scope.currentBudgetMonth);
      }
    }

    $rootScope.$on('budgetChanged', function (event, data) {
      $scope.currentBudgetMonth = data.month;
      $scope.updateCurrentBudget();
    });

    $rootScope.$on('budgetReset', function(event, data) {
      $scope.currentBudgetMonth = "";
      $scope.updateCurrentBudget();
    });

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
