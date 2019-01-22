var request = require("request");

class weChat {
    /**
     * 构造函数
     * @param {*}  监控对象ID
     */
    constructor($id){
        this.app_id = "wx4b3efb80ac5de780";
        this.app_secret = "36ad9a51a413cb4dbe1562206c6c0ba4";
    }

    /**
     * 获取openid
     * @param {*} code 
     * @param {*} callback 
     */
    async getOpenIdByCode(code, appId, AppSecret) {
        let options = {
            uri: `https://api.weixin.qq.com/sns/jscode2session`,
            //uri: `https://api.weixin.qq.com/sns/oauth2/access_token`,
            json: true,
            qs: {
                grant_type: `authorization_code`,
                appid: appId,
                secret: AppSecret,
                js_code: code
            }
        };
        var res = await new Promise(function (resolve, reject) {
            request.get(options, (err, response, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        return res;
    }
}

module.exports = weChat;