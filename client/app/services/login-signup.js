angular.module('myApp.loginSignup', ['firebase'])

.factory("FirebaseAuth", ["$firebaseAuth", 'FirebaseUrl', function($firebaseAuth, FirebaseUrl) {
  var ref = new Firebase(FirebaseUrl);
  return $firebaseAuth(ref);
}
])

.factory('AuthServices', [ '$timeout', '$location', '$window', '$http', '$q', '$rootScope', '$cookies', 'ServerAPI', 'FirebaseAuth', '$firebaseObject', 'FirebaseUrl', function($timeout, $location, $window, $http, $q, $rootScope, $cookies, ServerAPI, FirebaseAuth, $firebaseObject, FirebaseUrl) {

  resolve = function(errval, retval, deferred) {
    $rootScope.$apply(function() {
      if (errval) {
        deferred.reject(errval);
      } else {
        deferred.resolve(retval);
      }
    });
  }

  var logout = function() {
    FirebaseAuth.$unauth();
    $cookies.remove('safranCookie');
    $window.location.href = "/";
  }

  var login = function(userDataLogin) {
    var deferred = $q.defer();

    FirebaseAuth.$authWithPassword({
      email: userDataLogin.email,
      password: userDataLogin.password
    }).then(function(authData) {
      console.log("Logged in as:", authData);
      $timeout(function() {resolve(null, 'ok', deferred);}, 0);

      var ref = new Firebase(FirebaseUrl + '/users/' + authData.uid);

      // Get User Data
      ref.once('value', function (dataSnapshot) {  
      var userDataToSave = dataSnapshot.val();

      // Set cookie
      var now = new Date();
      var expirationDate = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
      var dataToStore = {
        fullName: userDataToSave.fullName,
        email: userDataToSave.email
      };
      $cookies.put('safranCookie', JSON.stringify(dataToStore), {expires: expirationDate});

      // Redirect to main page after login
      $window.location.href = "/";

      }, function (err) {
        // code to handle read error
        $timeout(function() {resolve(error, null, deferred);}, 0);

      });

    }).catch(function(error) {
      console.error("Authentication failed:", error);
      $timeout(function() {resolve(error, null, deferred);}, 0);
    });

    promise = deferred.promise;
    return promise;
  };

  var checkSecret = function(key) {
    return $http({
      method: 'GET',
      url: ServerAPI + '/api/signup/' + key
    }).then(function(res) {
      return res.data;
    }, function errorCallback(error) {
      error.data = {
        error: true
      };
      return error.data;
    });
  };

  var signup = function(userDataToSave) {
    var deferred = $q.defer();

    FirebaseAuth.$createUser({
      email: userDataToSave.email,
      password: userDataToSave.password
    }).then(function(userData) {
      var ref = new Firebase(FirebaseUrl + '/users/' + userData.uid);
      var userToSave = $firebaseObject(ref);

      userToSave.fullName = userDataToSave.fullName;
      userToSave.email = userDataToSave.email;

      userToSave.$save().then(function() {
        $timeout(function() {
          FirebaseAuth.$authWithPassword({
            email: userDataToSave.email,
            password: userDataToSave.password
          }).then(function(authData) {
            $timeout(function() {resolve(null, 'ok', deferred);}, 0)
            // Set cookie
            var now = new Date();
            var expirationDate = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
            var dataToStore = {
              fullName: userDataToSave.fullName,
              email: userDataToSave.email
            };
            $cookies.put('safranCookie', JSON.stringify(dataToStore), {expires: expirationDate});
            
            // Redirect to main page after login
            $window.location.href = "/";
          }).catch(function(error) {
            //console.error("Authentication failed:", error);
            $timeout(function() {resolve(error, null, deferred);}, 0)
          });
        }, 0)
        
      }).catch(function(error) {
        //console.log('Error!');
        $timeout(function() {
          resolve(error, null, deferred);
        }, 0)
      });

    }).catch(function(error) {
      //console.log(error);
      $timeout(function() {
        resolve(error, null, deferred);
      }, 0)
    });

    promise = deferred.promise;
    return promise;
  };

  return {
    login: login,
    logout: logout,
    signup: signup,
    checkSecret: checkSecret
  };

}]);
