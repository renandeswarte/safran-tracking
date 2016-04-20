angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
  	authenticate: false,
    templateUrl: 'view/login/login.html',
    controller: 'loginCtrl'
  });
}])

.controller('loginCtrl', ['$scope', 'LoginSignup', function($scope, LoginSignup) {

  $scope.login = function() {
    console.log('login');
    LoginSignup.login({
      email: $scope.email,
      password: $scope.password
    }).then(function(data) {
      console.log('login ok');
    }, function(error) {
      console.log('login ko : ', error);
      $scope.loginError = error;
    })
  }

  $scope.createUser = function() {
    console.log("create user");
    LoginSignup.checkSecret($scope.secret).then(function(data){
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
        LoginSignup.signup(userInfos).then(function(data) {
          console.log(data);
          $scope.signupError = false;
        }, function(error) {
          $scope.signupError = error.message;
        });
      }
    });

  }

}]);