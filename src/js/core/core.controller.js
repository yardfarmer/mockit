/**
 * Created by yakuncyk on 15/8/20.
 */

(function() {
    'use strict';
    angular
        .module('app.core')
        .controller('MainController', MainController)
        .controller('SecondController', SecondCtrl);

    MainController.$inject = ['$scope', 'backgroundService'];
    SecondCtrl.$inject = ['$scope', '$http'];

    function MainController($scope, backgroundService) {
        $scope.rules = {};
        $scope.rules.enableCellEditOnFocus = true;
        $scope.rules.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (newRow, someOther, newData, oldData) {
                backgroundService.modifyRule(newRow);
            });
        };

        $scope.rules.columnDefs = [
            {name: 'index', enableCellEdit: false},
            {name: 'rule', enableCellEditOnFocus: true, displayName: '/abc/?.?'},
            {name: 'type', enableCellEdit: true},
            {name: 'config', displayName: 'mock 规则', enableCellEdit: true},
            {name: 'work', displayName: '运行', enableCellEdit: true}
        ];
        $scope.rules.data = [
            {
                "index": "1",
                "rurl": "/abc.json/",
                "type": "json",
                "template": "{a:1}",
                "work": true
            },
            {
                "index": "2",
                "rurl": "/abc.json/",
                "type": "json",
                "template": "{a:1}",
                "work": true
            }
        ];

        $scope.addData = function () {
            var n = $scope.rules.data.length + 1;
            $scope.rules.data.push({
                "index": "New " + n,
                "rurl": "Person " + n,
                "type": "abc",
                "template": true,
                "work": "male"
            });

            $scope.rules.gridApi.core.notifyDataChange('ALL');
        };

        $scope.removeFirstRow = function () {
            //if($scope.gridOpts.data.length > 0){
            $scope.rules.data.splice(0, 1);
            //}
        };

        $scope.startAll = function() {
            backgroundService.startMocking();
        };

        $scope.stopAll = function() {
            backgroundService.stopMocking();
        };
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