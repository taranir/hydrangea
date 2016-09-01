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
  var categories = {};
  for (var i = 0; i < transactions.length; i++) {
    var t = transactions[i];
    for (var category in t.categories) {
      if (!(category in categories)) {
        categories[category] = 0;
      }
      categories[category] += t.amount;
    }
  }
  console.log(categories);
  return categories;
};