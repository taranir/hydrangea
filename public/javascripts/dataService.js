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
    //   users: {
    //     joe: true,
    //     tian: true
    //   },
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
    }

    this.getNewTransaction = function() {
      var today = new Date();
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        date: processDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
        users: {
          joe: true,
          tian: true
        },
        categories: {
          food: true
        },
        amount: 0,
        description: ""
      };
    };

    this.saveNewTransaction = function(transaction) {
      transaction.date = processDate(parseInt(transaction.year), parseInt(transaction.month), parseInt(transaction.day));
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
    //   date: "201605", // null for proposed
    //   joe: {
    //     categories: {
    //       games: [321, 12, 0], // [proposed, from rollover, actual]
    //       electronics: [1234, 0, 142],
    //     }
    //     rollover: {
    //       games: true
    //     }
    //   },
    //   tian: {
    //     categories: {
    //       discretionary: [1335, 0, 0],
    //     }
    //     rollover: {}
    //   },
    //   all: {
    //     categories: {
    //       food: [5432, 143, 513],
    //       travel: [2356, 0, 0],
    //     }
    //     rollover: {
    //       food: true
    //     }
    //   }
    // }

    this.getAllBudgetsFBArray = function() {
      return $firebaseArray(db.ref("budgets")
        .orderByChild("date"));
    };

    this.getProposedBudgetFBObj = function() {
      return $firebaseObject(db.ref("/proposed"));
    };

    this.saveProposedBudget = function(proposed) {
      return db.ref("/proposed").set(proposed);
    }

    this.getEmptyBudget = function() {
      return {
        joe: {
          categories: {
            games: [321, 12, 0], // [proposed, from rollover, actual]
            electronics: [1234, 0, 142],
          },
          rollover: {
            games: true
          }
        },
        tian: {
          categories: {
            discretionary: [1335, 0, 0],
          },
          rollover: {}
        },
        all: {
          categories: {
            food: [5432, 143, 513],
            travel: [2356, 0, 0],
          },
          rollover: {
            food: true
          }
        }
      };
    };

    this.getNewBudget = function(lastBudget, proposedBudget, newDate) {
      var newBudget = JSON.parse(JSON.stringify(proposedBudget));
      for (var user in newBudget) {
        var userBudget = newBudget[user];

        for (var category in userBudget["categories"]) {
          if (userBudget["rollover"][category]) {
            var result = lastBudget[user]["categories"][category];
            if (result) {
              // proposed + from rollover - actual
              var rollover = result[0] + result[1] - result[2];
              userBudget["categories"][category][1] = rollover;
            }
          }
        }
      }
      newBudget[date] = newDate;
      return newBudget;
    };

    this.saveBudget = function(budget) {
      console.log("saving budget:");
      console.log(budget);
      return db.ref("budgets/" + budget.date).set(budget);
    };

    return this;
  }]);
