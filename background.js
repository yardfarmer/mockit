/**
 * Created by cyk on 15/9/15.
 */


console.log(Mock);

var iconpath;
var current = false;
// string for a URL we temporarily want to *not* intercept
var redirectionUrl;
var flag = true;


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "hello")
            sendResponse({farewell: "goodbye"});
    });


chrome.webRequest.onBeforeRequest.addListener(
    requestHandler,
    {
        urls: [
            "http://*/*",
            "https://*/*",
        ]
    },
    ["blocking"]);


function requestHandler(info) {
    if (!flag) {
        return;
    }
    flag = false;
    console.log(info);

    var extType = getExtType(info.url);

    switch (extType) {
        case 'json':
            return jsonHandler(info);
            break;
        case 'jsonp':
            return jsonpHandler(info);
            break;
        default:
    }
}

/**
 * 判断请求的文件类型
 */
function getExtType(url) {
    var requestUrl = url;
    var urlArr = requestUrl.split('?');
    //var param;

    // 含有参数
    //if(urlArr.length > 1) {
    //    param = urlArr[1];
    //}
    var extRegExp = /\.([\w]+)$/g;
    var extMatchs = extRegExp.exec(urlArr[0]);
    if (extMatchs && extMatchs.length > 1) {
        return extMatchs[1];
    } else {
        return '';
    }
}


function jsonHandler(info) {

    var result = {};

    var data = Mock.mock({
        'list|1-10': [{
            'id|+1': 1
        }]
    });

    result.redirectUrl =
        "data:text/plain;charset=utf-8;base64," + window.btoa(JSON.stringify(data));

    return result;

}

function jsonpHandler(info) {

    var editPayload = null;
    var needRequest = true;
    if (needRequest) {
        var xmp = new XMLHttpRequest();
        xmp.open("GET", info.url, false);
        try {
            xmp.send();
        } catch (e) {
            console.log('catch:', e);
        }
        editPayload = xmp.responseText;

        console.log('editPayload', editPayload)
    }

    var result = {};//askUser(category, info, editPayload);
    redirectionUrl = result.redirectUrl;
    return result;
}


function updateIcon() {


    if (current) {
        iconpath = 'assets/debuggerPause.png';
    } else {
        iconpath = 'assets/debuggerContinue.png';
    }
    current = !current;

    chrome.browserAction.setIcon({path: iconpath});
}

chrome.browserAction.onClicked.addListener(updateIcon);
updateIcon();
