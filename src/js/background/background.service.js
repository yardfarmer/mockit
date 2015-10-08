/**
 * Created by yakuncyk on 15/10/4.
 */

(function() {
    'use strict';

    angular
        .module('app.background')
        .factory('backgroundService', backgroundService);

    backgroundService.$inject = ['configService', 'storageService', 'chromeService', 'asyncService'];

    function backgroundService(configService, storageService, chromeService, asyncService) {
        var service = {
            init: init
        },
        handlers = {
            getAllRules: getAllRules,
            addNewRule: addNewRule,
            modifyRule: modifyRule,
            deleteRule: deleteRule,
            startMocking: startMocking,
            stopMocking: stopMocking,
            getMockingData: getMockingData
        };

        return service;

        /**
         *
         */
        function init () {
            console.log('init background.js');
            chromeService.addMessageListener(handlers);
        }

        function getAllRules() {
            return Mock._mocked[request.rule.rurl];
        }

        function addNewRule() {

        }

        function modifyRule(data) {
            if (request.rule.rurl in Mock._mocked) {
                var mock = Mock._mocked[request.rule.rurl];
                mock.template = request.rule.template;
            }
        }

        function deleteRule() {

        }

        function startMocking () {
            chromeService.addRequestFilter(_requestHandler);
        }

        function stopMocking () {
            // RequestFilter
            chromeService.removeRequestFilter(_requestHandler)
        }

        function getMockingData (data) {
            return rpfService.getRecordingData();
        }

        function _requestHandler (request, response) {
            function requestHandler(request, response) {
                //request.msgType
                console.log('getRequest', request);
                //Mock.mock(request.rurl, request.template);
                response(Mock.mock(request.template));
            }
        }


        function jsonHandler(info) {

            var result = {};

            var data = Mock.mock({
                'list|1-10': [{
                    'id|+1': 1
                }]
            });

            result.redirectUrl =
                "data:text/plain;charset=utf-8;base64," + window.btoa(JSON.stringify(data));

            return result;

        }

        function jsonpHandler(info) {

            var editPayload = null;
            var needRequest = true;
            if (needRequest) {
                var xmp = new XMLHttpRequest();
                xmp.open("GET", info.url, false);
                try {
                    xmp.send();
                } catch (e) {
                    console.log('catch:', e);
                }
                editPayload = xmp.responseText;

                console.log('editPayload', editPayload)
            }

            var result = {};//askUser(category, info, editPayload);
            redirectionUrl = result.redirectUrl;
            return result;
        }

    }
})();