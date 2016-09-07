function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getRandomAmount(min, max) {
  return Math.floor(Math.random() * (max - min + 1) * 100) / 100.0 + min;
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

// Convert YYYYMMDD to MM/DD/YYYY
function renderDate(dateString) {
  if (dateString) {
    dateString = dateString.toString();
    return dateString.substring(4, 6) + "/"
      + dateString.substring(6) + "/"
      + dateString.substring(0, 4);
  }
}

function otherUser(n) {
  if (n == "tian") {
    return "joe";
  }
  if (n == "joe") {
    return "tian";
  }
}

function aggregateTransactions(transactions) {
  var users = {
    all: {},
    tian: {},
    joe: {}
  };
  var owes = {
    tian: 0,
    joe: 0
  };
  var categories = {};
  for (var i = 0; i < transactions.length; i++) {
    var t = transactions[i];
    for (var ci in t.categories) {
      var category = t.categories[ci];
      function inc(p) {
        users[p][category] = (users[p][category] || 0) + t.amount;
      }

      if (t.isfor == "shared") {
        inc("all");

        if (JSON.stringify(t.categories) == JSON.stringify(['payment'])) {
          owes[t.user] -= t.amount;
          // paid[t.user] += t.amount;
          // paid[otherUser(t.user)] -= t.amount;
        } else {
          owes[otherUser(t.user)] += t.amount / 2.0;
          // paid[t.user] += t.amount;
        }
      } else if (t.isfor == "self") {
        inc(t.user);
      } else if (t.isfor == "other") {
        inc(otherUser(t.user));
        owes[otherUser(t.user)] += t.amount;
      }
    }
  }
  return [users, owes];
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
        } else {
          userBudget.categories[category][2] = 0;
        }
      }
    }
  }
};