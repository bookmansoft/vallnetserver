var request = require("request");

class weChat {
    /**
     * 构造函数
     * @param {*}  监控对象ID
     */
    constructor($id) {

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

    /**
     * 获取公众号openid
     * @param {*} code 
     * @param {*} callback 
     */
    async getMapOpenIdByCode(code, appId, AppSecret) {
        let options = {
            uri: `https://api.weixin.qq.com/sns/oauth2/access_token`,
            json: true,
            qs: {
                grant_type: `authorization_code`,
                appid: appId,
                secret: AppSecret,
                code: code
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

    /**
     * 使用 openid 及 access_token 参数获取用户详细信息。
     * @param {*} access_token 
     * @param {*} openid 
     */
    async getMapUserInfo(access_token, openid) {
        let options = {
            uri: `https://api.weixin.qq.com/sns/userinfo`,
            json: true,
            qs: {
                access_token: access_token,
                openid: openid
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