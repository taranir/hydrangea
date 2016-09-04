

/*
  userFilter: 'tian' or 'joe'
  dateFilter: [startDate, endDate]
  categoryFilter: [categories]
*/

angular.module('moneystuff')
  .filter('transactionDate', function() {
    return function(input, startDate, endDate) {
      return _.filter(input, function(t) {
        return startDate < t.date && t.date < endDate;
      });
    };
  })
  .filter('transactionUser', function() {
    return function(input, user) {
      return _.filter(input, function(t) {
        return t.user === user
      });
    };
  })
  .filter('transactionCategory', function() {
    return function(input, categories) {
      categories = JSON.parse(categories);
      return _.filter(input, function(t) {
        var categoryCheck = _.union(categories, t.categories);
          return categoryCheck.length > 0;
      })
    }
  });