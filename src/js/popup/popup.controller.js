/**
 * Created by yakuncyk on 15/8/20.
 */

(function() {
    'use strict';
    angular
        .module('app.popup')
        .controller('MainController', MainController)
        .controller('SecondController', SecondCtrl);

    MainController.$inject = ['$scope', '$sce', 'chromeService', 'storageService'];
    SecondCtrl.$inject = ['$scope', '$http'];

    function MainController($scope, $sce, chromeService, storageService) {
        $scope.rules = {};
        $scope.rules.enableCellEditOnFocus = true;
        $scope.rules.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (newRow, someOther, newData, oldData) {
                chromeService.sendMessage('modifyRule', {rurl: newRow.rurl, row: newRow}, function cb() {
                    saveRules();
                });
            });
        };

        $scope.rules.columnDefs = [
            {name: 'rurl', enableCellEditOnFocus: true, displayName: '/abc/?.?'},
            {name: 'type', enableCellEdit: true},
            {name: 'template', displayName: 'mock 规则', enableCellEdit: true},
            {name: 'runstate', displayName: '运行', enableCellEdit: true}
        ];
        $scope.rules.data = [
            {
                "rurl": "abc.json",
                "type": "json",
                "template": {'a|5':1},
                "runstate": true
            }
        ];

        $scope.addData = function () {
            var n = $scope.rules.data.length + 1;
            $scope.rules.data.push({
                "rurl": ".json",
                "type": "json",
                "template": {
                    'list|1-10': [{
                        'id|+1': 1,
                        'email': '@EMAIL'
                    }]
                },
                "work": "male"
            });
            //$scope.rules.gridApi.core.notifyDataChange('ALL');
            //chromeService.sendMessage('addRule', {rurl: }, function cb() {
            //    saveRules();
            //});
        };

        $scope.removeFirstRow = function () {
            //if($scope.gridOpts.data.length > 0){
            $scope.rules.data.splice(0, 1);
            chromeService.sendMessage('deleteRule', {rurl: '', type: 'akd'},  function cb() {
                saveRules();
            });
        };

        $scope.startAll = function() {
            //backgroundService.startMocking();
            chromeService.sendMessage('startMocking');
        };

        $scope.stopAll = function() {
            chromeService.sendMessage('stopMocking');
        };

        init();

        function init() {
            readRules();
        }

        function saveRules() {
            storageService.saveData({
                rules: $scope.rules.data
            });
        }

        function readRules() {
            storageService.getData('rules', function(data) {
                $scope.rules.data = data.rules;
            });
        }
    }

    function SecondCtrl($scope, $http) {
        $scope.gridOptions = {
            enableRowSelection: true,
            expandableRowTemplate: 'expandableRowTemplate.html',
            expandableRowHeight: 150
        };

        $scope.gridOptions.columnDefs = [
            {name: 'id', pinnedLeft: true},
            {name: 'name'},
            {name: 'age'},
            {name: 'address.city'}
        ];
    }
})();