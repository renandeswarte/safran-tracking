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

  var saveData = function(dataToSave) {
    var deferred = $q.defer();

    var ref = new Firebase(FirebaseUrl + '/equipment/' + dataToSave.equipment + '/serial/' + dataToSave.serial);
    console.log(FirebaseUrl + '/equipment/' + dataToSave.equipment + '/' + dataToSave.version);

    var d = new Date();
    var postTime = d.getTime();

    var dataCleaned = {
      userName: dataToSave.userName,
      location: dataToSave.location,
      activity: dataToSave.activity,
      details: dataToSave.details,
      date: postTime
    }

    console.log(dataCleaned);

    ref.push(dataCleaned, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
        resolve(error, null, deferred);
      } else {
        alert("Data saved successfully.");
        resolve(null, 'ok', deferred);
      }
    });

    promise = deferred.promise;
    return promise;
  };

    // FirebaseAuth.$authWithPassword({
    //   email: userDataLogin.email,
    //   password: userDataLogin.password
    // }).then(function(authData) {
    //   console.log("Logged in as:", authData);
    //   $timeout(function() {resolve(null, 'ok', deferred);}, 0);

    //   var ref = new Firebase(FirebaseUrl + '/users/' + authData.uid);

    //   // Get User Data
    //   ref.once('value', function (dataSnapshot) {  
    //   var userDataToSave = dataSnapshot.val();

    //   // Set cookie
    //   var now = new Date();
    //   var expirationDate = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
    //   var dataToStore = {
    //     fullName: userDataToSave.fullName,
    //     email: userDataToSave.email
    //   };
    //   $cookies.put('safranCookie', JSON.stringify(dataToStore), {expires: expirationDate});

    //   // Redirect to main page after login
    //   $window.location.href = "/";

    //   }, function (err) {
    //     // code to handle read error
    //     $timeout(function() {resolve(error, null, deferred);}, 0);

    //   });

    // }).catch(function(error) {
    //   console.error("Authentication failed:", error);
    //   $timeout(function() {resolve(error, null, deferred);}, 0);
    // });

    // promise = deferred.promise;
    // return promise;
  // };

  return {
    saveData: saveData
  };

}]);
