angular.module('myApp.auth', [])

.controller('AuthController', ['$scope', '$http', 'Auth', '$cookies', function($scope, $http, Auth, $cookies) {

	// Setup cookies for github user connexion information
  $scope.safranCookie = false;
  var cookie = $cookies.get('safranCookie');

  if (cookie) {
  	// Create user object for cookie information
    var cookieObj = Cookie.parseCookie(cookie);
    var user = {
      'userName' : cookieObj.username
    }
    $scope.user = user;
    $scope.githubCookie = true;
  }

}]);