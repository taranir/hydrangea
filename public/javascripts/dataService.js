angular.module('moneystuff')
  .service("dataService", ['$firebaseObject', '$firebaseArray',
    function($firebaseObject, $firebaseArray) {
    var db = firebase.database();
    var allTransactions;
    // var ref = firebase.database().ref();

    //////////////////
    // Transactions //
    //////////////////

    this.getAllTransactionsFBObj = function() {
      return $firebaseObject(db.ref("transactions")
        .orderByChild("date"));
    };

    this.getAllTransactionsFBArray = function() {
      if (!allTransactions) {
        allTransactions = $firebaseArray(db.ref("transactions")
          .orderByChild("date"));
      }
      return allTransactions;
    };

    this.getTransactionsFBObj = function(sy, sm, sd, ey, em, ed) {
      return $firebaseObject(db.ref("transactions")
        .orderByChild("date")
        .startAt(processDate(sy, sm, sd))
        .endAt(processDate(ey, em, ed)));
    };

    // {
    //   year: 2018,
    //   month: 1,
    //   day: 1,
    //   date: "20180101",
    //   users: ["Joe"],
    //   categories: [""],
    //   amount: 10.0,
    //   description: "",
    //   originalHash: "",
    // }

    this.getNewTransaction = function() {
      var today = new Date();
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        date: processDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
        users: [],
        categories: [],
        amount: 0,
        description: "",
        originalHash: "",
      };
    };

    this.saveNewTransaction = function(transaction) {
      transaction.date = processDate(parseInt(transaction.year), parseInt(transaction.month), parseInt(transaction.day));
      return db.ref("transactions").push(transaction);
    };

    this.deleteTransaction = function(key) {
      db.ref("transactions/" + key).remove();
    };

    this.updateTransaction = function(key, transaction) {
      db.ref("transactions/" + key).set(transaction);
    };

    this.getTransactionFBObjFromRef = function(ref) {
      return $firebaseObject(db.ref("transactions/" + ref.key));
    };

    /////////////
    // Budgets //
    /////////////

    this.getAllBudgetsFBArray = function() {
      return $firebaseArray(db.ref("budgets")
        .orderByChild("date"));
    };

    this.saveNewBudget = function(budget) {
      return db.ref("budgets/" + budget.date).set(budget);
    };


    this.getAllUsers = function() {
      // console.log("asdf");
      // // var users = [];
      // return angular.forEach($firebaseArray(db.ref("Users")), function(u) {
      //   console.log(u);
      //   console.log(typeof u);
      //   return u;
      // });
      // angular.forEach($scope.transactionArray, function(t) {
      // return ;
      return $firebaseArray(db.ref("Users"));
    };

    this.getAllCategories = function() {
      return $firebaseArray(db.ref("Categories"));
    };

    return this;
  }]);
