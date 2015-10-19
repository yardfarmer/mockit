/**
 * Created by yakuncyk on 15/8/20.
 */

(function() {
    'use strict';
    angular
        .module('app.popup')
        .controller('MainController', MainController)
        .controller('PanelController', PanelController)
        .controller('NavbarController', NavbarController);

    MainController.$inject = ['$scope', '$sce', 'chromeService', 'storageService'];
    NavbarController.$inject = ['$scope', '$http'];
    PanelController.$inject = ['$scope', 'chromeService', 'storageService'];

    function MainController($scope, $sce, chromeService, storageService) {
        $scope.ruleList = [];

        //$scope.addData = function () {
        //    var n = $scope.rules.data.length + 1;
        //    $scope.rules.data.push({
        //        "rurl": ".json",
        //        "type": "json",
        //        "template": {
        //            'list|1-10': [{
        //                'id|+1': 1,
        //                'email': '@EMAIL'
        //            }]
        //        },
        //        "work": "male"
        //    });
        //    //chromeService.sendMessage('addRule', {rurl: }, function cb() {
        //    //    saveRules();
        //    //});
        //};

        //$scope.removeFirstRow = function () {
        //    //if($scope.gridOpts.data.length > 0){
        //    $scope.rules.data.splice(0, 1);
        //    chromeService.sendMessage('deleteRule', {rurl: '', type: 'akd'},  function cb() {
        //        saveRules();
        //    });
        //};

        $scope.startAll = function() {
            //backgroundService.startMocking();
            chromeService.sendMessage('startMocking');
        };

        $scope.stopAll = function() {
            chromeService.sendMessage('stopMocking');
        };

        init();

        function init() {
            //readRules();
            chromeService.sendMessage('startMocking');
        }

        function saveRules() {
            storageService.saveData({
                ruleList: $scope.ruleList
            });
        }

        function readRules() {
            storageService.getData('rules', function(data) {
                $scope.ruleList = data.ruleList;
            });
        }
    }

    function NavbarController($scope, $http) {
        $scope.currentSidePanel = "";
    }

    function PanelController($scope, chromeService, storageService) {

        $scope.mockRurl = 'offer.json';
        $scope.mockType = 'json';
        $scope.mockTemplate = '{"x":1}';
        $scope.mockRuleName = '';
        $scope.mockRuleValidate = true;

        $scope.mockPreview =  '{"x":1}';
        //$scope.ruleList = [];

        $scope.editorOptions = {
            theme:'.cm-s-monokai',
            smartIndent: true,
            mode: {name: "javascript", json: true}
        };

        $scope.setMockRule = function() {
            var rule = $scope.mockTemplate;
            var ruleObj;
            try{
                ruleObj = angular.fromJson(rule);
                $scope.mockRuleValidate = true;
            }catch(e) {
                // show json error
                console.log('json error');
                $scope.mockRuleValidate = false;
            }

            var ruleUnit = {
                "name": $scope.mockRuleName,
                "rurl": $scope.mockRurl,
                "type": $scope.mockType,
                "template": ruleObj,
                "work": true
            };

            $scope.ruleList.unshift(ruleUnit);
            chromeService.sendMessage('addRule', ruleUnit, function cb() {
                //console.log($scope.ruleList);
            });
        };

        $scope.setState = function() {

        }
    }

    //var editor = CodeMirror.fromTextArea(document.getElementById("rule-editor"), {
    //    lineNumbers: true,
    //    mode: {name: "javascript", json: true},
    //    smartIndent: true,
    //    tabSize:4
    //});


})();