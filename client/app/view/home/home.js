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
