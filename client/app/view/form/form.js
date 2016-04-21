angular.module('myApp.form', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/form', {
  	authenticate: true,
    templateUrl: 'view/form/form.html',
    controller: 'formCtrl'
  });
}])

.controller('formCtrl', ['$scope', '$route', '$routeParams', 'Auth', 'DataServices', function($scope, $route, $routeParams, Auth, DataServices) {
  // http://localhost:3000/#/form?equipment=test&serial=12345

  var userData = Auth.getUserName();
  $scope.userName = userData.userName;
  $scope.equipment = $routeParams.equipment;
  $scope.serial = $routeParams.serial;

  // Nom utilisateur
  // Date
  // Nom equipement et num de serie
  // localisation de l'essaie
  // nature de l’activité (genre liste déroulante : Essai / transport / installation / inspection)
  // demande les faits marquants: cela serait un texte libre que l’opérateur pourrait remplir à sa guise (genre: RAS, présence d’une rayure…)

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
      DataServices.saveData(formData);
    }

  }

}]);