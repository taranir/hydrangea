var app = angular.module('moneystuff');
app.directive('settings', function () {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    function init() {
      // $scope.transactionArray = dataService.getAllTransactionsFBArray();
      // $scope.proposedBudget = dataService.getProposedBudgetFBObj();
    }
    init();

  }];
  return {
    restrict: 'E', //Default in 1.3+
    scope: {
    },
    controller: controller,
    templateUrl: 'javascripts/settings/settingsTemplate.html'
  };
});
