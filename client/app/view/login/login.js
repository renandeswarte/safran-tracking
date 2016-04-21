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
    $('.signup-submit').prop("disabled",true);
    AuthServices.checkSecret($scope.secret).then(function(data){
      if (data.error) {
        $('.signup-submit').prop("disabled",false);
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
          $('.signup-submit').prop("disabled",false);
          $scope.signupError = false;
        }, function(error) {
          $('.signup-submit').prop("disabled",false);
          $scope.signupError = error.message;
        });
      }
    });

  }

}]);