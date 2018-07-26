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
      data : '=',
      showDelete: '=',
      deleteConfirmation: '&'
    },
    controller: function($scope) {
      $scope.renderDate = renderDate;
      $scope.padAmount = padAmount;
    },
    templateUrl: 'javascripts/transactionTable/transactionRow.html',
  };
});

app.directive('transactionTable', ['dataService', 'filterService', function (dataService, filterService, $filter) {
  var controller = ['$scope', 'dataService', 'filterService', function ($scope, dataService, filterService) {

  }];

  var link = function($scope, element, attrs, controller, transcludeFn) {

    this.init = function() {
      $scope.userFilter = "";
      $scope.categoryFilter = "";
      $scope.monthFilter = "";
      $scope.yearFilter = "";

      var firebaseUsers = dataService.getAllUsers();
      var firebaseCategories = dataService.getAllCategories();
      var firebaseTransactions = dataService.getAllTransactionsFBArray();
      $scope.transactionArray = firebaseTransactions;

      Promise.all([firebaseUsers.$loaded(), firebaseCategories.$loaded(), firebaseTransactions.$loaded()])
        .then(function(values) {
          $scope.calculateInitialValues(...values);
        })
        .catch(function(error) {
          console.log("error fetching data from firebase", error)
        });
    }

    $scope.calculateInitialValues = function(firebaseUsers, firebaseCategories, firebaseTransactions) {
      $scope.transactionArray = firebaseTransactions;

      var tYears = new Set();
      var tUsers = new Set();
      var tCategories = new Set();
      angular.forEach($scope.transactionArray, function(t) {
        tYears.add(t.year);
        for (var i = 0; i < t.users.length; i++) {
          tUsers.add(t.users[i]);
        }
        for (var i = 0; i < t.categories.length; i++) {
          tCategories.add(t.categories[i]);
        }
      });

      var fUsers = new Set();
      angular.forEach(firebaseUsers, function(u) {
        fUsers.add(u.$value);
      });

      var fCategories = new Set();
      angular.forEach(firebaseCategories, function(c) {
        fCategories.add(c.$value);
      });

      var allUsers = Array.from(union(tUsers, fUsers));
      if (difference(tUsers, fUsers).size > 0) {
        dataService.updateUsers(allUsers);
      }

      var allCategories = Array.from(union(tCategories, fCategories));
      if (difference(tCategories, fCategories).size > 0) {
        dataService.updateCategories(allCategories);
      }

      $scope.allUsers = Array.from(allUsers);
      $scope.allCategories = Array.from(allCategories);
      $scope.allMonths = getMonthNames();
      $scope.allYears = Array.from(tYears);

      console.log("firebase load finished");
      $scope.$apply();
      console.log("applied");
    }

    this.init();

    $scope.updateFilter = function() {
      filterService.updateFilters($scope.userFilter, $scope.categoryFilter, $scope.monthFilter, $scope.yearFilter);
    }

    $scope.inputKeypress = function(event) {
      if (event.keyCode === 13) {
        $scope.addTransaction();
      }
    }

    $scope.getNewTransaction = function() {
      var nt = dataService.getNewTransaction();
      nt.usersInput = {};
      return nt;
    }

    $scope.newTransaction = $scope.getNewTransaction();

    var prepareTransaction = function(t) {
      var u = t.usersInput;
      t.users = Object.keys(u).map(function(k) { if (u[k]) { return k; } }).filter(Boolean);
      delete t.usersInput;

      t.categories = t.categories.split(",").map(function(s) { return s.trim(); });
      t.date = processDate(parseInt(t.year), parseInt(t.month), parseInt(t.day));
      t.originalHash = t.date + t.amount + t.description;
    };

    var validateTransaction = function(t) {
      if (t.users.length < 1) {
        return "Users can't be blank";
      } else if (t.categories.length < 1) {
        return "Categories can't be blank";
      } else if (t.description.length < 1) {
        return "Description can't be blank";
      } else if (t.amount == 0) {
        return "Amount can't be 0";
      }
      return "";
    };

    $scope.addTransaction = function() {
      prepareTransaction($scope.newTransaction);
      console.log($scope.newTransaction);

      // TODO: check for new users/categories/years

      var error = validateTransaction($scope.newTransaction);
      if (error) {
        console.log(error);
      } else {
        dataService.saveNewTransaction($scope.newTransaction);
        var oldTransaction = $scope.newTransaction;
        $scope.newTransaction = $scope.getNewTransaction();
        $scope.newTransaction.year = oldTransaction.year;
        $scope.newTransaction.day = oldTransaction.day;
        $scope.newTransaction.month = oldTransaction.month;
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
  };

  return {
    restrict: 'E', //Default in 1.3+
    controller: controller,
    link: link,
    templateUrl: 'javascripts/transactionTable/transactionTableTemplate.html'
  };
}]);