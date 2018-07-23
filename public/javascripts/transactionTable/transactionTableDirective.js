var app = angular.module('moneystuff');

app.directive('transactionHeaders', function () {
  return {
    scope: {},
    controller: function($scope) {},
    templateUrl: 'javascripts/transactionTable/transactionHeaders.html',
  };
}).directive('transactionRow', function () {
  return {
    scope: { data : '=' },
    controller: function($scope) {
      $scope.renderDate = renderDate;
      $scope.padAmount = padAmount;
    },
    templateUrl: 'javascripts/transactionTable/transactionColumns.html',
  };
});

// yattoApp.directive('reddit', function() {
//   return {
//     restrict: 'E',
//     transclude: true,
//     scope: { user : '@' },
//     controller: function($scope) {},
//     template: '<a href="http://www.reddit.com/user/{{user}}">/u/{{user}}</a>'
//   };
// });


// .directive('transaction', function () {
//   return {
//     scope: {
//       data: '='
//     },
//     templateUrl: 'javascripts/transactionTable/transactionTemplate.html',
//     // link: function(scope, element, attrs){

//     // }
//   };
// })

// return {
//     restrict: 'E', //Default in 1.3+
//     scope: {
//     },
//     controller: controller,
//     templateUrl: 'javascripts/piggyBar/piggyTemplate.html'
//   };

// .controller('Controller', ['$scope', function($scope) {
//   $scope.customer = {
//     name: 'Naomi',
//     address: '1600 Amphitheatre'
//   };
// }])
// .directive('myCustomer', function() {
//   return {
//     template: 'Name: {{customer.name}} Address: {{customer.address}}'
//   };
// });

app.directive('transactionTable', ['dataService', 'filterService', function (dataService, filterService, $filter) {
  var controller = ['$scope', 'dataService', 'filterService', function ($scope, dataService, filterService) {

  }];

  var link = function($scope, element, attrs, controller, transcludeFn) {
    this.init = function() {
      $scope.userFilter = "";
      $scope.categoryFilter = "";
      $scope.monthFilter = "";
      $scope.yearFilter = "";
      $scope.allMonths = getMonthNames();
      $scope.allMonths.unshift("");

      $scope.allUsers = dataService.getAllUsers();
      $scope.allCategories = dataService.getAllCategories();

      $scope.transactionArray = dataService.getAllTransactionsFBArray();
      $scope.transactionArray.$loaded()
        .then(function() {
          $scope.initialCheck();
          $scope.transactionsChanged();
          console.log("loaded transactions");
        })
        .catch(function(error) {
          console.log("error fetching transactions", error)
        });
    }

    $scope.initialCheck = function() {
      // check all transactions for users and categories
    }

    this.initializeNewTransaction = function() {
      var newTransaction = dataService.getNewTransaction();
      $scope.newTransaction = newTransaction;
    }

    this.init();
    this.initializeNewTransaction();

    $scope.updateFilter = function() {
      filterService.updateFilters($scope.userFilter, $scope.categoryFilter, $scope.monthFilter, $scope.yearFilter);
    }

    $scope.inputKeypress = function(event) {
      if (event.keyCode === 13) {
        $scope.addTransaction();
      }
    }

    $scope.addTransaction = function() {
      if ($scope.newTransaction.users.length < 1) {
        console.log("Users can't be blank");
      } else if ($scope.newTransaction.categories.length < 1) {
        console.log("Categories can't be blank");
      } else if ($scope.newTransaction.description.length < 1) {
        console.log("Description can't be blank");
      } else if ($scope.newTransaction.amount == 0) {
        console.log("Amount can't be 0");
      } else {
        $scope.newTransaction.users = $scope.newTransaction.users.split(",").map(function(s) { return s.trim(); });
        $scope.newTransaction.categories = $scope.newTransaction.categories.split(",").map(function(s) { return s.trim(); });
        dataService.saveNewTransaction($scope.newTransaction);
        var oldTransaction = $scope.newTransaction;
        $scope.newTransaction = dataService.getNewTransaction();
        $scope.newTransaction.year = oldTransaction.year;
        $scope.newTransaction.day = oldTransaction.day;
        $scope.newTransaction.month = oldTransaction.month;
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
      return filterService.shouldShowTransaction(transaction);
    };

    $scope.$watch('transactionArray',function(newVal,oldVal){
      $scope.transactionsChanged();
    }, true);

    $scope.transactionsChanged = function() {
      console.log("transactions changed");
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
    };

    $scope.setUserFilter = function(user) {
      $scope.userFilter = user;
      $scope.updateFilter();
    };
  };

  return {
    restrict: 'E', //Default in 1.3+
    controller: controller,
    link: link,
    templateUrl: 'javascripts/transactionTable/transactionTableTemplate.html'
  };
}]);