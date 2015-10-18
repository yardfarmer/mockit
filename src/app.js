/**
 * Created by cyk on 15/9/27.
 */

"use strict";
//TODO: 包管理机制

//var app = angular.module('app', ['ui.grid']);
var app = angular.module('app', ['ui.grid', 'ui.grid.expandable', 'ui.grid.selection', 'ui.grid.pinning', 'ui.grid.edit', 'ui.grid.cellNav']);

app.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.ruleList = {};
    $scope.ruleList.enableCellEditOnFocus = true;
    $scope.ruleList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope, function (newRow, someOther, newData, oldData) {
            MsgController.send(MsgController.RULE_CHANGED, newRow);
        });
    };

    $scope.ruleList.columnDefs = [
        {name: 'index', enableCellEdit: false},
        {name: 'rule', enableCellEditOnFocus: true, displayName: '/abc/?.?'},
        {name: 'type', enableCellEdit: true},
        {name: 'config', displayName: 'mock 规则', enableCellEdit: true},
        {name: 'work', displayName: '运行', enableCellEdit: true}
    ];
    $scope.ruleList.data = [
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
        var n = $scope.ruleList.data.length + 1;
        $scope.ruleList.data.push({
            "index": "New " + n,
            "rurl": "Person " + n,
            "type": "abc",
            "template": true,
            "work": "male"
        });

        $scope.ruleList.gridApi.core.notifyDataChange('ALL');
    };

    $scope.removeFirstRow = function () {
        //if($scope.gridOpts.data.length > 0){
        $scope.ruleList.data.splice(0, 1);
        //}
    };

    $scope.startAll = function() {
        MsgController.send(MsgController.ALL_START);
    };

    $scope.stopAll = function() {
        MsgController.send(MsgController.ALL_STOP);
    };
}]);


//app.controller('navbarController',['$scope', '$http', '$log', function ($scope, $http, $log) {
//    $scope.navList = [];
//    //$http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
//    //    .success(function(data) {
//    //        for(var i = 0; i < data.length; i++){
//    //            data[i].subGridOptions = {
//    //                columnDefs: [ {name:"Id", field:"id"},{name:"Name", field:"name"} ],
//    //                data: data[i].friends
//    //            }
//    //        }
//    //        $scope.gridOptions.data = data;
//    //    });
//}]);

app.controller('SecondCtrl', ['$scope', '$http', '$log', function ($scope, $http, $log) {
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

    //$http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
    //    .success(function(data) {
    //        for(var i = 0; i < data.length; i++){
    //            data[i].subGridOptions = {
    //                columnDefs: [ {name:"Id", field:"id"},{name:"Name", field:"name"} ],
    //                data: data[i].friends
    //            }
    //        }
    //        $scope.gridOptions.data = data;
    //    });
}]);

/**
 * 与守护程序通信
 * @type {{send}}
 */
var MsgController = (function () {

    function _sendMsg(mstType,rule) {
        var data = {
            msgType: mstType,
            rule: rule
        };
        chrome.runtime.sendMessage(data, function (response) {
            console.log(response);
        });
    }

    return {
        RULE_CHANGED: 'ruleChanged',
        RULE_STOP: 'ruleStop',
        RULE_SART: 'ruleStart',
        ALL_STOP: 'allStop',
        ALL_START: 'allStart',

        send: _sendMsg
    }
}());