var app = angular.module('moneystuff');
app.directive('piggy', function () {
  var controller = ['$scope', '$rootScope', 'dataService', 'filterService', function ($scope, $rootScope, dataService, filterService) {
    this.init = function() {
      var today = new Date();
      $scope.currentYear = today.getFullYear();
      $scope.currentMonth = today.getMonth() + 1;

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

      // $scope.budgetArray = dataService.getAllBudgetsFBArray();
      // $scope.budgetArray.$loaded()
      //   .then(function() {
      //     // console.log($scope.budgetArray);
      //     $scope.currentBudget = $scope.budgetArray[$scope.budgetArray.length -1];

      //     if ($scope.currentBudget.date != $scope.currentMonth) {
      //       var newBudget = getNewBudget($scope.currentBudget, $scope.currentMonth);
      //       // dataService.saveNewBudget(newBudget);
      //       $scope.currentBudget = $scope.budgetArray[$scope.budgetArray.length -1];
      //       console.log("new current budget date: " + $scope.currentBudget.date);
      //     }
      //   }).catch(function(error) {
      //     console.log("error fetching budgets", error);
      //   });

      $scope.transactions = dataService.getAllTransactionsFBArray();
      $scope.transactions.$loaded()
        .then(function() {
          $scope.transactionsChanged();
          // setTimeout(function(){ $scope.updateProgressBars(); }, 500);
        }).catch(function(error) {
          console.log("error fetching transactions", error)
        });
    };

    $scope.transactionsChanged = function() {
      $scope.calculateValues();
      // if ($scope.transactionArray && $scope.currentBudget) {
      //   $scope.updateValuesForMonth($scope.currentMonth)
      // }
    };

    var incrementValue = function(m, k, v) {
      if (!(k in m)) {
        m[k] = 0;
      }
      m[k] += v;
    }

    $scope.calculateValues = function() {
      console.log("calculating values");
      $scope.allYTD = {};
      $scope.allMTD = {};
      $scope.userYTD = {};
      $scope.userMTD = {};

      for (var ti = 0; ti < $scope.transactions.length; ti++) {
        var t = $scope.transactions[ti];

        for (var ci = 0; ci < t.categories.length; ci++) {
          var c = t.categories[ci];
          if (t.year == $scope.currentYear) {
            incrementValue($scope.allYTD, c, t.amount);
            // for each user
            for (var ui = 0; ui < t.users.length; ui++) {
              var u = t.users[ui];
              if (!(u in $scope.userYTD)) { $scope.userYTD[u] = {}; }
              incrementValue($scope.userYTD[u], c, t.amount);
            }

            if (t.month == $scope.currentMonth) {
              incrementValue($scope.allMTD, c, t.amount);

              // for each user
              for (var ui = 0; ui < t.users.length; ui++) {
                var u = t.users[ui];
                if (!(u in $scope.userMTD)) { $scope.userMTD[u] = {}; }
                incrementValue($scope.userMTD[u], c, t.amount);
              }
            }
          }
        }
      }
      console.log("done calculating");

      console.log($scope.allYTD);
      console.log($scope.allMTD);
      console.log($scope.userYTD);
      console.log($scope.userMTD);

      console.log("-----------------------------------------------");
      $scope.combinedMonthLabels = Object.keys($scope.allMTD);
      $scope.combinedMonthData = Object.keys($scope.allMTD).map(k => $scope.allMTD[k]);
      $scope.combinedMonthTotal = $scope.combinedMonthData.reduce((a, b) => a + b, 0);
      $scope.combinedYearLabels = Object.keys($scope.allYTD);
      $scope.combinedYearData = Object.keys($scope.allYTD).map(k => $scope.allYTD[k]);
      $scope.combinedYearTotal = $scope.combinedYearData.reduce((a, b) => a + b, 0);

      var tianMonth = $scope.userMTD["Tian"] || {};
      var tianYear = $scope.userYTD["Tian"] || {};
      $scope.tianMonthLabels = Object.keys(tianMonth);
      $scope.tianMonthData = Object.keys(tianMonth).map(k => tianMonth[k]);
      $scope.tianMonthTotal = $scope.tianMonthData.reduce((a, b) => a + b, 0);
      $scope.tianYearLabels = Object.keys(tianYear);
      $scope.tianYearData = Object.keys(tianYear).map(k => tianYear[k]);
      $scope.tianYearTotal = $scope.tianYearData.reduce((a, b) => a + b, 0);

      var joeMonth = $scope.userMTD["Joe"] || {};
      var joeYear = $scope.userYTD["Joe"] || {};
      $scope.joeMonthLabels = Object.keys(joeMonth);
      $scope.joeMonthData = Object.keys(joeMonth).map(k => joeMonth[k]);
      $scope.joeMonthTotal = $scope.joeMonthData.reduce((a, b) => a + b, 0);
      $scope.joeYearLabels = Object.keys(joeYear);
      $scope.joeYearData = Object.keys(joeYear).map(k => joeYear[k]);
      $scope.joeYearTotal = $scope.joeYearData.reduce((a, b) => a + b, 0);

      // $scope.combinedMonthLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      // $scope.combinedMonthData = [300, 500, 100];
      // $scope.combinedYearLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      // $scope.combinedYearData = [300, 500, 100];

      // $scope.tianMonthLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      // $scope.tianMonthData = [300, 500, 100];
      // $scope.tianYearLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      // $scope.tianYearData = [300, 500, 100];

      // $scope.joeMonthLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      // $scope.joeMonthData = [300, 500, 100];
      // $scope.joeYearLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      // $scope.joeYearData = [300, 500, 100];



      console.log("done");
    }
          // console.log(t.categories);

          // if (!(t.users in $scope.userYTD)) {
          //   $scope.userYTD[t.users] = 0;
          // }
          // if (!(t.categories in $scope.categoryYTD)) {
          //   $scope.categoryYTD[t.categories] = 0;
          // }
          // $scope.userYTD[t.users] += t.amount;
          // $scope.categoryYTD[t.categories] += t.amount;
    //     }

    //     // if (t.month == $scope.currentMonth && t.year == $scope.currentYear) {
    //     //   if (!(t.users in $scope.userMTD)) {
    //     //     $scope.userMTD[t.users] = 0;
    //     //   }
    //     //   if (!(t.categories in $scope.categoryMTD)) {
    //     //     $scope.categoryMTD[t.categories] = 0;
    //     //   }
    //     //   $scope.userMTD[t.users] += t.amount;
    //     //   $scope.categoryMTD[t.categories] += t.amount;
    //     // }

    //     // if (filterService.shouldShowTransaction($scope.transactions[i])) {

    //     // }
    //   }

    //   console.log("done calculating");
    // }

    // $scope.updateValuesForMonth = function(month) {
    //   // update aggregates
    //   var aggregates = aggregateTransactionsForMonth($scope.transactionArray, month);
    //   var aggregatesTotal = aggregateTransactions($scope.transactionArray);

    //   $scope.owes = aggregates[1];
    //   $scope.monthTotals = aggregates[0];
    //   var jot = $scope.owes.joe - $scope.owes.tian;

    //   // var jot = $scope.paid.tian - $scope.paid.joe;
    //   if (jot > 0) {
    //     $scope.paidText = "Joe owes Tian " + jot.toFixed(2);
    //   } else if (jot < 0) {
    //     $scope.paidText = "Tian owes Joe " + (-1 * jot).toFixed(2);
    //   } else {
    //     $scope.paidText = "All good";
    //   }

    //   $scope.owesTotal = aggregatesTotal[1];
    //   var jotTotal = $scope.owesTotal.joe - $scope.owesTotal.tian;

    //   // var jot = $scope.paid.tian - $scope.paid.joe;
    //   if (jotTotal > 0) {
    //     $scope.paidTextTotal = "Joe owes Tian Total " + jotTotal.toFixed(2);
    //   } else if (jotTotal < 0) {
    //     $scope.paidTextTotal = "Tian owes Joe Total " + (-1 * jotTotal).toFixed(2);
    //   } else {
    //     $scope.paidTextTotal = "All good";
    //   }

    //   updateBudget($scope.currentBudget, aggregates[0]);
    //   $scope.maxAmount = 0;
    //   for (var ui in aggregates[0]) {
    //     for (var ci in aggregates[0][ui]) {
    //       if (ci != 'Balance') {
    //         $scope.maxAmount = Math.max($scope.maxAmount, aggregates[0][ui][ci]);
    //       }
    //     }
    //   }
    //   $scope.budgetArray.$save($scope.budgetArray.$getRecord($scope.currentBudget.$id));
    //   $scope.updateProgressBars();

    //   $scope.aggregates = aggregates;
    //   // console.log("updateValuesForMonth");
    //   // console.log(aggregates);
    // }

    // $scope.updateProgressBars = function() {
    //   for (var user in {"all": 1, "tian": 1, "joe": 1}) {
    //     for (var category in $scope.currentBudget[user]) {
    //       var values = $scope.currentBudget[user][category];
    //       // console.log("values for ", category, values);
    //       var selector = "#" + user + "-" + category + "-progress";
    //       var bar = $(selector);
    //       bar.progress("set total", values[0]);
    //       bar.progress("set progress", values[2]);
    //     }
    //   }
    // };

    $scope.$watch('transactionArray',function(newVal,oldVal){
      $scope.transactionsChanged();
    }, true);

    // $scope.$watch('budgetArray',function(newVal,oldVal){
    //   // console.log("budget array changed");
    // }, true);

    // $scope.updateCurrentBudget = function() {
    //   $scope.currentBudget = $scope.budgetArray[$scope.budgetArray.length -1];
    //   if ($scope.currentBudgetMonth !== "") {
    //     angular.forEach($scope.budgetArray, function(b, i) {
    //       if ($scope.currentBudgetMonth == b.date) {
    //         console.log("found budget for ", $scope.currentBudgetMonth);
    //         $scope.currentBudget = b;
    //         console.log($scope.currentBudget);
    //       }
    //     });
    //     $scope.updateValuesForMonth($scope.currentBudgetMonth);
    //   }
    // }

    // $rootScope.$on('budgetChanged', function (event, data) {
    //   $scope.currentBudgetMonth = data.month;
    //   $scope.updateCurrentBudget();
    // });

    // $rootScope.$on('budgetReset', function(event, data) {
    //   $scope.currentBudgetMonth = "";
    //   $scope.updateCurrentBudget();
    // });

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
