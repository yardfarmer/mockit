// 使用 Mock
var data = Mock.mock({
    'list|1-10': [{
        'id|+1': 1
    }]
});

function click(e) {
    // chrome.tabs.executeScript(null,
    //    {code:"document.body.style.backgroundColor='" + e.target.id + "'"});
    // background window
    //var bgp = chrome.extension.getBackgroundPage();

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