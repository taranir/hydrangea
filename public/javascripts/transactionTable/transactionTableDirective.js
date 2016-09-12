var app = angular.module('moneystuff');

app.directive('transactionTable', ['dataService',  function (dataService, $filter) {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {

  }];

  var link = function($scope, element, attrs, controller, transcludeFn) {
    this.init = function() {
      $scope.userFilter = "";
      $scope.dateFilter = "";
      $scope.categoryFilter = "";
      $scope.transactionArray = dataService.getAllTransactionsFBArray();
      $scope.transactionArray.$loaded()
        .then(function() {
          $scope.transactionsChanged();
          console.log("loaded transactions");
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
        $scope.newTransaction.categories = $scope.newTransaction.categories.split(",").map(function(s) { return s.trim(); });
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
      $scope.transactionArray.$remove($scope.transactionArray.$getRecord($scope.keyToDelete));
      // dataService.deleteTransaction($scope.keyToDelete);
      $scope.resetDelete();
    };

    $scope.resetDelete = function() {
      $scope.transactionToDelete = dataService.getNewTransaction();
      $scope.keyToDelete = null;
    };

    $scope.shouldShowTransaction = function(transaction) {
      if ($scope.userFilter != "") {
        if (transaction.user != $scope.userFilter) {
          return false;
        }
      }
      if ($scope.categoryFilter != "") {
        if (transaction.categories.indexOf($scope.categoryFilter) == -1) {
          return false;
        }
      }
      return true;
    };

    $scope.padAmount = function(a) {
      var s = '$' + a.toFixed(2);
      return (Array(12).join(" ") + s).substring(s.length);
    };

    $scope.$watch('transactionArray',function(newVal,oldVal){
      $scope.transactionsChanged();
    }, true);

    $scope.transactionsChanged = function() {
      console.log("transactions changed");
      var allCategories = {};
      angular.forEach($scope.transactionArray, function(t) {
        angular.forEach(t.categories, function(c) {
          allCategories[c] = true;
        });
      });
      $scope.allCategories = Object.keys(allCategories);
    };
  };

  return {
    restrict: 'E', //Default in 1.3+
    controller: controller,
    link: link,
    templateUrl: 'javascripts/transactionTable/transactionTableTemplate.html'
  };
}]);