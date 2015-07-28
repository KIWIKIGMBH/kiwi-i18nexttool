/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var languageJSON = angular.module('languageJSON',['fileModel']);

languageJSON.controller('languageJSONController',['$scope','fileManager', function ($scope,fileManager) {

    /**
    * Set controller variables
    */
    $scope.languageFile = fileManager.getAllFiles(); //This variable references the language data. { keys: Object, en: Object, fr: Object, ... }
    $scope.value = $scope.languageFile['keys']; //Reference to the keys
    $scope.arrOfLanguages = fileManager.getArrayOfLanguages(); //This array holds all languages, with colorcoding.

    /**
    * Helper variables that can be accessed with console.
    */
    window.lF = $scope.languageFile;
    window.arr = $scope.arrOfLanguages;

    //new Blob([JSON.stringify(lF.ch)], {type: "application/json;charset=utf-8"})

    /**
    * The init functions returns the references for the input fields
    */
    $scope.init = function(parentKey,groupValue){
        var langFile = $scope.languageFile; //All languages are stored here.
        var objLang = $scope.arrOfLanguages; //Object holding all the languages with color coding.
        var ref = {};

        //Loop over every language
        for(var property in objLang){

            //Set file reference
            ref[property] = langFile[property];

            try{
                if(parentKey !== undefined){

                    if(groupValue !== undefined){

                        //Inherit reference from parent and set it
                        ref[property] = groupValue[property][parentKey];

                    }
                }
            } catch(e){
                console.log("Error: "+e.name+"Message: "+e.message);
            }
        }
        return ref;
    }

    /**
    * Creates a blob object and saves it with the help of SaveAs.js
    */
    $scope.download = function(language){
        var blob = new Blob([JSON.stringify($scope.languageFile[language])],{type: "application/json;charset=utf-8"});
        saveAs(blob,"translation.json");
    }

    /**
    * Delete property of json object
    */
    $scope.deleteProperty = function(ref,key, event){
        var r = confirm("Do you really want to delete the item?");
        if (r == true) {
            var el = angular.element(event.currentTarget.previousElementSibling);
            el.attr('placeholder','Item deleted...');
            delete ref[key];
        }
    }

    /**
    * Add new category
    */
    $scope.addCategory = function(){

        var key = prompt("Please enter a new category. Don't use whitespaces in the name", "");

        if (key != null) {
            var whitespaces = key.match(/\s/g);
            if(!whitespaces){
                $scope.value[key] = {};
                fileManager.updatePropertiesOfLanguages();
            }
        }
    }

    /**
    * This function analyzes the value of the text input field and gives a boolean value back
    * Different cases:
    *                   - Value exists -> true
    *                   - Empty value -> true
    *                   - Deleted value -> false
    *
    * Is used in the view, because Angular sees an empty value as false
    */
    $scope.textFieldStatus = function(inputString){
        //Case: Deleted value
        if(inputString === undefined){
            return false;
        }
        //Case: Value exists or is empty
        if(inputString === '' || inputString.length > 0){
            return true;
        }
    }

    /**
    * Add a property (translation) to the file
    */
    $scope.addProperty = function(groupValue){

        var key = prompt("Please enter a new key. Don't use whitespaces in the name", "");

        if (key != null) {
            var whitespaces = key.match(/\s/g);
            if(!whitespaces){
                groupValue[key] = "";
            }
        }
    }

    /**
    * Create the deleted property
    */
    $scope.undoDelete = function(ref,key,event){
        ref[key] = '';
        var el = angular.element(event.currentTarget.previousElementSibling.previousElementSibling);
        el.attr('placeholder','');
    }

    /**
    * expand is the function for the ng-click directive. It toggles an icon
    */
    $scope.expand = function(isExpanded,event){
        //Toggle icon of link
        var el = angular.element(event.currentTarget).children('.glyphicon');
        el.toggleClass('glyphicon-triangle-bottom glyphicon-triangle-right');

        //Toggle isExpanded. Used at the directive ng-show="isExpanded"
        return !isExpanded;
    }

    /**
    * Check if object is not empty
    */
    $scope.isNotEmpty = function(input){
        return !jQuery.isEmptyObject(input)
    }

    /**
    * isThisAnObject makes sure that the language file exists. If yes, angular starts creating and displaying the view.
    */
    $scope.isThisAnObject = function(input) {
        //if(!jQuery.isEmptyObject(input)){
          return angular.isObject(input) ? true : false;
        //} else {
          //return false;
        //}
    }

    /**
    * Is used for the recursive templating of the view.
    * If the type is 'object' or 'hash' the template will start a new recursion step.
    */
    $scope.type = function(input){
      switch(typeof input){
          case 'object':
            if(Object.prototype.toString.call(input) === "[object Array]"){
                return 'array';
            } else if (input == null) {
                return 'null';
            } else {
                return 'hash';
            }
          case 'string':
                return "string";
          default:
              return typeof input;
      }
  }
}]);
