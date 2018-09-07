var app = angular.module('moneystuff');
app.directive('piggy', function () {
  var controller = ['$scope', '$rootScope', 'dataService', 'filterService', function ($scope, $rootScope, dataService, filterService) {
    this.init = function() {
      var today = new Date();
      $scope.currentYear = today.getFullYear();
      $scope.currentMonth = today.getMonth() + 1;

      $scope.transactions = dataService.getAllTransactionsFBArray();
      $scope.transactions.$loaded()
        .then(function() {
          $scope.transactionsChanged();
        }).catch(function(error) {
          console.log("error fetching transactions", error)
        });
    };

    $scope.transactionsChanged = function() {
      $scope.calculateValues();
    };

    var incrementValue = function(m, k, v) {
      if (!(k in m)) {
        m[k] = 0;
      }
      m[k] = Math.round((m[k] + v) * 100) / 100;
    }

    $scope.calculateValues = function() {
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
    }

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
