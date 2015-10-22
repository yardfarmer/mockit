/**
 * Created by cyk on 15/10/1.
 */

(function () {
    'use strict';
    angular
        .module('app.popup')
        .factory('popupService', popupService);

    popupService.$inject = ['storageService', 'chromeService'];

    function popupService(storageService, chromeService) {
        var service = {
            startMocking: startMocking,
            stopMocking: stopMocking,
            loadData: loadData,
            saveRules: saveRuleList,
            isRuleExist: isRuleExist,
            syncToRuleList: syncToRuleList
        };
        return service;


        function startMocking() {
            chromeService.sendMessage('startMocking');
        }

        function stopMocking() {
            chromeService.sendMessage('stopMocking');
        }

        function loadData(callback) {
            storageService.getData('rules', function (data) {
                console.log('get', data);
                if (Array.isArray(data.rules)) {
                    callback(data.rules);
                }
            });
        }

        function saveRuleList(vm, callback) {
            storageService.saveData({rules: vm.ruleList}, callback);
        }

        function syncToRuleList(newRule, vm) {
            vm.ruleList.forEach(function(existRule, index){
                if (existRule.rurl == newRule.rurl) {
                    vm.ruleList[index] = newRule;
                    //existRule = newRule;
                }
            });
        }

        function isRuleExist(newRule, vm) {
            var ruleCache = vm.ruleList;
            return ruleCache.some(function (existRule) {
                return existRule.rurl == newRule.rurl;
            });
        }

        //function saveRules() {
        //    storageService.saveData({
        //        ruleList: $scope.ruleList
        //    });
        //}
        //
        //function readRules() {
        //    storageService.getData('rules', function(data) {
        //        $scope.ruleList = data.ruleList;
        //    });
        //}
    }
})();