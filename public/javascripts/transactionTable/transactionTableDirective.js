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

      Promise.all([firebaseUsers.$loaded(), firebaseCategories.$loaded(), firebaseTransactions.$loaded()])
        .then(function(values) {
          console.log("In all loaded promise");
          console.log(values);
          console.log(firebaseUsers);
          console.log(firebaseCategories);

          $scope.transactionArray = firebaseTransactions;

          var filterYears = new Set([""]);

          var tUsers = new Set();
          var tCategories = new Set();
          angular.forEach($scope.transactionArray, function(t) {
            filterYears.add(t.year);
            // tUsers.addAll(t.users);
          });

          var filterUsers = new Set([""]);
          // TODO: change to array.map?
          angular.forEach(firebaseUsers, function(u) {
            filterUsers.add(u.$value);
          });

          // TODO: if union(tUsers, filterUsers) != filterUsers, update firebaseUsers

          $scope.allUsers = filterUsers;
          $scope.allCategories

          $scope.allMonths = getMonthNames();
          $scope.allMonths.unshift("");
          $scope.allYears = Array.from(filterYears);


          $scope



          // $scope.initialCheck();
        });

      $scope.allUsers = dataService.getAllUsers();
      $scope.allCategories = dataService.getAllCategories();
      $scope.allCategories.$loaded()
        .then(function() {
          console.log("-------------------------------------");
          console.log(typeof $scope.allCategories);
          console.log($scope.allCategories);
        });
      $scope.transactionArray = dataService.getAllTransactionsFBArray();
      $scope.transactionArray.$loaded()
        .then(function() {
          $scope.initialCheck();
          // $scope.transactionsChanged();
          console.log("loaded transactions");
        })
        .catch(function(error) {
          console.log("error fetching transactions", error)
        });
    }

    this.init();

    $scope.initialCheck = function() {



      // var allUsers = {};
      // var allCategories = {};
      // var allYears = {};
      // angular.forEach($scope.transactionArray, function(t) {
      //   angular.forEach(t.users, function(c) {
      //     allUsers[c] = true;
      //   });
      //   angular.forEach(t.categories, function(c) {
      //     allCategories[c] = true;
      //   });
      //   var date = renderDate(t["date"]).split("/");
      //   allYears[date[2]] = true;
      // });
      // $scope.allCategories = Object.keys(allCategories);
      // $scope.allCategories.unshift("");
      // $scope.allCategories = Object.keys(allCategories);
      // $scope.allCategories.unshift("");
      // $scope.allYears = Object.keys(allYears);
      // $scope.allYears.unshift("");
    }

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
      var users = t.usersInput;
      t.users = Object.keys(users).map(function(k) { if (users[k]) { return k; } }).filter(Boolean);
      t.categories = t.categories.split(",").map(function(s) { return s.trim(); });
      t.date = processDate(parseInt(t.year), parseInt(t.month), parseInt(t.day));
      t.originalHash = t.date + t.amount + t.description;
    }

    $scope.addTransaction = function() {
      prepareTransaction($scope.newTransaction);
      console.log($scope.newTransaction);

      // TODO: check for new users/categories/years

      if ($scope.newTransaction.users.length < 1) {
        console.log("Users can't be blank");
      } else if ($scope.newTransaction.categories.length < 1) {
        console.log("Categories can't be blank");
      } else if ($scope.newTransaction.description.length < 1) {
        console.log("Description can't be blank");
      } else if ($scope.newTransaction.amount == 0) {
        console.log("Amount can't be 0");
      } else {
        dataService.saveNewTransaction($scope.newTransaction);
        var oldTransaction = $scope.newTransaction;
        $scope.newTransaction = $scope.getNewTransaction();
        $scope.newTransaction.year = oldTransaction.year;
        $scope.newTransaction.day = oldTransaction.day;
        $scope.newTransaction.month = oldTransaction.month;
      }
    }

    // $scope.renderDate = renderDate;

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

    // $scope.transactionsChanged = function() {
    //   console.log("transactions changed");
      // TODO: check for new users/categories (check on add?)
      // TODO: initial check that checks all transactions,
      // var allUsers = {};
      // var allCategories = {};
      // var allYears = {};
      // angular.forEach($scope.transactionArray, function(t) {
      //   angular.forEach(t.users, function(c) {
      //     allUsers[c] = true;
      //   });
      //   angular.forEach(t.categories, function(c) {
      //     allCategories[c] = true;
      //   });
      //   var date = renderDate(t["date"]).split("/");
      //   allYears[date[2]] = true;
      // });
      // $scope.allCategories = Object.keys(allCategories);
      // $scope.allCategories.unshift("");
      // $scope.allCategories = Object.keys(allCategories);
      // $scope.allCategories.unshift("");
      // $scope.allYears = Object.keys(allYears);
      // $scope.allYears.unshift("");
    // };

    // $scope.setUserFilter = function(user) {
    //   $scope.userFilter = user;
    //   $scope.updateFilter();
    // };
  };

  return {
    restrict: 'E', //Default in 1.3+
    controller: controller,
    link: link,
    templateUrl: 'javascripts/transactionTable/transactionTableTemplate.html'
  };
}]);