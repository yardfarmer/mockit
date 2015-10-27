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

        vm.ruleList = [];
        vm.mockRurl = '';
        vm.mockType = 'json';
        vm.mockTemplate = angular.toJson({'name': 'hongta', price: 7}, true);
        vm.mockPreview =  angular.toJson({'name': 'hongta', price: 7}, true);
        vm.mockRuleName = '';
        vm.mockRunState = true;
        vm.mockRuleValidate = true;
        vm.historyList = [];
        vm.historyToggleState = false;

        vm.startAll = popupService.startMocking;
        vm.stopAll = popupService.stopMocking;

        vm.editorOptions = {
            theme:'mdn-like',
            //lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            smartIndent: true,
            mode: {name: "javascript", json: true},
            extraKeys: {
                "F11": function(cm) {
                    cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                },
                "Esc": function(cm) {
                    if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                }
            }
        };

        vm.previewOptions = {
            readOnly:true,
            theme:'xq-light',
            smartIndent: true,
            mode: {name: "javascript", json: true},
            extraKeys: {
                "F11": function(cm) {
                    cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                },
                "Esc": function(cm) {
                    if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                }
            }
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
                "runstate": vm.mockRunState
            };

            if(popupService.isRuleExist(newRule, vm)) {
                popupService.syncToRuleList(newRule, vm); // sync
            } else {
                vm.ruleList.unshift(newRule);
            }
            popupService.saveRules(vm);
            //chromeService.sendMessage('addRule', vm);
        };

        vm.deleteRule = function() {
            var ruleList = vm.ruleList;
            ruleList.forEach(function(existRule, index) {
                if(existRule && existRule.rurl == vm.mockRurl) {
                    vm.ruleList.splice(index, 1);
                }
            });
            chromeService.sendMessage('deleteRule', vm, function() {
                popupService.saveRules(vm, function() {
                    $rootScope.$apply(function() {
                        vm.mockRurl = null;
                        vm.mockTemplate = null;
                        vm.mockPreview = null;
                        vm.mockRuleName = null;
                    });
                });
            });
        };

        vm.setFocus = function(rule) {
            vm.mockRuleName = rule.name;
            vm.mockRurl = rule.rurl;
            vm.mockTemplate = angular.toJson(rule.template, true);
            vm.mockType = rule.type;
            vm.mockRunState = rule.runstate;
        };

        vm.import = function(e) {
          //$('#filePicker').trigger('click');
            var data = e.target.result;
            var rawData = data.split(',');
            if(rawData.length === 2) {
                var importedJson = atob(rawData[1]);
                $rootScope.$apply(function() {
                    vm.ruleList = angular.fromJson(importedJson);
                    popupService.saveRules(vm);
                });
            }
        };

        vm.export = function() {
            var dataUrl = "data:text/json;base64,";

            var data = angular.toJson(vm.ruleList,true);
            data = btoa(data);


            var file = document.createElement("a");
            file.download = 'mock.json';
            file.href = dataUrl+data;
            file.click();
        };

        vm.reformat = function() {
            vm.mockTemplate = angular.toJson(angular.fromJson(vm.mockTemplate),true)
        };

        vm.preview = function(info) {
            vm.mockPreview = info;
        };

        vm.fullscreen = function() {};

        vm.toggleState = function() {
            vm.mockRunState = !vm.mockRunState;
            if(vm.mockRunState) {

            }
        };

        vm.toggleHistoryPanel = function() {
            if (vm.historyToggleState) {
                vm.historyPanelHeight={height:'43px'};
            }else {
                vm.historyPanelHeight={height:'300px'};
            }
            vm.historyToggleState = !vm.historyToggleState;
        };

        init();

        function init() {
            vm.startAll();
            popupService.loadData(function(data) {
                $rootScope.$apply(function () {
                    vm.ruleList = data;
                });

                data.forEach(function(item){
                    chromeService.sendMessage('addRule', item);
                });
            });

            $('#filePicker').change(function(event){
                //angular.element(this).scope().import(event);
                var files = event.target.files; //FileList object
                console.log(files, event);
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var reader = new FileReader();
                    reader.onload = vm.import;
                    reader.readAsDataURL(file);
                }
            });

            var handler = {
                interceptedRequest: function(data) {
                    console.log('gottt!',data);
                    $rootScope.$apply(function() {
                        vm.historyList.unshift(data);
                    });
                }
            };
            chromeService.addMessageListener(handler);
        }
    }
})();