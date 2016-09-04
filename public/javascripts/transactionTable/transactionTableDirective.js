var app = angular.module('moneystuff');


app.directive('transactionTable', ['dataService', function (dataService) {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    $scope.addTransaction = function() {
      $scope.newTransaction.categories = [$scope.newTransaction.categories];
      if ($scope.newTransaction.description.length < 1 ||
          $scope.newTransaction.amount == 0) {
        console.log("description or amount can't be blank")
      } else {
        dataService.saveNewTransaction($scope.newTransaction);
        $scope.newTransaction = dataService.getNewTransaction();
      }
    }

    $scope.renderDate = renderDate;

    // $scope.getAmountTotal = function() {
    //   return $scope.transactionArray.map(function(t) {
    //     return t.amount;
    //   }).reduce(function(a1, a2) {
    //     return a1 + a2;
    //   }, 0);
    // };

    $scope.deleteTransaction = function(key) {
      dataService.deleteTransaction(key);
    };
  }];

  var link = function($scope, element, attrs, controller, transcludeFn) {
    this.init = function() {
      $scope.transactionArray = dataService.getAllTransactionsFBArray();
      $scope.transactionArray.$loaded()
        .then(function() {
          console.log($scope.transactionArray);
          // filter by attrs 
          if ($scope.userFilter) {

          }
          if ($scope.dateFilter) {

          }
          if ($scope.categoryFilter) {

          }
        })
        .catch(function(error) {
          console.log("error fetching transactions", error)
        });
    }

    this.initializeNewTransaction = function() {
      var newTransaction = dataService.getNewTransaction();
      $scope.newTransaction = newTransaction;
    }

    $scope.inputKeypress = function(event) {
      if (event.keyCode === 13) {
        $scope.addTransaction();
      }
    }

    this.init();
    this.initializeNewTransaction();
  };

  return {
    restrict: 'E', //Default in 1.3+
    scope: {
      userFilter: '=',
      dateFilter: '=',
      categoryFilter: '='
    },
    controller: controller,
    link: link,
    templateUrl: 'javascripts/transactionTable/transactionTableTemplate.html'
  };
}]);