var app = angular.module('moneystuff');
console.log("asldkjflakjd");
app.directive('isolateScopeWithController', function () {
  console.log("aaaa");
  var controller = ['$scope', function ($scope) {
    function init() {
      console.log("init");

        // $scope.items = angular.copy($scope.datasource);
      }
      init();

      $scope.addItem = function () {
        console.log("asdf");
              // $scope.add();

              // //Add new customer to directive scope
              // $scope.items.push({
              //     name: 'New Directive Controller Item'
              // });
      };
    }
  ];
  var template = '<button class="ui button" ng-click="addItem()">Add Item</button>';
  console.log("aaaaaaaaaa");
  return {
    restrict: 'E', //Default in 1.3+
    scope: {
              // datasource: '=',
              // add: '&',
    },
    controller: controller,
    template: template
  };
});