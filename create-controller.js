/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var createLanguage = angular.module('createLanguageModule',['fileModel']);

createLanguage.controller('CreateLanguageController',['$scope','fileManager', function ($scope,fileManager) {

    $scope.newLanguage = { version: { version: '', title: '', lang: '' }};

    window.sc = $scope.newLanguage;

    $scope.addNewLanguage = function(){
        if($scope.newLanguage.version.lang != ''){
            fileManager.setFile(JSON.stringify($scope.newLanguage),'JSON','New File');
            window.location.href = '#/edit';
        }
    }
}]);
