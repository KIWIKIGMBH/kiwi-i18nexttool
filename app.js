/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var app = angular.module('app',['ngRoute',  'languageJSON', 'fileReaderModule', 'fileModel', 'createLanguageModule']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl:'templates/home.html',
    })
    .when('/create',{
      templateUrl: 'templates/create.html',
      controller: 'CreateLanguageController',
    })
    .when('/upload',{
      templateUrl: 'templates/upload.html',
      controller: 'UploadController'
    })
    .when('/edit', {
      templateUrl: 'templates/edit.html',
      controller: 'languageJSONController'
    })
    .otherwise({
      redirectTo:'/home'
    });
});

app.controller('navToggle',['$scope','$location',function($scope,$location){
    $scope.$on('$routeChangeSuccess', function () {
        $scope.activeMenuLink = $location.path().slice(1);
    });
}]);
