angular.module('moneystuff')
  .service("filterService", function($rootScope) {
    var userFilter = "";
    var categoryFilter = "";
    var monthFilter = "";
    var yearFilter = "";

    this.shouldShowTransaction = function(transaction) {
      if (userFilter !== "") {
        if (transaction.users.indexOf(userFilter) == -1) {
          return false;
        }
      }
      if (categoryFilter !== "") {
        if (transaction.categories.indexOf(categoryFilter) == -1) {
          return false;
        }
      }
      var date = renderDate(transaction["date"]).split("/");
      if (monthFilter !== "") {
        if (numToMonth(date[0]) !== monthFilter) {
          return false;
        }
      }
      if (yearFilter !== "") {
        if ((date[2]) != yearFilter) {
          return false;
        }
      }
      return true;
    };

    this.updateFilters = function(nUserFilter, nCategoryFilter, nMonthFilter, nYearFilter) {
      userFilter = nUserFilter;
      categoryFilter = nCategoryFilter;
      monthFilter = nMonthFilter;
      yearFilter = nYearFilter;
      console.log("filter changed - broadcasting");
      $rootScope.$broadcast('filterChanged');
    }

    return this;
  });