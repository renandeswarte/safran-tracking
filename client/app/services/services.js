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