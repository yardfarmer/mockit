// 配置 Mock 路径
require.config({
    paths:{
        //'mock':'http://mockjs.com/dist/mock'
        'mock': './mock',
        'avalon.smartgrid': '../vendor/avalon.oniui/smartgrid/avalon.smartgrid',
        'avalon.switchdropdown': '../vendor/avalon.oniui/switchdropdown/avalon.switchdropdown'
    }
});

// 加载 Mock
require(['mock'], function(Mock){
    // 使用 Mock
    var data = Mock.mock({
        'list|1-10': [{
            'id|+1': 1
        }]
    });
    console.log(data);
});

function click(e) {
    // chrome.tabs.executeScript(null,
    //    {code:"document.body.style.backgroundColor='" + e.target.id + "'"});

    // background window
    var bgp = chrome.extension.getBackgroundPage();

    var ruleA = {
        msgtype: 'mock',  // auto append
        rurl: /abc.json/,
        template: {
            'list|1-10': [{
                'id|+1': 1,
                'email': '@EMAIL'
            }]
        }
    };

    var ruleB = {
        msgtype: 'mock',  // auto append
        rurl: /abd.json/,
        template: {
            'title': 'Syntax Demo',
            'string1|1-10': '★',
            'string2|3': 'value',
            'number1|+1': 100,
            'number2|1-100': 100,
            'number3|1-100.1-10': 1
        }
    };

    console.log('clk hello');
    //chrome.runtime.sendMessage(ruleA, function (response) {
    //    console.log(response);
    //});

    chrome.runtime.sendMessage({greeting: 'hello'}, function (response) {
        console.log(response);
    });
    //window.close();
}

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', click);
});



require(["../vendor/avalon.oniui/smartgrid/avalon.smartgrid", "../vendor/avalon.oniui/switchdropdown/avalon.switchdropdown"], function() {
    function getDatas(number) {
        var data = []
        for (var i = 0; i < number; i++) {
            data.push({
                description: "北上广经济型计划"+i,
                operate: i % 5 ? 0 : 1,
                buget: 5800,
                display: 13534646,
                click : 15932,
                clickRate : "50.21%",
                consume: 1135800,
                averageClickRate: 1.82,
                disable: i == 3 ? true : false,
                selected: false,
                checkboxShow: false
            })
        }
        data[2].checkboxShow = true;

        // data[0].checkboxShow = false //当selectable.type为Checkbox时，设置checkboxShow为false会屏蔽掉列表行前面的选框，需要注意的是：设置checkboxShow为false，务必保证selected为false或者不存在selected的设置
        return data
    }

    avalon.define("test", function(vm) {
        vm.$skipArray = ["opts"] //不需要转为监控属性的属性务必放到$skipArray数组中，减少开销提高性能
        vm.render = function() {
            var data = getDatas(8)
            data[0].checkboxShow = true
            avalon.vmodels.sg1.render(data)
        }
        vm.opts = {
            // 不希望组件的配置项被smartgrid监控，将其放到$skipArray数组中，添加其他组件同理
            $skipArray: ["switchdropdown", "dropdown", "pager"],
            selectable: {
                type: "Checkbox" //为表格添加选中行操作框,可以设置为"Checkbox"或者"Radio"
            },
            dropdownData: [{ // dropdown的数据信息
                name: "忙",
                value: "1"
            },{
                name: "不忙",
                value: "0"
            }],
            dropdown : {
                width: 100,
                listWidth: 100
            },
            htmlHelper: { // 渲染列数据的方法集合
                // 包装工资列的数据
                $X: function(vmId, field, index, cellValue, rowData) {//所有包装函数都会收到4个参数，分别是smartgrid组件对应vmodel的id，列标志(key)，列索引，列数据值
                    avalon.log("arguments is : ")
                    avalon.log(arguments)
                    return "$"+cellValue
                },
                // operate列包装成switchdropdown组件
                switchdropdown: function(vmId, field, index, cellValue, rowData, disable) {
                    var openOption = cellValue == 0 ? '<option value="0" selected>启用</option>' : '<option value="0">启用</option>',
                        pauseOption = cellValue == 1 ? '<option value="1" selected>暂停</option>' : '<option value="1">暂停</option>'

                    return ['<select ms-widget="switchdropdown" rowindex="'+index+'" field="'+field+'"  vmId="'+vmId+'" '+ (disable ? "disabled": "") +'>', openOption, pauseOption, '</select>'].join('')
                },
                // busy列包装成dropdown组件
                dropdown: function(vmId, field, index, cellValue, rowData, disable) {
                    var option = "<option ms-repeat='dropdownData' ms-attr-value='el.value' ms-attr-label='el.name' ms-selected='el.value == " + cellValue + "'></option>"
                    return '<select ms-widget="dropdown" rowindex="' +index+'" field="'+field+'" vmId="'+vmId+'" ' + (disable ? "disabled" : "") + '>' + option + '</select>'
                }
            },
            columns: [
                {
                    key : "description",
                    name : "竞价推广计划",
                    sortable : false,
                    isLock : true,
                    align: "left",
                    defaultValue: "北上广经济型计划",
                    customClass: "ddd",
                    width: 150
                }, {
                    key: "operate",
                    name: "操作",
                    title: "操作",
                    width: 110,
                    format: "switchdropdown"
                }, {
                    key : "buget",
                    name : "预算",
                    sortable : true,
                    align: "right",
                    defaultValue: "￥5800",
                    width: 75,
                    format: "$X" // 定义渲染数据的方法名
                }, {
                    key : "display",
                    name : "展现",
                    sortable : true,
                    align: "right",
                    width: 98
                }, {
                    key : "click",
                    name : "点击",
                    sortable : true,
                    align: "right",
                    width: 90
                }, {
                    key : "clickRate",
                    name : "点击率",
                    sortable : true,
                    align: "right",
                    width: 90
                }, {
                    key : "consume",
                    name : "消费",
                    sortable : true,
                    align: "right",
                    width: 85,
                    format: "$X" // 定义渲染数据的方法名
                }, {
                    key : "averageClickRate",
                    name : "平均点击价格",
                    sortable : true,
                    align: "right",
                    width: 115,
                    format: "$X" // 定义渲染数据的方法名
                }
            ],
            // data: getDatas(8)
            data: []
        }
    })
    avalon.scan()
})
