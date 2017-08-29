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

function round(f) {
  return parseFloat(f.toFixed(2));
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

var numToMonthDict = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December"
};

function numToMonth(num) {
  return numToMonthDict[num];
}

function monthToNum(month) {
  return _.invert(numToMonthDict)[month];
}

function getMonthNames() {
  return _.values(numToMonthDict);
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
  // var totals = {};
  // for (var i = 0; i < transactions.length; i++) {
  //   var t = transactions[i];
  //   var ym = t.year + t.month;
  //   if (!(ym in totals)) {
  //     totals[ym] = {};
  //   }

  //   var monthTotals = totals[ym];
  //   if (!(t.user in monthTotals)) {
  //     totals[]
  //   }
  //   for (var ci in t.categories) {
  //     var category = t.categories[ci];
  //   }
  // }

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

      if (t.isfor == "shared" && t.categories.indexOf("Rent") == -1) {
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

  for (var u in users) {
    for (var c in users[u]) {
      users[u][c] = round(users[u][c]);
    }
  }
  owes['tian'] = round(owes['tian']);
  owes['joe'] = round(owes['joe']);

  return [users, owes];
};

function aggregateTransactionsForMonth(transactions, currentMonth) {
  var filteredTransactions = transactions.filter(function(t) {
    return t.date.indexOf(currentMonth) != -1;
  });
  return aggregateTransactions(filteredTransactions);
};

// {
//   date: "201605"
//   joe: {
//     games: [321, 12, 0, true], // [proposed, from rollover, actual, rollover]
//     electronics: [1234, 0, 142, false],
//   },
//   tian: {
//     discretionary: [1335, 0, 0],
//   },
//   all: {
//     food: [5432, 143, 513],
//     travel: [2356, 0, 0],
//   }
// }

function updateBudget(budget, aggregates) {
  for (var user in budget) {
    if (user == "date" || user[0] == "$") {
      continue;
    }
    var userBudget = budget[user];
    for (var category in userBudget) {
      if (user in aggregates) {
        if (category in aggregates[user]) {
          userBudget[category][2] = aggregates[user][category];
        } else {
          userBudget[category][2] = 0;
        }
      }
    }
  }
};

function getNewBudget(lastBudget, newDate) {
  var newBudget = JSON.parse(JSON.stringify(lastBudget));
  for (var user in newBudget) {
    var uBudget = newBudget[user];
    for (var category in uBudget) {
      var cBudget = uBudget[category];
      cBudget[2] = 0;
      if (cBudget[3]) {
        var result = lastBudget[user][category];
        var rollover = result[0] + result[1] - result[2];
        cBudget[1] = rollover;
      }
    }
  }
  newBudget["date"] = newDate;
  delete newBudget["$id"];
  delete newBudget["$priority"];
  return newBudget;
};