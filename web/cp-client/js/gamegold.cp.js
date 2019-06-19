GameGoldCP = {

    gameStart: function(callback) {
        if(!callback) {
            return;
        }
        var request = this.getRequest();
        let act = request["act"];
        let openid = request["openid"];
        if(callback) {
            if(act == 'token') {
                let tokenObj = JSON.parse(decodeURIComponent(request["token"], true));
                let userInfoObj = JSON.parse(decodeURIComponent(request["userInfo"], true));
                callback({
                    act:act,
                    openid: openid,
                    data: {token: tokenObj, userInfo: userInfoObj}
                }) 
            } else if(act == 'order') {
                let orderSn = request["orderSn"];
                let payResult = parseInt(request["payResult"]);
                callback({
                    act:act,
                    openid: openid,
                    data: {orderSn: orderSn, payResult: payResult}
                }) 
            } else {
                callback({act:"unknow", data:null});
            }
        }  
    },

    orderPay: function(data, callback) {
        if(!callback) {
            return;
        }
        if(this.isWeixin==false) {
            callback(0, "不在微信小程序中运行，无法完成支付")
        } else {
            var jumpUrl = window.location.href;
            jumpUrl = jumpUrl.substring(0, jumpUrl.indexOf('?'));
            jumpUrl = encodeURIComponent(jumpUrl)
            let cid = data.cid;
            let prop_name = data.prop_name;
            let sn = data.sn;
            let price = data.price;
            let openid = data.openid;
            let path = '/pages/pay/index?cid='+cid+'&sn='+sn+'&price='+price+'&openid='+openid+'&prop_name='+prop_name+'&jumpUrl='+jumpUrl;
            console.log(path);
            window.wx.miniProgram.navigateTo({
                url: path
            });
            callback(1, "success");
        }

    },

    getRequest: function() {
        var url = window.location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    
    isWeixin: function() {
        return window.__wxjs_environment === 'miniprogram';
    }
};

window.ggcp = GameGoldCP;