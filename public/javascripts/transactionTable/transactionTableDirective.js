var app = angular.module('moneystuff');
app.directive('transactionTable', function () {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    function init() {
      $scope.transactionArray = dataService.getAllTransactionsFBArray();
      $scope.transactionArray.$loaded()
        .then(function() {
          console.log($scope.transactionArray);
        })
        .catch(function(error) {
          console.log("error fetching transactions", error)
        });
      // sort array by date
    }
    init();
    $scope.newTransaction = dataService.getNewTransaction();
    $scope.newTransaction.users["joe"] = true;
    $scope.newTransaction.users["tian"] = true;
    $scope.newTransaction.categories["food"] = true;


    $scope.addTransaction = function() {
      dataService.saveNewTransaction($scope.newTransaction);
      $scope.newTransaction = dataService.getNewTransaction();
      $scope.newTransaction.users["joe"] = true;
      $scope.newTransaction.users["tian"] = true;
      $scope.newTransaction.categories["food"] = true;
    }

    $scope.amountTotal = function() {
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