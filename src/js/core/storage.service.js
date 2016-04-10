/**
 * Created by yakuncyk on 15/8/20.
 */

(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('storageService', storageService);

    storageService.$inject = ['chromeService'];

    function storageService(chromeService) {
        /**
         * 数据存储的前缀
         * @type {string}
         */
        var dataPrefix = "_mockit_";

        var service = {
            getData : getData,
            saveData: saveData
        };

        return service;

        function addDataPrefix (data) {
            var results, key, value;
            if (typeof data == 'string') {
                return dataPrefix + data;
            } else if (Array.isArray(data)) {
                results = [];
                for(key in data) {
                    value = data[key];
                    results.push(dataPrefix + value);
                }
                return results;
            } else if (typeof data === 'object' && data !== null) {
                results = {};
                for(key in data) {
                    value = data[key];
                    results[dataPrefix + key] = value;
                }
                return results;
            }
        }

        function removeDataPrefix (data) {
            var results = {};
            for(var key in data) {
                var value = data[key];
                results[key.replace(dataPrefix, '')] =  value;
            }

            return results;
        }

        function saveData (data, callback) {
            data = addDataPrefix(data);
            chromeService.setStorage(data, function (result) {
                if (typeof callback !== 'undefined') {
                    callback(result);
                }
            });
        }

        function getData (key, callback) {
            key = addDataPrefix(key);
            chromeService.getStorage(key, function (result) {
                result = removeDataPrefix(result);
                if (typeof callback !== 'undefined') {
                    callback(result);
                }
            });
        }

        function updateData(key, data, callback) {
            //getData(key, saveData())
        }
    }
})();
