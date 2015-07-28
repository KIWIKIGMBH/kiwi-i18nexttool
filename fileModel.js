/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**
* inspired by: http://www.webdeveasy.com/angularjs-data-model/
*/

'use strict';

var fileModel = angular.module('fileModel',[]);

fileModel.factory('fileManager',['$q', 'FileModel', 'fileReader',  function($q, FileModel,fileReader){
var fileModelManager = {
    _pool: {'keys': {} }, //List of language files

    _retrieveInstance: function(fileLang, fileData) {  //Update or create new file in file list.
        var instance = this._pool[fileLang];
        if (instance) {
            instance.setData(fileData);
        } else {
            instance = new FileModel(fileData);
            this._pool[fileLang] = instance;
        }

        return instance;
    },
    _search: function(fileLang) {
            return this._pool[fileLang];
    },
    _parseJSON: function(fileData,fileName) {
            try{
                return JSON.parse(fileData);
            } catch(e) {
                return {'version' : { 'lang': 'Error: ' + fileName + ' has invalid json format' }};
            }
    },
    /* Public Methods */
    /**
    * Update the key list in this._pool.keys.
    */
    updateKeyList: function(newLanguage){
        var pool = this._pool;
        //debugger;
        if(pool.hasOwnProperty(newLanguage)){
            this.mergeProperties(pool.keys,pool[newLanguage]);
        }
    },
    updatePropertiesOfLanguages: function(){
        var pool = this._pool;
        //debugger;
        for(var property in pool){
            if(property !== 'keys'){
                this.mergeProperties(pool[property],pool['keys']);
            }
        }
    },
    /**
    * Merge the properties of 2 files. If new properties get added, then they have a '' value.
    * This function is recursive
    */
    mergeProperties: function(target,input){
        for(var property in input){
            //Only add a property if its an own property and it doesn't exist in the target.
            if(input.hasOwnProperty(property) && !(property in target)){
                //debugger;
                try {
                    // If property is an object, we start the recursive call.
                    if(input[property] !== null && typeof input[property] === 'object'){
                        target[property] = {};
                        target[property] = this.mergeProperties(target[property], input[property]);
                    } else {
                        target[property] = '';
                    }
                } catch(e) {
                    target[property] = '';
                }
            }
        }

        return target;
    },
    getArrayOfLanguages: function(){
        var obj = {}, colors = ['blue','green','yellow'], i = 0;
        for(var property in this._pool){
            if(property !== 'keys'){
                if(i > colors.length-1) i = 0;
                obj[property] = colors[i];
                i++;
                //arr.push(property);
            }
        }
        return obj;
    },
    /* Use this function in order to get a file instance by it's id */
    getFile: function(fileId) {
            var deferred = $q.defer();
            var file = this._search(fileId);
            if (file) {
                deferred.resolve(file);
            } else {
                this._load(fileId, deferred);
            }
            return deferred.promise;
    },
    /* Use this method to load a language file from the harddrive with the FileAPI service (fileReader -> see below). */
    readAsText: function(file, scope){
            return fileReader.readAsText(file, scope);
    },
    getAllFiles: function(){
            return this._pool;
    },
    /**
    * This function checks for type of file, creates the keyList and stores the data of the file into this._pool.
    * It can also be used to update the file.
    */
    setFile: function(fileData,type,fileName) {
            var scope = this;
            switch (type){
                case 'JSON'://JSON.parse();
                    //Parse Json. Gives back an error JSON if the file has some problems.
                    var jsonData = scope._parseJSON(fileData,fileName);

                    //Have a look if the language already exists in the object.
                    var file = this._search(jsonData.version.lang);
                    if (file) {
                        file.setData(jsonData);
                    } else {
                        file = scope._retrieveInstance(jsonData.version.lang, jsonData);
                    }

                    //Update key list and update all properties of the existing languages
                    scope.updateKeyList(jsonData.version.lang);
                    scope.updatePropertiesOfLanguages();

                    return file;
                default:
                    return 'No input type choosed';
            }
    }
};
    return fileModelManager;
}]);

/**
* 
*/
fileModel.factory('FileModel', function(){

    function FileModel(fileData) {
        if (fileData) {
            this.setData(fileData);
        }
    };

    FileModel.prototype = {
        setData: function(fileData) {
            angular.extend(this, fileData);
        },
        getData: function(){
            return this;
        },
        delete: function() {
        },
        update: function() {
        },
        isAvailable: function() {
        }
    };
    return FileModel;

});

/**
* Service that provides access to the readAsText function of the FileAPI
* Note: Only function that is returned is 'readAsText()'.
*       The function is implemented as a promise.
*       See: http://www.webdeveasy.com/javascript-promises-and-angularjs-q-service/
*/
fileModel.factory("fileReader", function($q, $log){

        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };

        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };

        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };

        var getReader = function(deferred, scope) {
            var reader = new FileReader(); // See: https://developer.mozilla.org/de/docs/Web/API/FileReader
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };

        var readAsText = function (file, scope) {
            var deferred = $q.defer();

            var reader = getReader(deferred, scope);
            reader.readAsText(file); //Note: no recursion

            return deferred.promise;
        };

        return {
            readAsText: readAsText
        };
});
