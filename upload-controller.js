/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Upload.js contains the fileReaderModule.
 * It handles the input of files from a local computer system.
 * The fileReader Service is the core of this module. It provides
 * access to the File API of modern browser.
 */

'use strict';

var fileReaderModule = angular.module("fileReaderModule",['fileModel']);


//Controller for which is used by upload.html
fileReaderModule.controller('UploadController',['$scope', '$location', 'fileManager',  function ($scope,$location,fileManager) {

    //Start the fileReader Service with promises. Gets started in the myFileSelect directive by onchange event.
    $scope.getFile = function () {
        $scope.progress = 0;
        fileManager.readAsText($scope.file, $scope)
                  .then(function(result) {
                        $scope.fileInstance = fileManager.setFile(result,'JSON',$scope.fileName);
                        $location.path('/edit');
                  });
    }

    //Broadcast on fileProgress
    $scope.$on("fileProgress", function(e, progress) {
        $scope.progress = progress.loaded / progress.total;
    });

}]);

//Directive to check if a file got selected in the input field
fileReaderModule.directive("myFileSelect",function(){

  return {
    link: function($scope,el){

      //Binding of the getFile() function from to controller to the onchange event of the input field.
      el.bind("change", function(e){

        $scope.file = (e.srcElement || e.target).files[0];
        $scope.fileName = $scope.file.name;
        $scope.getFile();
      })

    }

  }

});

//Directive creates a dropzone for files
fileReaderModule.directive("myDropZone",function(){

    return {
        link: function($scope,el){

            function dragenter(e) {
                e.stopPropagation();
                e.preventDefault();


                el.toggleClass('my-on-drag-enter');
            }
            function dragover(e) {
                e.stopPropagation();
                e.preventDefault();
            }
           function drop(e) {
               //debugger;
               e.stopPropagation();
               e.preventDefault();

               var dt = e.originalEvent.dataTransfer;

               $scope.file = dt.files[0];
               $scope.getFile();

               el.toggleClass('my-on-drag-enter');

            }

            function dragleave(e){
               e.stopPropagation();
               e.preventDefault();

                el.toggleClass('my-on-drag-enter');
            }

            el.bind('dragenter', dragenter);
            el.bind('dragover', dragover);
            el.bind('drop', drop);
            el.bind('dragleave', dragleave);
        }
    }
});
