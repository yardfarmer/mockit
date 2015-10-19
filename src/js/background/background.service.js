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
            tab: null
        },
        handlers = {
            getAllRules: getAllRules,
            addRule: addRule,
            modifyRule: modifyRule,
            deleteRule: deleteRule,
            startMocking: startMocking,
            stopMocking: stopMocking,
            getMockingData: getMockingData
        };

        return service;

        var MockHandler = function() {

            function isRuleExist(rurl) {
                return Object.keys(Mock._mocked).some(function(urlRegExp) {
                    return rurl.match(urlRegExp);
                })
            }

            function getMockValue(rurl) {
                for(var urlRegExp in Mock._mocked) {
                    if(rurl.match(new RegExp(urlRegExp))) {
                        return Mock.mock(Mock._mocked[urlRegExp].template);
                    }
                }
                return "";
            }

            function get(template) {
                return Mock.mock(template);
            }

            return {
                get: getMockValue
            }
        }();

        /**
         *
         */
        function init () {
            chromeService.addMessageListener(handlers);
            chromeService.addBrowserActionListener(initAppTab);
        }

        function initAppTab() {
            chromeService.queryTab({active: true, currentWindow: true}, function (tab) {
                console.log('source tab > ', tab);

                // do nothing when clicking ZCapture button on ZCapture App tab
                if (tab[0].id === _tabs.app) {
                    return;
                }
                _tabs.source = tab[0].id;
                console.log('source_url', tab[0].url);

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
                    url: 'src/dhc.html'
                }, function (tab) {
                    console.log('app tab > ', tab.id);
                    _tabs.app = tab.id;
                });
            }
        }

        function getAllRules(request) {
            return getMockedRules[request.rule.rurl];
        }

        function addRule(data) {
            Mock.mock(data.rurl, data.template);
            Mock._mocked[data.rurl].type = data.type;
        }

        function modifyRule(data) {
            //if (data.rurl in Mock._mocked) {
            //    var mock = Mock._mocked[data.rurl];
            //    mock.template = data.row.template;
            //} else {
            //  addRule(data);
            //}
            ////mockService.set(data);
            //console.log('now _mocked is', data);
        }

        function deleteRule(data) {
            console.log("deleteRule", data);
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
            console.log('get Request ....', request.type, request.tabId, request.requestId, request);

            /**
             * TODO: 如下
             *
             * => input rule is string , not object
             *
             * [script, image, main_frame(http://tao.1688.com/), stylesheet, ]
             * => image, stylesheet
             * => tabId: 441, (仅 mock 此页 tab)
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
                    return wrapper[rule.type](Mock.mock(rule.template), request.url);
                    //return jsonWrapper(Mock.mock(rule.template));
                }
            }

            /**
             * 异步是不可以的, 规则匹配,
             * 当前所请求的 url 是否与已设定的 mock 规则匹配
             */
        }

        function jsonWrapper(data) {
            //return true;
            var result = {};
            result.redirectUrl =
                "data:text/plain;charset=utf-8;base64," + window.btoa(JSON.stringify(data));
            return result;
        }

        function jsonpWrapper(data, requestUrl) {
            //jQuery172073799591162242_1445188246695({})
            var jsonpId = getJsonpId(requestUrl);
            var result = {};
            var jsonpResponse = jsonpId+'('+JSON.stringify(data)+')';
            console.log(jsonpResponse);

            result.redirectUrl =
                "data:text/plain;charset=utf-8;base64," + window.btoa(jsonpResponse);
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