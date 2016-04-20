// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.header',
  'myApp.headerDirective',
  'myApp.footer',
  'myApp.footerDirective',
  'myApp.welcome',
  'myApp.homepage',
  'myApp.auth',
  'myApp.services'
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
      $location.path('/welcome');
    }
  });

}])

