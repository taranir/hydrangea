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
      return $firebaseObject(db.ref("Transactions")
        .orderByChild("date"));
    };

    this.getAllTransactionsFBArray = function() {
      if (!allTransactions) {
        allTransactions = $firebaseArray(db.ref("Transactions")
          .orderByChild("date"));
      }
      return allTransactions;
    };

    this.getTransactionsFBObj = function(sy, sm, sd, ey, em, ed) {
      return $firebaseObject(db.ref("Transactions")
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
      return db.ref("Transactions").push(transaction);
    };

    this.deleteTransaction = function(key) {
      db.ref("Transactions/" + key).remove();
    };

    this.updateTransaction = function(key, transaction) {
      db.ref("Transactions/" + key).set(transaction);
    };

    this.getTransactionFBObjFromRef = function(ref) {
      return $firebaseObject(db.ref("Transactions/" + ref.key));
    };

    /////////////
    // Budgets //
    /////////////

    this.getAllBudgetsFBArray = function() {
      return $firebaseArray(db.ref("Budgets")
        .orderByChild("date"));
    };

    this.saveNewBudget = function(budget) {
      return db.ref("Budgets/" + budget.date).set(budget);
    };


    this.getAllUsers = function() {
      return $firebaseArray(db.ref("Users"));
    };

    this.updateUsers = function(users) {
      return db.ref("Users").set(users);
    };

    this.getAllCategories = function() {
      return $firebaseArray(db.ref("Categories"));
    };

    this.updateCategories = function(categories) {
      return db.ref("Categories").set(categories);
    };

    return this;
  }]);
