angular.module('myApp.services', [])

.factory('Auth', [ '$http', '$cookies', function($http, $cookies) {

	//var user = null;

	var getUser = function() {
		return $http({
				method: 'GET',
				url: '/api/user'
			}).then(function(res) {
				return res.data;
			});
	};

	var logout = function() {
		return $http({
			method: 'GET',
			url: '/auth/logout'
		}).then(function(res) {
			return res.data;
		});
	};

	var isAuth = function() {
		return !!$cookies.get('safranCookie');
	};

	return {
		getUser: getUser,
		logout: logout,
		isAuth: isAuth
	};

}]);