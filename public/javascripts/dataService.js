angular.module('moneystuff')
  .service("dataService", ['$firebaseObject', '$firebaseArray',
    function($firebaseObject, $firebaseArray) {
    var db = firebase.database();
    // var ref = firebase.database().ref();

    //////////////////
    // Transactions //
    //////////////////

    this.getAllTransactionsFBObj = function() {
      return $firebaseObject(db.ref("transactions")
        .orderByChild("date"));
    };

    this.getAllTransactionsFBArray = function() {
      return $firebaseArray(db.ref("transactions")
        .orderByChild("date"));
    };

    this.getTransactionsFBObj = function(sy, sm, sd, ey, em, ed) {
      return $firebaseObject(db.ref("transactions")
        .orderByChild("date")
        .startAt(processDate(sy, sm, sd))
        .endAt(processDate(ey, em, ed)));
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function pad(s) {
      return (Array(3).join("0") + s.toString()).substring(s.toString().length);
    };

    function processDate(year, month, day) {
      if (!year) {
        year = new Date().getFullYear().toString();
      }
      if (!month) {
        month = (new Date().getMonth() + 1).toString();
      }
      if (!day) {
        day = new Date().getDate().toString();
      }
      return "" + year + pad(month.toString()) + pad(day.toString());
    };

    this.getNewTransaction = function() {
      var today = new Date();
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        date: processDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
        users: {},
        categories: {},
        amount: 0,
        description: ""
      };
    };

    this.saveNewTransaction = function(transaction) {
      return db.ref("transactions").push(transaction);
    }

    this.addRandomTransaction = function() {
      this.saveNewTransaction("2016", getRandomInt(1, 12).toString(), getRandomInt(1, 31).toString(), getRandomInt(1, 9999), "test");
    }

    this.deleteTransaction = function(key) {
      db.ref("transactions/" + key).remove();
    }

    this.updateTransaction = function(key, transaction) {
      db.ref("transactions/" + key).set(transaction);
    };

    this.getTransactionFBObjFromRef = function(ref) {
      return $firebaseObject(db.ref("transactions/" + ref.key));
    };

    /////////////
    // Budgets //
    /////////////

    // {
    //   date: "201605"
    //   user: {
    //     joe: true
    //   }
    //   category: {
    //     food: 1425,
    //     travel: 1234,
    //     games: 321
    //   }
    // }

    this.getBudgetForMonth = function() {

    }

    this.saveBudget = function() {

    }

    return this;
  }]);
