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

    this.getNewTransaction = function() {
      var today = new Date();
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        date: processDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
        users: [], // list of strings
        categories: [], // list of strings
        amount: 0,
        description: "",
        originalHash: "",
      };
    };

    this.prepareTransaction = function(t) {
      if (t.usersInput) {
        var u = t.usersInput;
        t.users = Object.keys(u).map(function(k) { if (u[k]) { return k; } }).filter(Boolean);
        delete t.usersInput;
      }

      t.categories = t.categories.split(",").map(function(s) { return s.trim(); });
      t.date = processDate(parseInt(t.year), parseInt(t.month), parseInt(t.day));
      if (!t.originalHash) {
        t.originalHash = [t.date, t.amount, t.description].join(".");
      }
    };

    this.validateTransaction = function(t) {
      var errors = [];
      if (t.users.length < 1) {
        errors.push("Users can't be blank");
      }
      if (t.categories.length < 1) {
        errors.push("Categories can't be blank");
      }
      if (t.description.length < 1) {
        errors.push("Description can't be blank");
      }
      if (t.amount == 0) {
        errors.push("Amount can't be 0");
      }
      return errors;
    };

    /////////////
    // Budgets //
    /////////////

    this.getAllBudgetsFBArray = function() {
      return $firebaseArray(db.ref("Budgets")
        .orderByChild("date"));
    };

    this.saveNewBudget = function(budget) {
      console.log("asdf");
      return db.ref("Budgets").push(budget);
    };

    this.getNewBudget = function() {
      var today = new Date();
      var todayS = processDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
      return {
        name: "",
        active: true,
        filter: {
          users: [],
          categories: []
        },
        period: 0,
        rollover: false,
        amount: 0,
        lastReset: todayS,
        lastUpdated: todayS,
        currentLimit: 0,
        currentTotal: 0
      }
    };

    ///////////
    // Other //
    ///////////

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
