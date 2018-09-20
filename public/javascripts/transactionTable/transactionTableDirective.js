var app = angular.module('moneystuff');

app.directive('transactionHeaders', function () {
  return {
    scope: { showDelete: '=' },
    controller: function($scope) {},
    templateUrl: 'javascripts/transactionTable/transactionHeaders.html',
  };
}).directive('transactionRow', function () {
  return {
    scope: {
      data: '=',
      selected: '=',
      allUsers: '=',
      showDelete: '=',
      isSelected: '=',
      saveSelected: '&',
      deleteConfirmation: '&'
    },
    controller: function($scope) {
      $scope.renderDate = renderDate;
      $scope.padAmount = padAmount;

      $scope.inputKeypress = function(event) {
        if (event.keyCode === 13) {
          $scope.saveSelected();
        }
      }
    },
    templateUrl: 'javascripts/transactionTable/transactionRow.html',
  };
}).directive('transactionInput', function () {
  return {
    scope: {
      transaction : '=',
      allUsers: '=',
      addTransaction: '&',
      isUpload: '='
    },
    controller: function($scope) {
      $scope.inputKeypress = function(event) {
        if (event.keyCode === 13) {
          $scope.addTransaction();
        }
      }
    },
    templateUrl: 'javascripts/transactionTable/transactionInput.html',
  };
});

app.directive('transactionTable', ['dataService', 'filterService', function (dataService, filterService, $filter) {
  var controller = ['$scope', 'dataService', 'filterService', function ($scope, dataService, filterService) {

  }];

  var link = function($scope, element, attrs, controller, transcludeFn) {

    this.init = function() {
      $scope.newTransaction = $scope.getNewTransaction();
      $scope.transactionErrors = [];

      $scope.allUsers = dataService.getUserOptions();

      $scope.transactionArray = dataService.getAllTransactionsFBArray();
    }

    $scope.$on('optionsUpdated', function() {
      console.log("got options broadcast");
      $scope.allUsers = dataService.getUserOptions();
      console.log($scope.allUsers);
    });

    $scope.getNewTransaction = function() {
      var nt = dataService.getNewTransaction();
      nt.usersInput = {};
      nt.shouldAdd = true;
      return nt;
    }

    var copyAsNewTransaction = function(transaction) {
      var copy = angular.copy(transaction);

      copy.usersInput = {};
      for (var i = 0; i < transaction.users.length; i++) {
        copy.usersInput[transaction.users[i]] = true;
      }
      // console.log($scope.allUsers);
      copy.categories = copy.categories.join(",");
      // console.log(copy);
      return copy;
    }

    $scope.inputKeypress = function(event) {
      if (event.keyCode === 13) {
        $scope.addTransaction();
      }
    }

    $scope.addTransaction = function() {
      $scope.prepAndAddTransaction($scope.newTransaction);
      if (!$scope.transactionErrors) {
        var oldTransaction = $scope.newTransaction;
        $scope.newTransaction = $scope.getNewTransaction();
        $scope.newTransaction.year = oldTransaction.year;
        $scope.newTransaction.day = oldTransaction.day;
        $scope.newTransaction.month = oldTransaction.month;
      }
    }

    $scope.saveSelected = function() {
      // console.log("save selected");
      // console.log($scope.selected);
      $scope.prepAndAddTransaction($scope.selected);
      $scope.selected = null;
      $scope.selectedId = null;
    }

    $scope.prepAndAddTransaction = function(transaction) {
      dataService.prepareTransaction(transaction);
      console.log("saving transaction:");
      console.log(transaction);

      // TODO: check for new users/categories/years

      var errors = dataService.validateTransaction(transaction);
      if (errors.length > 0) {
        $scope.transactionErrors = errors;
        console.log(errors);
      } else {
        $scope.transactionErrors = [];
        if (transaction.$id) {
          var id = transaction.$id;
          delete transaction.$id;
          dataService.updateTransaction(id, transaction)
        } else {
          dataService.saveNewTransaction(transaction);
        }
      }
    }

    $scope.deleteConfirmation = function(key) {
      console.log("deleteConfirmation in parent");
      $scope.transactionToDelete = $scope.transactionArray.$getRecord(key);
      $scope.keyToDelete = key;
      $('#delete-transaction-modal').modal('show');
    };

    $scope.deleteTransaction = function() {
      $scope.transactionArray.$remove($scope.transactionArray.$getRecord($scope.keyToDelete));
      // dataService.deleteTransaction($scope.keyToDelete);
      $scope.resetDelete();
    };

    $scope.clickTransaction = function(transaction) {
      // copyAsNewTransaction(transaction);
      // console.log(transaction.$id);
      $scope.selected = copyAsNewTransaction(transaction);
      $scope.selectedId = transaction.$id;
      // TODO: prep transaction
    };

    $scope.resetDelete = function() {
      $scope.transactionToDelete = dataService.getNewTransaction();
      $scope.keyToDelete = null;
    };

    $scope.shouldShowTransaction = function(transaction) {
      return filterService.shouldShowTransaction(transaction);
    };

    $scope.$watch('transactionArray',function(newVal,oldVal){
      // $scope.transactionsChanged();
    }, true);

    this.init();
  };

  return {
    restrict: 'E', //Default in 1.3+
    controller: controller,
    link: link,
    templateUrl: 'javascripts/transactionTable/transactionTableTemplate.html'
  };
}]);