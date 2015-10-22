/**
 * Created by yakuncyk on 15/10/4.
 */

(function() {
    'use strict';

    angular
        .module('app.background')
        .factory('backgroundService', backgroundService);

    backgroundService.$inject = ['chromeService', 'storageService', 'mockService'];

    function backgroundService(chromeService, storageService, mockService) {
        var service = {
            init: init
        },
        _tabs = {
            source: null,
            tab: null,
            page: 'src/index.html'
        },
        handlers = {
            getAllRules: getAllRules,
            addRule: addRule,
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
            chromeService.addMessageListener(handlers);
            chromeService.addBrowserActionListener(initAppTab);
        }

        function initAppTab() {
            chromeService.queryTab({active: true, currentWindow: true}, function (tab) {
                //console.log('source tab > ', tab);

                // do nothing when clicking ZCapture button on ZCapture App tab
                if (tab[0].id === _tabs.app) {
                    return;
                }
                _tabs.source = tab[0].id;
                //console.log('source_url', tab[0].url);

                var newTabIndex = tab[0].index + 1;

                if (_tabs.app) {
                    chromeService.getTab(_tabs.app, function (tab) {
                        if (tab) {
                            chromeService.updateTab(tab.id, {selected: true});
                        } else {
                            _setTab(newTabIndex);
                        }
                    });

                    return true;
                }
                _setTab(newTabIndex);
            });

            function _setTab(index) {
                chromeService.createTab({
                    index: index,
                    url: _tabs.page
                }, function (tab) {
                    //console.log('app tab > ', tab.id);
                    _tabs.app = tab.id;
                });
            }
        }

        function getAllRules(request) {
            return getMockedRules[request.rule.rurl];
        }

        function addRule(vm) {
            if (vm.mockRurl in Mock._mocked) {
                var mock = Mock._mocked[vm.mockRurl];
                mock.template = vm.mockTemplate;
            } else {
                Mock.mock(vm.mockRurl, vm.mockTemplate);
            }
            Mock._mocked[vm.mockRurl].type = vm.mockType;

            console.log('now _mocked is', vm);
        }

        function deleteRule(data, callback) {
            console.log("deleteRule", data);
            callback && callback();
        }

        function startMocking () {
            chromeService.addRequestFilter(_requestHandler);
        }

        function stopMocking () {
            chromeService.removeRequestFilter(_requestHandler)
        }

        function getMockingData (data) {
        }

        function _requestHandler (request, response) {
            //console.log('get Request ....', request.type, request.tabId, request.requestId, request);

            /**
             * TODO: 如下
             *
             * => input rule is string , not object
             *
             * [script, image, main_frame(http://tao.1688.com/), stylesheet, ]
             * => image, stylesheet
             *
             * => 优化输入区域, 更方便编辑规则
             * =>
             */

            var wrapper = {
                json: jsonWrapper,
                jsonp: jsonpWrapper
            };

            for(var urlRegExp in Mock._mocked) {
                if(request.url.match(new RegExp(urlRegExp))) {
                    var rule = Mock._mocked[urlRegExp];
                    var param = {
                        mockData: Mock.mock(rule.template),
                        request: request,
                        type: rule.type,
                        callback: sendRequestLog
                    };
                    return wrapper[rule.type](param);
                }
            }
        }

        /**
         *
         * @param dataObj
         *  {
         *      mockData:
         *      request:
         *      callback:
         *  }
         *
         * @returns {{}}
         */
        function jsonWrapper(dataObj) {
            //return true;
            var result = {};
            try {
                result.redirectUrl =
                    "data:text/plain;charset=utf-8;base64," +
                    window.btoa(unescape(encodeURIComponent(JSON.stringify(dataObj.mockData))));

            } catch(e) {
                console.log('btoa error');
            }
            dataObj.callback && dataObj.callback(dataObj);
            return result;
        }

        function jsonpWrapper(dataObj) {
            //jQuery172073799591162242_1445188246695({})
            var jsonpId = getJsonpId(dataObj.request.url);
            var result = {};
            var jsonpResponse = jsonpId+'('+JSON.stringify(dataObj.mockData)+')';
            try {
                result.redirectUrl =
                    "data:text/plain;charset=utf-8;base64," + window.btoa(unescape(encodeURIComponent(jsonpResponse)));
            } catch(e) {

            }
            dataObj.callback && dataObj.callback(dataObj);
            return result;
        }

        function sendRequestLog(data) {
            console.log('sendRequestLog', data);
            var t = new Date();
            data.time = t.getHours() + ':' +
                        t.getMinutes() +':'+
                        t.getSeconds() +':'+
                        t.getMilliseconds();
            chromeService.sendMessage('interceptedRequest', data)
        }

        function getMockedRules() {
            return Mock._mocked;
        }

        function getJsonpId(reqUrl, callbackLabel) {
            callbackLabel = callbackLabel || "callback";
            var key, value, jsonpid = "";
            var urlArr = reqUrl.split("?");
            var urlParams;
            if (urlArr.length > 1) {
                urlParams = urlArr[1];
            }

            urlParams.split("&").forEach(function(param) {
                var pair = param.split("=");
                key = pair[0];
                value = pair[1];
                if(key === callbackLabel) {
                    jsonpid = value;
                }
            });
            return jsonpid;
        }
    }
})();