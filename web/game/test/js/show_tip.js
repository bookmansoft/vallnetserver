var winHeight = typeof window.innerHeight != 'undefined' ? window.innerHeight : document.documentElement.clientHeight;
function loadHtml(){
	var div = document.createElement('div');
	div.id = 'weixin-tip';
	div.innerHTML = '<p><img src="images/live_weixin.png" style="width:90%;height:90%;" alt="微信打开" /></p>';
	document.body.appendChild(div);
}

function loadStyleText(cssText) {
    var style = document.createElement('style');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    try {
        style.appendChild(document.createTextNode(cssText));
    } catch (e) {
        style.styleSheet.cssText = cssText; //ie9以下
    }
    var head=document.getElementsByTagName("head")[0]; //head标签之间加上style样式
    head.appendChild(style); 
}
var cssText = "#weixin-tip{position: fixed; left:0; top:0; background: rgba(0,0,0,0.8); filter:alpha(opacity=80); width: 100%; height:100%; z-index: 100;} #weixin-tip p{text-align: center; margin-top: 10%; padding:0 5%;}";

function showWechatTip() {
	$("#weixin-tip").show();
}

loadHtml();
loadStyleText(cssText);
$("#weixin-tip").hide();
$("#weixin-tip").click(function(){
	$("#weixin-tip").hide();
});