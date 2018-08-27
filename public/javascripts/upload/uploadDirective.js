var app = angular.module('moneystuff');
app.directive('upload', function () {
  var controller = ['$scope', '$timeout', 'dataService', function ($scope, $timeout, dataService) {
    function init() {
      console.log("init");

      var firebaseUsers = dataService.getAllUsers();
      firebaseUsers.$loaded()
        .then(function() {
          var fUsers = new Set();
          angular.forEach(firebaseUsers, function(u) {
            fUsers.add(u.$value);
          });
          $timeout(function() {
            $scope.allUsers = Array.from(fUsers);
          });
        });
    }

    $scope.buttonPressed = function() {
      console.log("asdf");
    };

    $scope.upload = function(file) {
      var f = document.getElementById('file').files[0];
      var r = new FileReader();

      r.onloadend = function(e) {
        var data = e.target.result;
        processData(data);
        $scope.$apply();
      }

      r.readAsBinaryString(f);
    };

    var boaHeaders = ["Posted Date", "Reference Number", "Payee", "Address", "Amount"];
    var citiHeaders = ["Status", "Date", "Description", "Debit", "Credit"];
    var chaseHeaders = ["Type", "Trans Date", "Post Date", "Description", "Amount"];

    var getNewTransactionWithDate = function(date) {
      var parts = date.split("/");
      var t = dataService.getNewTransaction();
      t.year = parseInt(parts[2]);
      t.month = parseInt(parts[0]);
      t.day = parseInt(parts[1]);
      t.date = processDate(parts[2], parts[0], parts[1]);
      return t;
    }

    //MM/DD/YYYY
    var convertBoaToTransactions = function(data) {
      var transactions = [];
      for (var i = 0; i < data.length; i++) {
        var d = data[i];

        var refNumber = d[1];
        var description = d[2].trim();
        var amount = d[4];

        if (description.toLowerCase().indexOf("online payment") > -1) {
          // is a payment
          continue;
        }

        var t = getNewTransactionWithDate(d[0]);
        t.amount = parseFloat(amount) * -1;
        t.description = description;
        t.usersInput = {};
        t.usersInput["Joe"] = true;
        t.originalHash = [t.date, t.amount, t.description].join(".");
        t.shouldAdd = true;
        transactions.push(t);
      }
      return transactions;
    };

    var convertCitiToTransactions = function(data) {
      var transactions = [];
      for (var i = 0; i < data.length; i++) {
        var d = data[i];
        var description = d[2].trim();
        var debit = d[3];
        var credit = d[4];
        if (d[1] > "02/05/2018") {
          debit = d[4];
          credit = d[3];
        }

        if (description.toLowerCase().indexOf("online payment") > -1) {
          // is a payment
          continue;
        }

        var t = getNewTransactionWithDate(d[1]);
        t.amount = debit ? parseFloat(debit) : parseFloat(credit) * -1;
        t.description = description;
        t.usersInput = {};
        t.usersInput["Tian"] = true;
        t.originalHash = [t.date, t.amount, t.description].join(".");
        t.shouldAdd = true;
        transactions.push(t);
      }
      return transactions;
    };

    var convertChaseToTransactions = function(data) {
      var transactions = [];
      for (var i = 0; i < data.length; i++) {
        var d = data[i];
        var description = d[3].trim();
        var amount = d[4];

        if (d[0] == "Payment") {
          continue;
        }

        var t = getNewTransactionWithDate(d[1]);
        t.amount = parseFloat(amount) * -1;
        t.description = description;
        t.usersInput = {};
        t.usersInput["Joe"] = true;
        t.originalHash = [t.date, t.amount, t.description].join(".");
        t.shouldAdd = true;
        transactions.push(t);
      }
      return transactions;
    };

    var processData = function(data) {
      console.log("process data");
      console.log($scope.transactions);

      var rows = CSVToArray(data, ",");
      var headers = rows[0];
      var data = rows.slice(1).filter(t => t.length == 5);

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
      $scope.transactions = transactions;
      console.log($scope.transactions);
      console.log("done processing");
    };

    $scope.addTransactions = function() {
      console.log("alkjsldjlfkjlkjalkjsdf");
      for (var i = $scope.transactions.length - 1; i >= 0; i--) {
        if (!$scope.transactions[i].shouldAdd) {
          continue;
        }
        var t = Object.assign({}, $scope.transactions[i]);
        dataService.prepareTransaction(t);
        var errors = dataService.validateTransaction(t);
        if (errors.length > 0) {
          console.log(errors);
        } else {
          console.log(t);
          delete t.$$hashKey;
          // dataService.saveNewTransaction(t);
          // $scope.transactions.splice(i, 1);
        }
      }
    }

    $scope.clearTransactions = function() {
      $scope.transactions = [];
    }

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
