var app = angular.module('moneystuff');
app.directive('summary', function () {
  var controller = ['$scope', 'dataService', 'filterService', function ($scope, dataService, filterService) {
    function init() {
      var firebaseTransactions = dataService.getAllTransactionsFBArray();
      $scope.transactions = firebaseTransactions;
      $scope.matching = $scope.transactions.length;
      $scope.userYTD = {};
      $scope.userMTD = {};
      $scope.categoryYTD = {};
      $scope.categoryMTD = {};

      var today = new Date();
      $scope.currentYear = today.getFullYear();
      $scope.currentMonth = today.getMonth() + 1;

      firebaseTransactions.$loaded()
        .then(function(values) {
          $scope.calculateValues();
        })
        .catch(function(error) {
          console.log("error fetching data from firebase", error)
        });
    }

    $scope.calculateValues = function() {
      console.log("calculating values");
      $scope.matching = 0;

      $scope.userYTD = {};
      $scope.userMTD = {};
      $scope.categoryYTD = {};
      $scope.categoryMTD = {};

      for (var i = 0; i < $scope.transactions.length; i++) {
        var t = $scope.transactions[i];

        if (t.year == $scope.currentYear) {
          if (!(t.users in $scope.userYTD)) {
            $scope.userYTD[t.users] = 0;
          }
          if (!(t.categories in $scope.categoryYTD)) {
            $scope.categoryYTD[t.categories] = 0;
          }
          $scope.userYTD[t.users] += t.amount;
          $scope.categoryYTD[t.categories] += t.amount;
        }

        if (t.month == $scope.currentMonth && t.year == $scope.currentYear) {
          if (!(t.users in $scope.userMTD)) {
            $scope.userMTD[t.users] = 0;
          }
          if (!(t.categories in $scope.categoryMTD)) {
            $scope.categoryMTD[t.categories] = 0;
          }
          $scope.userMTD[t.users] += t.amount;
          $scope.categoryMTD[t.categories] += t.amount;
        }


        // if (!(t.users in $scope.aggregates)) {
        //   $scope.aggregates[t.users] = 0;
        // }
        // $scope.aggregates[t.users] += t.amount;

        if (filterService.shouldShowTransaction($scope.transactions[i])) {
          $scope.matching += 1;
        }
      }

      // per category, get
      // YTD, MTD
      console.log("done calculating");
    }

    $scope.$on('filterChanged', function() {
      console.log("got filter changed broadcast");
      $scope.calculateValues();
    });

    init();
  }];
  return {
    restrict: 'E', //Default in 1.3+
    scope: {
    },
    controller: controller,
    templateUrl: 'javascripts/summary/summaryTemplate.html'
  };
});
