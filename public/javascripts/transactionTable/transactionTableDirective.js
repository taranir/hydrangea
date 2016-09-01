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

    $scope.signIn = function() {
      var provider = new firebase.auth.FacebookAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);

        console.log("logged in");
        var cuser = firebase.auth().currentUser;
        console.log(cuser);
        // ...
      }).catch(function(error) {
        console.log("error");
        console.log(error);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    }

    $scope.proposed = dataService.getEmptyBudget();
    dataService.saveProposedBudget($scope.proposed);
    $scope.proposed.date = "201609";
    dataService.saveBudget($scope.proposed);

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