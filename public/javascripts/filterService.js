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

    // this.getBudget = function() {
    //   if (monthFilter !== "" && yearFilter != "") {
    //     return yearFilter + monthToNum(monthFilter);
    //   }
    //   return "";
    // }

    this.updateFilters = function(nUserFilter, nCategoryFilter, nMonthFilter, nYearFilter) {
      userFilter = nUserFilter;
      categoryFilter = nCategoryFilter;
      monthFilter = nMonthFilter;
      yearFilter = nYearFilter;

      console.log("filter changed - broadcasting");

      if (monthFilter !== "" && yearFilter != "") {
        $rootScope.$broadcast('budgetChanged', { month: yearFilter + monthToNum(monthFilter) });
      } else {
        $rootScope.$broadcast('budgetReset');
      }
    }

    this.getUserFilter = function() { return userFilter; };
    this.getCategoryFilter = function() { return categoryFilter; };
    this.getMonthFilter = function() { return monthFilter; };
    this.getYearFilter = function() { return yearFilter; };

    this.setUserFilter = function(nFilter) { userFilter = nFilter; };
    this.setCategoryFilter = function(nFilter) { categoryFilter = nFilter; };
    this.setMonthFilter = function(nFilter) { monthFilter = nFilter; };
    this.setYearFilter = function(nFilter) { yearFilter = nFilter; };

    return this;
  });