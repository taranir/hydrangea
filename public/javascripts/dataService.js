angular.module('moneystuff')
  .service("dataService", ['$firebaseObject', function($firebaseObject) {
    var ref = firebase.database().ref();

    this.saveNewTransaction = function(amount, description) {
      var newTransaction = {
        date: new Date().getTime(),
        users: {
          joe: true,
          tian: true,
        },
        categories: {
          food: true
        },
        amount: amount,
        description: description
      };
      ref.child("transactions").push(newTransaction);
    };

    this.updateTransaction = function() {

    };

    this.getRef = function() {
      return ref.child("test").ref("-KQOlG3rKHt6D6rKg6Qo");
    };

    this.getAllTestsFBObj = function() {
      return $firebaseObject(ref.child("test"));
    };


    this.getAllTransactionsFBObj = function() {
      return $firebaseObject(ref.child("transactions"));
    }

    this.asdf = function() {
      console.log("lakjsdlfjlajsdf");
      ref.child("transactions").push({
        date: new Date().getTime(),
        users: {
          joe: true,
          tian: true,
        },
        categories: {
          food: true
        },
        amount: Math.random() * 100,
        description: "alkjsdf"
      });
    };

    return this;
  }]);