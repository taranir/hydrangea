var app = angular.module('moneystuff');

app.directive('transactionTable', ['dataService',  function (dataService, $filter) {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    
  }];

  var link = function($scope, element, attrs, controller, transcludeFn) {
    this.init = function() {
      $scope.userFilter = false;
      $scope.dateFilter = false;
      $scope.categoryFilter = false;
      $scope.transactionArray = dataService.getAllTransactionsFBArray();
      $scope.transactionArray.$loaded()
        .then(function() {
          console.log($scope.transactionArray);
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

    $scope.inputKeypress = function(event) {
      if (event.keyCode === 13) {
        $scope.addTransaction();
      }
    }

    $scope.addTransaction = function() {
      if ($scope.newTransaction.categories.length < 1) {
        console.log("Categories can't be blank");
      } else if ($scope.newTransaction.description.length < 1 ||
          $scope.newTransaction.amount == 0) {
        console.log("description or amount can't be blank");
      } else {
        $scope.newTransaction.categories = $scope.newTransaction.categories.split(",");
        dataService.saveNewTransaction($scope.newTransaction);
        $scope.newTransaction = dataService.getNewTransaction();
      }
    }

    $scope.renderDate = renderDate;

    $scope.deleteConfirmation = function(key) {
      $scope.transactionToDelete = $scope.transactionArray.$getRecord(key);
      $scope.keyToDelete = key;
      $('#delete-transaction-modal').modal('show');
    };

    $scope.deleteTransaction = function() {
      dataService.deleteTransaction($scope.keyToDelete);
      $scope.resetDelete();
    };

    $scope.resetDelete = function() {
      $scope.transactionToDelete = dataService.getNewTransaction();
      $scope.keyToDelete = null;
    };

    $scope.filterTransactions = function() {
      if ($scope.userFilter) {
      }
    };

  };

  return {
    restrict: 'E', //Default in 1.3+
    controller: controller,
    link: link,
    templateUrl: 'javascripts/transactionTable/transactionTableTemplate.html'
  };
}]);