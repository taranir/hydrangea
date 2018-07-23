var app = angular.module('moneystuff');
app.directive('upload', function () {
  var controller = ['$scope', 'dataService', function ($scope, dataService) {
    function init() {}

    $scope.buttonPressed = function() {
      console.log("asdf");
    };

    $scope.upload = function(file) {
      var f = document.getElementById('file').files[0];
      var r = new FileReader();

      r.onloadend = function(e) {
        var data = e.target.result;
        processData(data);
      }

      r.readAsBinaryString(f);
    };

    var boaHeaders = ["Posted Date", "Reference Number", "Payee", "Address", "Amount"];
    var chaseHeaders = ["Type", "Trans Date", "Post Date", "Description", "Amount"];
    var citiHeaders = ["Status", "Date", "Description", "Debit", "Credit"];

    var convertBoaToTransactions = function(data) {
      console.log(data[0]);
      for (var i = 0; i < data.length; i++) {
        data[i]
      }
    };

    var convertChaseToTransactions = function(data) {

    };

    var convertCitiToTransactions = function(data) {

    };

    var processData = function(data) {
      console.log("process data");

      var rows = CSVToArray(data, ",");
      var headers = rows[0];
      var data = rows.slice(1);

      var transactions = [];
      if (arraysEqual(headers, boaHeaders)) {
        console.log("boa");
        transactions = convertBoaToTransactions(data);
      } else if (arraysEqual(headers, chaseHeaders)) {
        console.log("chase");
        transactions = convertChaseToTransactions(data);
      } else if (arraysEqual(headers, citiHeaders)) {
        console.log("citi");
        transactions = convertCitiToTransactions(data);
      } else {
        console.log("unknown");
      }

    };



    init();
  }];
  return {
    restrict: 'E', //Default in 1.3+
    scope: {
    },
    controller: controller,
    templateUrl: 'javascripts/upload/uploadTemplate.html'
  };
});
