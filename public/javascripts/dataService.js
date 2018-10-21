angular.module('moneystuff')
  .service("dataService", ['$rootScope', '$firebaseObject', '$firebaseArray',
    function($rootScope, $firebaseObject, $firebaseArray) {
    var db = firebase.database();
    var allTransactions;
    // var ref = firebase.database().ref();

    //////////////////
    // Transactions //
    //////////////////

    this.login = function(u, p) {
      firebase.auth().signInWithEmailAndPassword(u, p).catch(function(error) {
        console.log("error signing in");
        console.log(error);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
      db = firebase.database();
      console.log("signed in");
    }

    this.isLoggedIn = function() {
      return !!firebase.auth().currentUser;
    }

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
        primary: "",
        secondary: "",
        tags: [], // list of strings
        amount: 0,
        description: "",
        originalHash: "",
      };
    };

    this.prepareTransaction = function(t) {
      delete t.$priority;
      delete t.shouldAdd;
      if (t.usersInput) {
        var u = t.usersInput;
        t.users = Object.keys(u).map(function(k) { if (u[k]) { return k; } }).filter(Boolean);
        delete t.usersInput;
      }
      delete t.disabled;

      // if (t.tags) {
      //   t.tags = t.tags.split(",").map(function(s) { return s.trim(); });
      // }
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
      if (t.primary.length < 1) {
        errors.push("Primary category can't be blank");
      }
      // if (t.categories.length < 1) {
      //   errors.push("Categories can't be blank");
      // }
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

    this.getAllPrimaries = function() {
      return $firebaseArray(db.ref("Primaries"));
    };

    this.updatePrimaries = function(primaries) {
      return db.ref("Primaries").set(primaries);
    };

    this.getAllSecondaries = function() {
      return $firebaseArray(db.ref("Secondaries"));
    };

    this.updateSecondaries = function(secondaries) {
      return db.ref("Secondaries").set(secondaries);
    };

    // this.getAllTags = function() {
    //   return $firebaseArray(db.ref("Tags"));
    // };

    // this.updateTags = function(tags) {
    //   return db.ref("Tags").set(tags);
    // };

    /////////////
    // Options //
    /////////////

    var allUsers = [];
    var allPrimaries = [];
    var allSecondaries = [];
    var allMonths = [];
    var allYears = [];

    this.getUserOptions = function() {
      return allUsers;
    }
    this.getPrimaryOptions = function() {
      return allPrimaries;
    }
    this.getSecondaryOptions = function() {
      return allSecondaries;
    }
    this.getMonthOptions = function() {
      return allMonths;
    }
    this.getYearOptions = function() {
      return allYears;
    }

    this.addUserOption = function(u) {
      allUsers.push(u);
      $rootScope.$broadcast('optionsUpdated');
    }
    this.addPrimaryOption = function(c) {
      allPrimaries.push(c);
      $rootScope.$broadcast('optionsUpdated');
    }
    this.addSecondaryOption = function(c) {
      allSecondaries.push(c);
      $rootScope.$broadcast('optionsUpdated');
    }
    this.addMonthOption = function(m) {
      allMonths.push(m);
      $rootScope.$broadcast('optionsUpdated');
    }
    this.addYearOption = function(y) {
      allYears.push(y);
      $rootScope.$broadcast('optionsUpdated');
    }

    this.calculateInitialValues = function(firebaseUsers, firebasePrimaries, firebaseSecondaries, firebaseTransactions) {
      var tYears = new Set();
      var tUsers = new Set();
      var tPrimaries = new Set();
      var tSecondaries = new Set();
      angular.forEach(firebaseTransactions, function(t) {
        tYears.add(t.year);
        for (var i = 0; i < t.users.length; i++) {
          tUsers.add(t.users[i]);
        }
        tPrimaries.add(t.primary);
        tSecondaries.add(t.secondary);
        // for (var i = 0; i < t.tags.length; i++) {
        //   tTags.add(t.tags[i]);
        // }
      });

      var fUsers = new Set();
      angular.forEach(firebaseUsers, function(u) {
        fUsers.add(u.$value);
      });

      var fPrimaries = new Set();
      angular.forEach(firebasePrimaries, function(c) {
        fPrimaries.add(c.$value);
      });

      var fSescondaries = new Set();
      angular.forEach(firebaseSecondaries, function(c) {
        fSescondaries.add(c.$value);
      });

      var combinedUsers = Array.from(union(tUsers, fUsers));
      if (difference(tUsers, fUsers).size > 0) {
        this.updateUsers(combinedUsers);
      }

      var combinedPrimaries = Array.from(union(tPrimaries, fPrimaries));
      if (difference(tPrimaries, fPrimaries).size > 0) {
        this.updatePrimaries(combinedPrimaries);
      }

      var combinedSecondaries = Array.from(union(tSecondaries, fSescondaries));
      if (difference(tSecondaries, fSescondaries).size > 0) {
        this.updateSecondaries(combinedSecondaries);
      }

      allUsers = Array.from(combinedUsers);
      allPrimaries = Array.from(combinedPrimaries);
      allSecondaries = Array.from(combinedSecondaries);
      allMonths = getMonthNames();
      allYears = Array.from(tYears);

      console.log("broadcasting");

      $rootScope.$broadcast('optionsUpdated');
    }

    var fUsers = this.getAllUsers();
    var fPrimaries = this.getAllPrimaries();
    var fSescondaries = this.getAllSecondaries();
    var fTransactions = this.getAllTransactionsFBArray();
    Promise.all([fUsers.$loaded(), fPrimaries.$loaded(), fSescondaries.$loaded(), fTransactions.$loaded()])
      .then(function(values) {
        this.calculateInitialValues(...values);
      }.bind(this));

    return this;
  }]);
