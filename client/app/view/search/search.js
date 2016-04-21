angular.module('myApp.search', [])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
  	authenticate: true,
    templateUrl: 'view/search/search.html',
    controller: 'searchCtrl'
  });
}])

.controller('searchCtrl', ['$scope', '$route', '$routeParams', 'Auth', 'DataServices', '$window', '$location', function($scope, $route, $routeParams, Auth, DataServices, $window, $location) {

  // Set default min height regarding screen height
  $('.page').css('min-height', window.innerHeight - 40 + 'px');

  $scope.searchEquipement = function(form) {
    if(form.$valid) {
      DataServices.searchFunction($scope.equipment).then(function(data) {
        console.log(data);
        if (!data) {
          $scope.noEquipment = true;
        } else {
          $scope.hasEquipment = true;
          var dataArray = ObjToArray(data);
          console.log(dataArray);
          $scope.serials = dataArray;
        }

      }, function(error) {
        console.log(error);
      })
    }
  }

  var ObjToArray = function(obj) {
    var array = $.map(obj, function(value, index) {
        return [value];
    });
    return array;
  }

}]);