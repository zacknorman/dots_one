/*global chrome: false */
/*global calendarApp: false */

calendarApp.factory('Database', function ($q) {
  return {
    set: function (name, value, sync) {
      var deferred = $q.defer();
      var storage = chrome.storage.local;
      if (sync) {
        storage = chrome.storage.sync;
      }
      var obj = {};
      obj[name] = value;
      storage.set(obj, function () {
        deferred.resolve();
      });
      return deferred.promise;
    },
    get: function (name, sync) {
      var deferred = $q.defer();
      var storage = chrome.storage.local;
      if (sync) {
        storage = chrome.storage.sync;
      }
      storage.get(name, function (value) {
        if (value && value[name]) {
          deferred.resolve(value[name]);
        } else {
          deferred.reject('failed to get ' + name);
        }
      });
      return deferred.promise;
    }
  };
});
