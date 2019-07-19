var webLoginUrl = "/login.html";
var wxLoginUrl = "/wxlogin.html";
var OauthUrlForCode = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4f235fecabea48d7";

  //产生随机数函数
  function RndNum(n){
	var rnd="";
	for(var i=0;i<n;i++)
		rnd+=Math.floor(Math.random()*10);
	return rnd;
}

//格式化json
function formatJson(msg) {
	if(msg=="") {
		return "";
	}
	var rep = "~";
	var jsonStr = JSON.stringify(msg, null, rep)
	var str = "";
	for (var i = 0; i < jsonStr.length; i++) {
		var text2 = jsonStr.charAt(i)
		if (i > 1) {
			var text = jsonStr.charAt(i - 1)
			if (rep != text && rep == text2) {
				str += "<br/>"
			}
		}
		str += text2;
	}
	jsonStr = "";
	for (var i = 0; i < str.length; i++) {
		var text = str.charAt(i);
		if (rep == text)
			jsonStr += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		else {
			jsonStr += text;
		}
		if (i == str.length - 2)
			jsonStr += "<br/>"
	}
	return jsonStr;
}

//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//
function getTimeStr(times) {

    //var d = new Date(times * 1000);    //根据时间戳生成的时间对象
    //var date_str = (d.getDate()) + "天 " + (d.getHours()) + "小时" + (d.getMinutes()) + "分钟" ;
    var dni = Math.floor(times / (60 * 60 * 24));
    var hours_time = times - dni * (60 * 60 * 24);
    var hours = Math.floor(hours_time / (60 * 60));
    var hours_minutes = hours_time - hours * (60 * 60);
    var minutes = Math.floor(hours_minutes / 60);
    var secons = Math.floor(hours_minutes-minutes*60) ;

    var date_str = '';
    date_str += dni>0 ? dni + "天 " : "";
    date_str += hours>0 ? hours + "小时 " : "";
    date_str += minutes>0 ? minutes + "分钟" : "";
    date_str += secons>0 ? secons + "秒 " : "";
    //var date_str = dni + "天 " + hours + "小时" + minutes + "分钟" +secons+'秒';
    return date_str;
}

Date.prototype.Format = function (fmt) {
	 var o = {
	     "M+": this.getMonth() + 1, //月份 
	     "d+": this.getDate(), //日 
	     "H+": this.getHours(), //小时 
	     "m+": this.getMinutes(), //分 
	     "s+": this.getSeconds(), //秒 
	     "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	     "S": this.getMilliseconds() //毫秒 
	 };
	 if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	 for (var k in o)
	 if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	 return fmt;
}

Array.prototype.pmIndexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};

Array.prototype.RemoveFromId = function(id) {
	for (var i = 0; i < this.length; i++) {
		if (this[i].id == id) {
			this.splice(i, 1);
			return;
		}
	}
	return -1;
};

Array.prototype.pmRemove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

function isWeiXin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

function gotoLogin(successUri) {
	if(isWeiXin()==true) {
		window.location.href = wxLoginUrl + "?successUri=" + pmUrlEncode(successUri);
	} else {
		window.location.href = webLoginUrl + "?successUri=" + pmUrlEncode(successUri);
	}
}

function pmUrlEncode(url) {
	url = url.replace('?',';');
	return url.replace('=',',');	
}

function pmUrlDecode(url) {
	url = url.replace(';','?');
	return url.replace(',','=');	
}

function checkIsInteger(str)
{
  //如果为空，则通过校验
  if(str == "")
    return true;
     if(/^(\-?)(\d+)$/.test(str))
       return true;
     else
       return false;
}

//计算时间差(天数)
function daysTimeDiff(stime, etime) {
	var dayDiff = etime - stime;
	var days = Math.floor(dayDiff / (24 * 3600 * 1000));
	return days;
}

///计算两个整数的百分比值
function getPercent(num, total) {
	num = parseFloat(num);
	total = parseFloat(total);
	if (isNaN(num) || isNaN(total)) {
		return "-";
	}
	if(num > total) {
		return "100%";
	}
	return total <= 0 ? "0%" : ( (Math.round(num / total * 100)) + "%");
} 

function initAlert() {
	var str = "<div class=\"am-modal am-modal-alert\" tabindex=\"-1\" id=\"my-alert\">";
	str += "<div class=\"am-modal-dialog\">";
	str += "    <!--<div class=\"am-modal-hd\">title</div>-->";
	str += "    <div class=\"am-modal-bd\" id=\"my-alert-msg\">";
	str += "      Hello world！";
	str += "    </div>";
	str += "    <div class=\"am-modal-footer\">";
	str += "      <span class=\"am-modal-btn\">确定</span>";
	str += "    </div>";
	str += "  </div>";
	str += "</div>";

	str += "<div class=\"am-modal am-modal-confirm\" tabindex=\"-1\" id=\"my-confirm\">";
	str += "  <div class=\"am-modal-dialog\">";
	str += "	<div class=\"am-modal-hd\">提醒</div>";
	str += "	<div class=\"am-modal-bd\" id=\"my-alert-confirm-msg\">";
	str += "		  你确定吗？";
	str += "	</div>";
	str += "	<div class=\"am-modal-footer\">";
	str += "	  <span class=\"am-modal-btn\" data-am-modal-cancel>取消</span>";
	str += "	  <span class=\"am-modal-btn\" data-am-modal-confirm>确定</span>";
	str += "	</div>";
	str += "  </div>";
	str += "</div>";

	str += "<div class=\"am-modal am-modal-no-btn\" tabindex=\"-1\" id=\"my-modal\">";
	str += "  <div class=\"am-modal-dialog\">";
	str += "	<div class=\"am-modal-hd\">提示";
	str += "	  <a href=\"javascript: void(0)\" class=\"am-close am-close-spin\" data-am-modal-close>&times;</a>";
	str += "	</div>";
	str += "	<div class=\"am-modal-bd\" id=\"my-modal-msg\">";
	str += "	  内容。";
	str += "	</div>";
	str += "  </div>";
	str += "</div>";

	$("#alert").html(str);
}

function myAlert(msg) {
	$('#my-alert-msg').text(msg);
	$('#my-alert').modal();
}

function myModal(msg) {
	$('#my-modal-msg').text(msg);
	$('#my-modal').modal();
}

function myAlertConfirm(msg, funcOnConfirm, funcOnCancel) {
	$('#my-alert-confirm-msg').text(msg);
	$('#my-confirm').modal({
		relatedTarget: this,
		onConfirm: function(options) {
			if(funcOnConfirm !=null) {
				funcOnConfirm();
			}
		},
		// closeOnConfirm: false,
		onCancel: function() {
			if(funcOnCancel != null) {
				funcOnCancel();
			}
		}
	});
}

function getRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

var Request = new Object();
Request = getRequest();

