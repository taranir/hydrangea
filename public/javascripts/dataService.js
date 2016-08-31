angular.module('moneystuff', [])
  .service("dataService", function() {
    var ref = firebase.database();

    this.asdf = function() {
      console.log("lakjsdlfjlajsdf");
      ref.ref().child("test").push({
        test: new Date().toISOString()
      });
    }
  });