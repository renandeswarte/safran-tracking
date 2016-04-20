angular.module('myApp.header', [])

.controller('headerController', ['$scope', 'LoginSignup', function($scope, LoginSignup) {
  
$scope.logout = function() {
  LoginSignup.logout();
}

}]);
