// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.env',
  // Services
  'myApp.loginSignup',
  'myApp.auth',
  'myApp.services',
  'myApp.data',
  'myApp.filters',
  // Views
  'myApp.header',
  'myApp.headerDirective',
  'myApp.footer',
  'myApp.footerDirective',
  'myApp.login',
  'myApp.homepage',
  'myApp.tracking',
  'myApp.search'
])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({
		redirectTo: '/'
	});
}])

.run(['$rootScope', '$location', 'Auth', '$window', function($rootScope, $location, Auth, $window) {

  $rootScope.location = $location;

  $rootScope.$on("$routeChangeStart", function(event, next, curr) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      console.log('Please login before visiting ' + next.$$route.originalPath);
      $location.path('/login');
    }
  });

}])


angular.module('myApp.env', [])
.constant('FirebaseUrl', "https://safran-tracker.firebaseio.com")
.constant('DevelopmentAPI', "http://127.0.0.1:3000")
.constant('ProductionAPI', "https://safran-tracker.herokuapp.com")
.constant('ServerAPI', "https://safran-tracker.herokuapp.com");

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

angular.module('myApp.filters', [])

.filter('toArray', function () {
  return function (obj, addKey) {
    if (!angular.isObject(obj)) return obj;
    if ( addKey === false ) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    } else {
      return Object.keys(obj).map(function (key) {
        var value = obj[key];
        return angular.isObject(value) ?
          Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
          { $key: key, $value: value };
      });
    }
  };
});
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

angular.module('myApp.services', [])

.factory('Auth', [ '$http', '$cookies', function($http, $cookies) {

	var isAuth = function() {
		return !!$cookies.get('safranCookie');
	};

	var getUserName = function() {
		var cookie = $cookies.get('safranCookie');
		var cookieObj = JSON.parse(cookie);
    var user = {
      'userName' : cookieObj.fullName
    }
   	return user;
	}

	return {
		isAuth: isAuth,
		getUserName: getUserName
	};

}]);
angular.module('myApp.auth', [])

.controller('AuthController', ['$scope', '$http', 'Auth', '$cookies', function($scope, $http, Auth, $cookies) {

	// Setup cookies for github user connexion information
  $scope.safranCookie = false;
  var cookie = $cookies.get('safranCookie');

  if (cookie) {
  	// Create user object for cookie information
    var cookieObj = JSON.parse(cookie);
    var user = {
      'userName' : cookieObj.fullName
    }
    $scope.user = user;
  }

}]);
angular.module('myApp.footerDirective', [])

.directive('footerDirective', function() {
  return {
    templateUrl: 'view/footer/footer.html'
  };
});
angular.module('myApp.footer', [])

.controller('footerController', ['$scope', function($scope) {
}]);

angular.module('myApp.headerDirective', [])

.directive('headerDirective', function() {
  return {
    templateUrl: 'view/header/header.html'
  };
})

.directive('bsActiveLink', ['$location', function ($location) {
return {
    restrict: 'A', //use as attribute 
    replace: false,
    link: function (scope, elem) {
        //after the route has changed
        scope.$on("$routeChangeSuccess", function () {
            var hrefs = ['/#' + $location.path(),
                         '#' + $location.path(), //html5: false
                         $location.path()]; //html5: true
            angular.forEach(elem.find('a'), function (a) {
                a = angular.element(a);
                if (-1 !== hrefs.indexOf(a.attr('href'))) {
                    a.parent().addClass('active');
                } else {
                    a.parent().removeClass('active');   
                }
            });     
        });
    }
}
}]);
angular.module('myApp.header', [])

.controller('headerController', ['$scope', 'AuthServices', function($scope, AuthServices) {
  
$scope.logout = function() {
  AuthServices.logout();
}

}]);

angular.module('myApp.homepage', [])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    authenticate: true,
    templateUrl: 'view/home/home.html',
    controller: 'homepage'
  });
}])

.controller('homepage', ['$scope', 'DataServices', function($scope, DataServices) {

  // Set default min height regarding screen height
  $('.page').css('min-height', window.innerHeight - 40 + 'px'); 

  $('.home-page .loader-container .loader i').addClass('fa-spin');

  DataServices.getLastestData().then(function(data) {
    $('.home-page .loader-container .loader i').removeClass('fa-spin');
    $('.home-page .loader-container').hide();
    $scope.data = data;
    $scope.contentLoading = true;
  }, function(error) {
    $('.home-page .loader-container .loader i').removeClass('fa-spin');
    $('.home-page .loader-container').hide();
  });

}]);

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
  	authenticate: false,
    templateUrl: 'view/login/login.html',
    controller: 'loginCtrl'
  });
}])

.controller('loginCtrl', ['$scope', 'AuthServices', function($scope, AuthServices) {

  // Set default min height regarding screen height
  $('.page').css('min-height', window.innerHeight - 40 + 'px');

  $scope.login = function() {
    AuthServices.login({
      email: $scope.email,
      password: $scope.password
    }).then(function(data) {
      //console.log('login ok');
    }, function(error) {
      //console.log('login ko : ', error);
      $scope.loginError = error;
    })
  }

  $scope.createUser = function() {
    AuthServices.checkSecret($scope.secret).then(function(data){
      if (data.error) {
        console.log('wrong secret error');
        $scope.secretError = true;
      } else {
        $scope.secretError = false;
        var userInfos = {
          fullName: $scope.fullName,
          email: $scope.email,
          password: $scope.password
        };
        AuthServices.signup(userInfos).then(function(data) {
          $scope.signupError = false;
        }, function(error) {
          $scope.signupError = error.message;
        });
      }
    });

  }

}]);
angular.module('myApp.search', [])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
  	authenticate: true,
    templateUrl: 'view/search/search.html',
    controller: 'searchCtrl'
  });
}])

.controller('searchCtrl', ['$scope', '$route', '$routeParams', 'Auth', 'DataServices', '$window', '$location', function($scope, $route, $routeParams, Auth, DataServices, $window, $location) {

  // Set default min height regarding screen height
  $('.page').css('min-height', window.innerHeight - 40 + 'px');

  $scope.searchEquipement = function(form) {
    if(form.$valid) {
      DataServices.searchFunction($scope.equipment).then(function(data) {
        console.log(data);
        if (!data) {
          $scope.noEquipment = true;
        } else {
          $scope.hasEquipment = true;
          $scope.noEquipment = false;
          var dataArray = ObjToArray(data);
          console.log(dataArray);
          $scope.serials = dataArray;
        }

      }, function(error) {
        console.log(error);
      })
    }
  }

  var ObjToArray = function(obj) {
    var array = $.map(obj, function(value, index) {
        return [value];
    });
    return array;
  }

}]);
angular.module('myApp.tracking', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/tracking', {
  	authenticate: true,
    templateUrl: 'view/tracking/tracking.html',
    controller: 'trackingCtrl'
  });
}])

.controller('trackingCtrl', ['$scope', '$route', '$routeParams', 'Auth', 'DataServices', '$window', '$location', function($scope, $route, $routeParams, Auth, DataServices, $window, $location) {

  // Set default min height regarding screen height
  $('.page').css('min-height', window.innerHeight - 40 + 'px');

  $('.tracking-page .loader-container .loader i').addClass('fa-spin');
  var userData = Auth.getUserName();
  $scope.userName = userData.userName;
  $scope.equipment = $routeParams.equipment;
  $scope.serial = $routeParams.serial;
  $scope.noData = false;

  DataServices.getLastestDataBySerial($routeParams.equipment, $routeParams.serial).then(function(data) {
    $('.tracking-page .loader-container .loader i').removeClass('fa-spin');
    $('.tracking-page .loader-container').hide();
    $scope.data = data;
    $scope.contentLoading = true;
    if (!data) {
      $scope.noData = true;
    }
  }, function(error) {
    $('.tracking-page .loader-container .loader i').removeClass('fa-spin');
    $('.tracking-page .loader-container').hide();
  });

  $scope.seeAllData = function() {
    $scope.contentLoading = false;
    $scope.data = {};
    $('.tracking-page .loader-container').show();
    $('.tracking-page .loader-container .loader i').addClass('fa-spin');
    DataServices.getAllDataBySerial($routeParams.equipment, $routeParams.serial).then(function(data) {
      $('.tracking-page .loader-container .loader i').removeClass('fa-spin');
      $('.tracking-page .loader-container').hide();
      $scope.data = data;
      $scope.contentLoading = true;
      $scope.allDataShowed = true;
      if (!data) {
        $scope.noData = true;
      }
    }, function(error) {
      $('.tracking-page .loader-container .loader i').removeClass('fa-spin');
      $('.tracking-page .loader-container').hide();
    });
  }


  $scope.formSubmit = function(form) {
    formData = {
      userName: userData.userName,
      equipment: $routeParams.equipment,
      serial: $routeParams.serial,
      location: $scope.testLocation,
      activity: $scope.activity,
      details: $scope.details
    }

    if(form.$valid) {
      console.log(formData); 
      DataServices.saveData(formData).then(function() {
        $scope.formDataError = false;
        $('#form-modal').modal('toggle');
        $window.location.reload();
      }, function(error) {
        $scope.formDataError = "Something went wrong. Please try again";
      });
    }

  }

}]);