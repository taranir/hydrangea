var app = angular.module('moneystuff');
app.directive('transactionTable', function () {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    function init() {
      var transactionArray = dataService.getAllTransactionsFBArray();
      transactionArray.$loaded()
        .then(function() {
          console.log("initializing table");

          // convert json to array
          $scope.transactionList = _.sortBy(transactionArray, function(t) {
            return t.date;
          });

          console.log($scope.transactionList);
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