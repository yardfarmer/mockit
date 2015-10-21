/**
 * Created by yakuncyk on 15/8/20.
 */

(function() {
    'use strict';
    angular
        .module('app.popup')
        .controller('MainController', MainController);

    MainController.$inject = ['popupService', 'chromeService',  '$rootScope'];

    function MainController(popupService, chromeService, $rootScope) {
        var vm = this;
        console.log(this);
        vm.ruleList = [];
        vm.mockRurl = 'offer.json';
        vm.mockType = 'json';
        vm.mockTemplate = '{"x":1}';
        vm.mockPreview =  '{"x":1}';
        vm.mockRuleName = '';
        vm.mockRuleValidate = true;

        vm.startAll = popupService.startMocking;
        vm.stopAll = popupService.stopMocking;

        vm.editorOptions = {
            theme:'mdn-like',
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            smartIndent: true,
            mode: {name: "javascript", json: true}
        };

        vm.previewOptions = {
            readOnly:true,
            theme:'mdn-like',
            smartIndent: true,
            mode: {name: "javascript", json: true}
        };

        vm.setMockRule = function() {
            var ruleObj;
            try {
                ruleObj = angular.fromJson(vm.mockTemplate);
                vm.mockRuleValidate = true;
            } catch (e) {
                // show json error
                console.log('json error');
                vm.mockRuleValidate = false;
            }

            var newRule = {
                "name": vm.mockRuleName,
                "rurl": vm.mockRurl,
                "type": vm.mockType,
                "template": ruleObj,
                "work": true
            };

            if(popupService.isRuleExist(newRule, vm)) {
                popupService.syncToRuleList(newRule, vm); // sync
            } else {
                vm.ruleList.unshift(newRule);
            }
            popupService.setMockRule(vm);
        };

        init();

        function init() {
            vm.startAll();
            popupService.loadData(function(data) {
                $rootScope.$apply(function () {
                    vm.ruleList = data;
                });
            });
        }
    }
})();