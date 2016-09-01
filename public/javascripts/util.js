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

function aggregateTransactions(transactions) {
  var users = {
    all: {},
    joe: {},
    tian: {}
  };
  var categories = {};
  for (var i = 0; i < transactions.length; i++) {
    var t = transactions[i];
    for (var category in t.categories) {

      function inc(p) {
        users[p][category] = (users[p][category] || 0) + t.amount;
      }

      if (t.users["joe"]) {
        inc("joe");
      }
      if (t.users["tian"]) {
        inc("tian");
      }
      if (t.users["joe"] && t.users["tian"]) {
        inc("all");
      }
    }
  }
  console.log(users);
  return users;
};