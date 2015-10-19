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
            addBrowserActionListener: addBrowserActionListener,
            onMessage: onMessage,
            sendMessage: sendMessage,
            sendRequest: sendRequest,
            createTab: createTab,
            updateTab: updateTab,
            getTab: getTab,
            queryTab: queryTab,
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

        function addBrowserActionListener(handler) {
            $window.chrome.browserAction.onClicked.addListener(handler);
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
            //$window.chrome.browserAction.setIcon({path: iconpath});
            //$window.chrome.browserAction.onClicked.addListener(updateIcon);
        }

        function createTab(params, callback) {
            $window.chrome.tabs.create(params, callback);
        }

        function updateTab(id, data) {
            $window.chrome.tabs.update(id, data);
        }

        function getTab(id, callback) {
            $window.chrome.tabs.get(id, callback);
        }

        function queryTab(params, callback) {
            $window.chrome.tabs.query(params, callback);
        }
    }
})();