angular.module('myApp.data', ['firebase'])


.factory('DataServices', [ '$timeout', '$window', '$http', '$q', '$rootScope', '$cookies', 'ServerAPI', 'FirebaseUrl', function($timeout, $window, $http, $q, $rootScope, $cookies, ServerAPI, FirebaseUrl) {

  resolve = function(errval, retval, deferred) {
    $rootScope.$apply(function() {
      if (errval) {
        deferred.reject(errval);
      } else {
        deferred.resolve(retval);
      }
    });
  }

  var getLastestData = function() {
    var deferred = $q.defer();
    var ref = new Firebase(FirebaseUrl + '/equipmentData');
    ref.orderByChild("date").limitToLast(6).once("value", function(snapshot) {
      resolve(null, snapshot.val(), deferred);
    }, function(errorObject) {
      resolve(errorObject, null, deferred);
    });
    promise = deferred.promise;
    return promise;
  };

  var getLastestDataBySerial = function(equipment, serial) {
    var deferred = $q.defer();
    var ref = new Firebase(FirebaseUrl + '/equipmentData');
    ref.orderByChild(equipment).equalTo(serial).limitToLast(10).once("value", function(snapshot) {
      resolve(null, snapshot.val(), deferred);
    }, function(errorObject) {
      resolve(errorObject, null, deferred);
    });
    promise = deferred.promise;
    return promise;
  };

  var getAllDataBySerial = function(equipment, serial) {
    var deferred = $q.defer();
    var ref = new Firebase(FirebaseUrl + '/equipmentData');
    ref.orderByChild(equipment).equalTo(serial).once("value", function(snapshot) {
      resolve(null, snapshot.val(), deferred);
    }, function(errorObject) {
      resolve(errorObject, null, deferred);
    });
    promise = deferred.promise;
    return promise;
  };

  var saveData = function(dataToSave) {
    var deferred = $q.defer();

    var dataRef = new Firebase(FirebaseUrl + '/equipmentData/');
    var equipmentRef = new Firebase(FirebaseUrl + '/equipmentList/');

    var d = new Date();
    var postTime = d.getTime();

    var dataCleaned = {
      equipment: dataToSave.equipment,
      serial: dataToSave.serial,
      userName: dataToSave.userName,
      location: dataToSave.location,
      activity: dataToSave.activity,
      details: dataToSave.details,
      date: postTime
    }
    dataCleaned[dataToSave.equipment] = dataToSave.serial;

    dataRef.push(dataCleaned, function(error) {
      if (error) {
        resolve(error, null, deferred);
      } else {
        var serial = {};
        serial[dataToSave.serial] = dataToSave.serial;

        equipmentRef.child(dataToSave.equipment).update(serial, function(error) {
          if (error) {
            resolve(error, null, deferred);
          } else {
            resolve(null, 'ok', deferred);
          }
        })
      }
    });

    promise = deferred.promise;
    return promise;
  };

  var searchFunction = function(key) {
    var deferred = $q.defer();

    var firebase = new Firebase(FirebaseUrl + "/equipmentList/" + key);

    firebase.once("value", function(snapshot) {
      resolve(null, snapshot.val(), deferred);
    }, function(errorObject) {
      resolve(errorObject, null, deferred);
    });

    promise = deferred.promise;
    return promise;
  }

  return {
    saveData: saveData,
    getLastestData: getLastestData,
    getLastestDataBySerial: getLastestDataBySerial,
    getAllDataBySerial: getAllDataBySerial,
    searchFunction: searchFunction
  };

}]);
