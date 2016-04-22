angular.module('myApp.tracking', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/tracking', {
  	authenticate: true,
    templateUrl: 'view/tracking/tracking.html',
    controller: 'trackingCtrl'
  });
}])

.controller('trackingCtrl', ['$scope', '$route', '$routeParams', 'Auth', 'DataServices', '$window', '$location', function($scope, $route, $routeParams, Auth, DataServices, $window, $location) {

  // Set default min height regarding screen height
  $('.page').css('min-height', window.innerHeight - 40 + 'px');

  $('.tracking-page .loader-container .loader i').addClass('fa-spin');
  var userData = Auth.getUserName();
  $scope.userName = userData.userName;
  $scope.equipment = $routeParams.equipment;
  $scope.serial = $routeParams.serial;
  $scope.noData = false;

  DataServices.getLastestDataBySerial($routeParams.equipment, $routeParams.serial).then(function(data) {
    $('.tracking-page .loader-container .loader i').removeClass('fa-spin');
    $('.tracking-page .loader-container').hide();
    $scope.data = data;
    $scope.contentLoading = true;
    if (!data) {
      $scope.noData = true;
    }
  }, function(error) {
    $('.tracking-page .loader-container .loader i').removeClass('fa-spin');
    $('.tracking-page .loader-container').hide();
  });

  $scope.seeAllData = function() {
    $scope.contentLoading = false;
    $scope.data = {};
    $('.tracking-page .loader-container').show();
    $('.tracking-page .loader-container .loader i').addClass('fa-spin');
    DataServices.getAllDataBySerial($routeParams.equipment, $routeParams.serial).then(function(data) {
      $('.tracking-page .loader-container .loader i').removeClass('fa-spin');
      $('.tracking-page .loader-container').hide();
      $scope.data = data;
      $scope.contentLoading = true;
      $scope.allDataShowed = true;
      if (!data) {
        $scope.noData = true;
      }
    }, function(error) {
      $('.tracking-page .loader-container .loader i').removeClass('fa-spin');
      $('.tracking-page .loader-container').hide();
    });
  }


  $scope.formSubmit = function(form) {
    formData = {
      userName: userData.userName,
      equipment: $routeParams.equipment,
      serial: $routeParams.serial,
      location: $scope.testLocation,
      activity: $scope.activity,
      details: $scope.details
    }

    if(form.$valid) {
      console.log(formData); 
      DataServices.saveData(formData).then(function() {
        $scope.formDataError = false;
        $('#form-modal').modal('toggle');
        $window.location.reload();
      }, function(error) {
        $scope.formDataError = "Something went wrong. Please try again";
      });
    }
  };

  $scope.changeStyle = function() {
    $('.tracking-page .data-container').toggleClass("tab-style");
  }

}]);