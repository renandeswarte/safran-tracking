angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
  	authenticate: false,
    templateUrl: 'view/login/login.html',
    controller: 'loginCtrl'
  });
}])

.controller('loginCtrl', ['$scope', 'AuthServices', function($scope, AuthServices) {

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
          //console.log(data);
          $scope.signupError = false;
        }, function(error) {
          $scope.signupError = error.message;
        });
      }
    });

  }

}]);