/**
 * Created by yakuncyk on 15/8/20.
 */

(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('mockService', mockService);

    mockService.$inject = ['chromeService'];

    function mockService(chromeService) {
        /**
         * 数据存储的前缀
         * @type {string}
         */
        var _cache = Mock._mockit_ = [];

        var service = {
            get: mockData,
            set: addRule
        };

        return service;

        function isExist() {
            return false;
        }

        function isMatch(url) {
            for(var i = 0, item; item = _cache[i++];) {
                if (url.match(new RegExp(item.rurl))) {
                    return Mock.mock(item.template);
                }
            }
            return true;
        }

        function addRule (data) {
            //data = addDataPrefix(data);
            if (!isExist(data)) {
                _cache.push(data);
            }else {
                // do modify job
            }
        }

        function mockData (url, wrapper) {
            //key = addDataPrefix(key);
            //chromeService.getStorage(key, function (result) {
            //    result = removeDataPrefix(result);
            //    if (typeof callback !== 'undefined') {
            //        callback(result);
            //    }
            //});

            for(var i = 0, item; item = _cache[i++];) {
                if (url.match(new RegExp(item.rurl))) {
                    //console.log("mked!", Mock.mock(item.row.template));
                    var template = angular.copy(item.row.template);
                    return wrapper(Mock.mock(template));
                }
            }
            return true;
        }
    }
})();