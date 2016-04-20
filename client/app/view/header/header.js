angular.module('myApp.header', [])

.controller('headerController', ['$scope', 'AuthServices', function($scope, AuthServices) {
  
$scope.logout = function() {
  AuthServices.logout();
}

}]);
