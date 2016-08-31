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