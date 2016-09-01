var app = angular.module('moneystuff');
app.directive('transactionTable', function () {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    this.init = function() {
      $scope.transactionArray = dataService.getAllTransactionsFBArray();
      $scope.transactionArray.$loaded()
        .then(function() {
          console.log($scope.transactionArray);
          aggregateTransactions($scope.transactionArray);
        })
        .catch(function(error) {
          console.log("error fetching transactions", error)
        });
    }

    this.initializeNewTransaction = function() {
      var newTransaction = dataService.getNewTransaction();
      $scope.newTransaction = newTransaction;
    }

    this.init();
    this.initializeNewTransaction();

    $scope.addTransaction = function() {
      if ($scope.newTransaction.description.length < 1 ||
          $scope.newTransaction.amount == 0) {
        console.log("description or amount can't be blank")
      } else {
        dataService.saveNewTransaction($scope.newTransaction);
        $scope.newTransaction = dataService.getNewTransaction();
      }
    }

    $scope.inputKeypress = function(event) {
      if (event.keyCode === 13) {
        $scope.addTransaction();
      }
    }

    $scope.getAmountTotal = function() {
      return $scope.transactionArray.map(function(t) {
        return t.amount;
      }).reduce(function(a1, a2) {
        return a1 + a2;
      }, 0);
    };

    }
  ];
  return {
    restrict: 'E', //Default in 1.3+
    scope: {
      userFilter: '=',
      dateFilter: '=',

    },
    controller: controller,
    templateUrl: 'javascripts/transactionTable/transactionTableTemplate.html'
  };
});