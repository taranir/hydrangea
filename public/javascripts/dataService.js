angular.module('moneystuff')
  .service("dataService", ['$firebaseObject', '$firebaseArray',
    function($firebaseObject, $firebaseArray) {
    var db = firebase.database();
    var allTransactions;
    // var ref = firebase.database().ref();

    //////////////////
    // Transactions //
    //////////////////

    // {
    //   year: today.getFullYear(),
    //   month: today.getMonth() + 1,
    //   day: today.getDate(),
    //   date: processDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
    //   shared: true,
    //   user: "joe",
    //   categories: {
    //     food: true,
    //     asdf: true
    //   },
    //   amount: 0,
    //   description: ""
    // }

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

    this.getNewTransaction = function() {
      var today = new Date();
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        date: processDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
        isfor: "self",
        user: "tian",
        categories: "",
        amount: 0,
        description: ""
      };
    };

    this.saveNewTransaction = function(transaction) {
      transaction.date = processDate(parseInt(transaction.year), parseInt(transaction.month), parseInt(transaction.day));
      return db.ref("transactions").push(transaction);
    };

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    };

    var categories = ["food", "games", "rent", "travel", "electronics", "clothes", "discretionary", "books", "snacks", "subscriptions"];
    this.addRandomTransaction = function() {
      var m = getRandomInt(1, 12);
      var d = getRandomInt(1, 31);
      var n = getRandomInt(1, 5);
      var c = shuffle(categories).slice(0, n);
      var t = {
        year: 2016,
        month: getRandomInt(1, 12),
        day: getRandomInt(1, 31),
        date: processDate(2016, m, d),
        isfor: ["shared", "self", "other"][getRandomInt(1, 3)],
        user: getRandomInt(1, 2) == 1 ? "tian" : "joe",
        categories: c,
        amount: Math.round(getRandomAmount(1, 9999) * 100) / 100,
        description: "test " + getRandomInt(1, 999)
      };

      this.saveNewTransaction(t);
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

    return this;
  }]);
