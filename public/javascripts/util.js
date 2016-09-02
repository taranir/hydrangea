function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function pad(s) {
  return (Array(3).join("0") + s.toString()).substring(s.toString().length);
};

function getMonth(date) {
  return date.getFullYear().toString() + pad((date.getMonth() + 1).toString())
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
    tian: {},
    joe: {}
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
  return users;
};

function aggregateTransactionsForMonth(transactions, currentMonth) {
  var filteredTransactions = transactions.filter(function(t) {
    return t.date.indexOf(currentMonth) != -1;
  });
  return aggregateTransactions(filteredTransactions);
};

function updateBudget(budget, aggregates) {
  for (var user in budget) {
    if (user == "date" || user[0] == "$") {
      continue;
    }
    var userBudget = budget[user];
    for (var category in userBudget.categories) {
      if (user in aggregates) {
        if (category in aggregates[user]) {
          userBudget.categories[category][2] = aggregates[user][category];
        }
      }
    }
  }
};