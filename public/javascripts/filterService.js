angular.module('moneystuff')
  .service("filterService", function($rootScope) {
    var userFilter = "";
    var primaryFilter = "";
    var secondaryFilter = "";
    var monthFilter = "";
    var yearFilter = "";

    this.shouldShowTransaction = function(transaction) {
      if (userFilter !== "") {
        if (transaction.users.indexOf(userFilter) == -1) {
          return false;
        }
      }
      if (primaryFilter !== "") {
        if (transaction.primary != primaryFilter) {
          return false;
        }
      }
      if (secondaryFilter !== "") {
        if (transaction.secondary != secondaryFilter) {
          return false;
        }
      }
      // if (tagFilter !== "") {
      //   if (transaction.tags.indexOf(tagFilter) == -1) {
      //     return false;
      //   }
      // }
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

    this.updateFilters = function(nUserFilter, nPrimaryFilter, nSecondaryFilter, nMonthFilter, nYearFilter) {
      userFilter = nUserFilter;
      primaryFilter = nPrimaryFilter;
      secondaryFilter = nSecondaryFilter;
      monthFilter = nMonthFilter;
      yearFilter = nYearFilter;
      console.log("filter changed - broadcasting");
      $rootScope.$broadcast('filterChanged');
    }

    return this;
  });