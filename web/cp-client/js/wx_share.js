function WxConfig(data) {
	wx.config({
		  debug: false,
		  appId: data.appId,
		  timestamp: data.timestamp,
		  nonceStr: data.nonceStr,
		  signature: data.signature,
		  //jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage']
		  jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
		});			
	//WxReady();
}

function WxReady(share) {
    wx.ready(function() {
		 //alert("微信验证OK");	 
		 //分享到朋友圈
		 wx.onMenuShareTimeline({
		   title: share.title,
		   desc: share.desc,
		   link: share.link,
		   imgUrl: share.icon
		 });
		  	  
		 window.wx.onMenuShareAppMessage({
		     title: share.title,
		     desc: share.desc,
		     link: share.link,
		     imgUrl: share.icon
		 });
		 
 	});	
}
window.wx.error(function(res){  
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。  
    console.log("微信验证失败");  
}); 