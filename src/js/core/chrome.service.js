/**
 * Created by cyk on 15/10/1.
 */

(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('chromeService', chromeService);

    chromeService.$inject = ['$window'];

    function chromeService($window) {
        var service = {
            setStorage: setStorage,
            getStorage: getStorage,
            addMessageListener: addMessageListener,
            addRequestFilter: addRequestFilter,
            removeRequestFilter: removeRequestFilter,
            onMessage: onMessage,
            sendMessage: sendMessage,
            sendRequest: sendRequest,
            updateIcon: updateIcon
        };
        return service;

        function setStorage(data, callback) {
            $window.chrome.storage.sync.set(data, callback);
        }

        function getStorage(keys, callback) {
            $window.chrome.storage.sync.get(keys, callback);
        }

        function addMessageListener(handlers) {
            console.log('addMessageListener', handlers);
            $window.chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                onMessage(handlers, request, sender, sendResponse);
            });
        }

        function addRequestFilter(requestFilter) {
            console.log('addMessageListener', requestFilter);
            $window.chrome.webRequest.onBeforeRequest.addListener(
                requestFilter,
                {
                    urls: [
                        "http://*/*",
                        "https://*/*"
                    ]
                },
                ["blocking"]);
        }

        function removeRequestFilter(requestFilter) {
            //TODO: Mock._mocked = {};
            $window.chrome.webRequest.onBeforeRequest.removeListener(requestFilter);
        }

        function onMessage(handlers, request, sender, sendResponse) {
            console.log('%creceived request', 'color: green', request.type, request.data);
            if (typeof request.type === 'undefined' || typeof handlers[request.type] === 'undefined') {
                return false;
            }

            var resp = handlers[request.type](request.data);
            console.log('%csend response', 'color: green', resp);
            sendResponse(resp);
        }

        function sendMessage(command, data, callback) {
            console.log('%csend message: ', 'color: green', command, data);
            $window.chrome.runtime.sendMessage({type: command, data: data}, function (resp) {
                if (callback) {
                    callback(resp);
                }
            });
        }

        function sendRequest(command, data, callback) {
            console.log('%csend request: ', 'color: green', command, data);
            $window.chrome.extension.sendRequest({command: command, params: data}, function (resp) {
                if (callback) {
                    callback(resp);
                }
            });
        }

        function updateIcon() {
            if (current) {
                iconpath = 'assets/debuggerPause.png';
            } else {
                iconpath = 'assets/debuggerContinue.png';
            }
            current = !current;

            chrome.browserAction.setIcon({path: iconpath});

            chrome.browserAction.onClicked.addListener(updateIcon);
        }
    }
})();


//console.log(Mock);
//
//var iconpath;
//var current = false;
//// string for a URL we temporarily want to *not* intercept
//var redirectionUrl;
//var flag = true;
//
//
//chrome.runtime.onMessage.addListener(
//    function (request, sender, response) {
//        //console.log(sender.tab ?
//        //"from a content script:" + sender.tab.url :
//        //    "from the extension");
//        console.log(request, sender, response);
//        requestHandler(request, response);
//    });
//
////
////chrome.webRequest.onBeforeRequest.addListener(
////    requestHandler,
////    {
////        urls: [
////            "http://*/*",
////            "https://*/*"
////        ],
////        tabId: 0
////    },
////    ["blocking"]);
//
//
///**
// * 判断请求的文件类型
// */
//function getExtType(url) {
//    var requestUrl = url;
//    var urlArr = requestUrl.split('?');
//    //var param;
//
//    // 含有参数
//    //if(urlArr.length > 1) {
//    //    param = urlArr[1];
//    //}
//    var extRegExp = /\.([\w]+)$/g;
//    var extMatchs = extRegExp.exec(urlArr[0]);
//    if (extMatchs && extMatchs.length > 1) {
//        return extMatchs[1];
//    } else {
//        return '';
//    }
//}
