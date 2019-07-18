let facade = require('gamecloud')
let request = require('request')
const axios = require('axios')
const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser()

let cache = require('../util/memcache')
let {md5, sha1} = require('../util/encrtyto')

let wechatcfg = facade.ini.servers["Index"][1].wechat; //全节点配置信息

//构建xml
let fnCreateXml = function (json) {
    let _xml = '';
    for (let key in json) {
        _xml += '<' + key + '>' + json[key] + '</' + key + '>';
    }
    return _xml;
};
 
//生成url串用于微信md5校验
let fnCreateUrlParam = function (json) {
    let _arr = [];
    for (let key in json) {
        _arr.push(key + '=' + json[key]);
    }
    return _arr.join('&');
};

//生成微信红包数据
let fnGetWeixinBonus = function (option, redPackConfig) {
    let total_amount = option.total_amount || 10, 	//红包总金额
        re_openid = option.re_openid, 				//红包发送的目标用户
        total_num = option.total_num || 1; 			//红包个数
    let now = new Date();

    let showName = redPackConfig.showName;			//红包名字
    let clientIp = redPackConfig.clientIp;			//客户端IP
    let wishing = redPackConfig.wishing;			//红包上显示的祝福语
    let remark = redPackConfig.remark;              //备注

    let mch_id = wechatcfg.mch_id;					//商户ID
    let wxappid = wechatcfg.appid;					//微信公众号APPID
    let wxkey = wechatcfg.mch_key;					//商户号key
    
    let date_time = now.getFullYear() + '' + (now.getMonth() + 1) + '' + now.getDate();
    let date_no = (now.getTime() + '').substr(-8); //生成8为日期数据，精确到毫秒
    let random_no = Math.floor(Math.random() * 99);
    if (random_no < 10) { //生成位数为2的随机码
        random_no = '0' + random_no;
    }

    let muc_id = mch_id;
    let contentJson = {};
    contentJson.act_name = showName;
    contentJson.client_ip = clientIp;
    contentJson.mch_billno = redPackConfig.mch_billno; // muc_id + date_time + date_no + random_no; //订单号为 mch_id + yyyymmdd+10位一天内不能重复的数字; //+201502041234567893';
    contentJson.mch_id = muc_id;
 
    contentJson.nick_name = showName;
    contentJson.nonce_str = Math.random().toString(36).substr(2, 15);
    contentJson.re_openid = re_openid;
    contentJson.remark = remark;
    contentJson.send_name = showName;
    contentJson.total_amount = total_amount;
    contentJson.total_num = total_num;
    contentJson.wishing = wishing;
    contentJson.wxappid = wxappid;
    contentJson.key = wxkey;
    let contentStr = fnCreateUrlParam(contentJson);
    contentJson.sign = md5(contentStr).toUpperCase();
    delete contentJson.key;
    let sendData = `<xml>${fnCreateXml(contentJson)}</xml>`;
    return sendData;
};

//生成微信红包数据
let fnGetHBInfo = function (mch_billno) {
    let mch_id = wechatcfg.mch_id;					//商户ID
    let wxappid = wechatcfg.appid;					//微信公众号APPID
    let wxkey = wechatcfg.mch_key;					//商户号key
    
    let muc_id = mch_id;
    let contentJson = {};

    contentJson.appid = wxappid;
    contentJson.bill_type = 'MCHT';
    contentJson.mch_billno = mch_billno;
    contentJson.mch_id = muc_id;
    contentJson.nonce_str = Math.random().toString(36).substr(2, 15);
    contentJson.key = wxkey;
    let contentStr = fnCreateUrlParam(contentJson);
    contentJson.sign = md5(contentStr).toUpperCase();
    delete contentJson.key;
    let sendData = `<xml>${fnCreateXml(contentJson)}</xml>`;
    return sendData;
};

/**
 * 
 * @param {*} total_amount  红包总金额
 * @param {*} total_num     红包个数
 * @param {*} re_openid     发送用户
 */
async function  redpackApi(host, path, sendData) {
    let ret = new Promise((resolve, reject) => {
        //let host = 'api.mch.weixin.qq.com';
        //let path = '/mmpaymkttransfers/sendredpack';
        //let total_num = 1;
        let fs = require('fs')
        let https = require('https')
        let xml2js = require('xml2js')

        let opt = {
            host: host,
            port: '443',
            method: 'POST',
            path: path,
            key: fs.readFileSync(process.cwd() + '/config/certwx/apiclient_key.pem', 'utf8'),     //将微信生成的证书放入 cert目录
            cert: fs.readFileSync(process.cwd() + '/config/certwx/apiclient_cert.pem', 'utf8')
        };

        let body = '';
        opt.agent = new https.Agent(opt);
 
        var req = https.request(opt, function (res) {
            res.on('data', function (d) {
                body += d;
            }).on('end', function () {
                let parser = new xml2js.Parser({trim: true, explicitArray: false, explicitRoot: false});//解析签名结果xml转json
                parser.parseString(body, function (err, result) {
                    /*
                    if (result["result_code"] === "SUCCESS") {
                        resolve({"code": result["result_code"], "mch_billno": result["mch_billno"]});
                    } else {
                        console.log(result["return_msg"]);
                        resolve({"code": result["result_code"]});
                    }
                    */
                   //resolve({return_msg: result["return_msg"]})
                   console.log(result)
                   resolve(result)
                });
            });
 
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            reject(e)
        });
        req.write(sendData);
        req.end();
    });

    return ret
}

function wxSendData(appId, attach, productIntro, mchId, nonceStr, notifyUrl, openId, tradeId, ip, price, sign) {
    const sendData = '<xml>' +
        '<appid>' + appId + '</appid>' +
        '<attach>' + attach + '</attach>' +
        '<body>' + productIntro + '</body>' +
        '<mch_id>' + mchId + '</mch_id>' +
        '<nonce_str>' + nonceStr + '</nonce_str>' +
        '<notify_url>' + notifyUrl + '</notify_url>' +
        '<openid>' + openId + '</openid>' +
        '<out_trade_no>' + tradeId + '</out_trade_no>' +
        '<spbill_create_ip>' + ip + '</spbill_create_ip>' +
        '<total_fee>' + price + '</total_fee>' +
        '<trade_type>JSAPI</trade_type>' +
        '<sign>' + sign + '</sign>' +
        '</xml>'
    return sendData
}

function getPaySign(appId, timeStamp, nonceStr, package) {
    var stringA = 'appId=' + appId +
        '&nonceStr=' + nonceStr +
        '&package=' + package +
        '&signType=MD5' +
        '&timeStamp=' + timeStamp

    var stringSignTemp = stringA + '&key=' + wechatcfg.mch_key
    var sign = md5(stringSignTemp).toUpperCase()
    return sign
}

function getNonceStr() {
    var text = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < 16; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function getPayParams(appId, prepayId, tradeId) {
    const nonceStr = getNonceStr()
    const timeStamp = new Date().getTime().toString()
    const package = 'prepay_id=' + prepayId
    const paySign = getPaySign(appId, timeStamp, nonceStr, package)
    // 前端需要的所有数据, 都从这里返回过去
    const payParamsObj = {
        appId: appId,
        nonceStr: nonceStr,
        timeStamp: timeStamp,
        package: package,
        paySign: paySign,
        signType: 'MD5',
        tradeId: tradeId,
    }
    return payParamsObj
}

function getPrePaySign(appId, attach, productIntro, mchId, nonceStr, notifyUrl, openId, tradeId, ip, price) {
    var stringA = 'appid=' + appId +
        '&attach=' + attach +
        '&body=' + productIntro +
        '&mch_id=' + mchId +
        '&nonce_str=' + nonceStr +
        '&notify_url=' + notifyUrl +
        '&openid=' + openId +
        '&out_trade_no=' + tradeId +
        '&spbill_create_ip=' + ip +
        '&total_fee=' + price +
        '&trade_type=JSAPI'
    var stringSignTemp = stringA + '&key=' + wechatcfg.mch_key
    var sign = md5(stringSignTemp).toUpperCase()
    return sign
}

function getSign(url, callback) {
    var noncestr = wechatcfg.noncestr, timestamp = Math.floor(Date.now()/1000), jsapi_ticket;
    if(cache.has('ticket')){
        jsapi_ticket = cache.get('ticket');
        console.log('1' + 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url);
        callback({
            noncestr:noncestr,
            timestamp:timestamp,
            url:url,
            jsapi_ticket:jsapi_ticket,
            signature:sha1('jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
        });
    } else {
        request(wechatcfg.accessTokenUrl + '?grant_type=' + wechatcfg.grant_type + '&appid=' + wechatcfg.appid + '&secret=' + wechatcfg.secret ,function(error, response, body){
            if (!error && response.statusCode == 200) {
                console.log("tokenMap " + body);
                var tokenMap = JSON.parse(body);
                request(wechatcfg.ticketUrl + '?access_token=' + tokenMap.access_token + '&type=jsapi', function(error, resp, json){
                    if (!error && response.statusCode == 200) {
                        var ticketMap = JSON.parse(json);
                        console.log("ticketMap " + json);
                        cache.set('ticket', ticketMap.ticket, wechatcfg.cache_duration);  //加入缓存
                        console.log('jsapi_ticket=' + ticketMap.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url);
                        callback({
                            debug: true,
                            noncestr: noncestr,
                            timestamp: timestamp,
                            url: url,
                            jsapi_ticket: ticketMap.ticket,
                            signature: sha1('jsapi_ticket=' + ticketMap.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
                        });
                    }
                })
            }
        })
    }
}


class AccessToken {
    constructor(accessToken, expireTime) {
      this.accessToken = accessToken;
      this.expireTime = expireTime;
    }
  
    /*!
     * 检查AccessToken是否有效，检查规则为当前时间和过期时间进行对比
     */
    isValid() {
      return !!this.accessToken && Date.now() < this.expireTime;
    }
}
  
class weChat extends facade.Service
{
    /**
     * 根据 appid 和 appsecret 创建API的构造函数
     * 如需跨进程跨机器进行操作Wechat API（依赖access token），access token需要进行全局维护
     * 使用策略如下：
     * 1. 调用用户传入的获取 token 的异步方法，获得 token 之后使用
     * 2. 使用appid/appsecret获取 token 。并调用用户传入的保存 token 方法保存
     * Tips:
     * - 如果跨机器运行wechat模块，需要注意同步机器之间的系统时间。
     * Examples:
     * ```
     * var API = require('wechat-api');
     * var api = new API('appid', 'secret');
     * ```
     * 以上即可满足单进程使用。
     * 当多进程时，token 需要全局维护，以下为保存 token 的接口。
     * ```
     * var api = new API('appid', 'secret', async function () {
     *   // 传入一个获取全局 token 的方法
     *   var txt = await fs.readFile('access_token.txt', 'utf8');
     *   return JSON.parse(txt);
     * }, async function (token) {
     *   // 请将 token 存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
     *   // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
     *   await fs.writeFile('access_token.txt', JSON.stringify(token));
     * });
     * ```
     * @param {AsyncFunction} getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
     * @param {AsyncFunction} saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
     */
    constructor(parent, getToken, saveToken, tokenFromCustom) {
        super(parent);

        this.appid = wechatcfg.miniBgwAppId;
        this.appsecret = wechatcfg.miniBgwAppSecret;
        this.getToken = getToken || async function () {
            return this.store;
        };
        this.saveToken = saveToken || async function (token) {
            this.store = token;
            if (process.env.NODE_ENV === 'production') {
                console.warn('Don\'t save token in memory, when cluster or multi-computer!');
            }
        };
        this.mpPrefix = 'https://mp.weixin.qq.com/cgi-bin/';
        this.fileServerPrefix = 'http://file.api.weixin.qq.com/cgi-bin/';
        this.payPrefix = 'https://api.weixin.qq.com/pay/';
        this.merchantPrefix = 'https://api.weixin.qq.com/merchant/';
        this.customservicePrefix = 'https://api.weixin.qq.com/customservice/';
        this.wxaPrefix = 'https://api.weixin.qq.com/wxa/';
        this.defaults = {};
        this.tokenFromCustom = tokenFromCustom;
    }

    /*!
    * 根据创建API时传入的appid和appsecret获取access token
    * 进行后续所有API调用时，需要先获取access token
    * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=获取access_token> * 应用开发者无需直接调用本API。 
    * 
    * Examples:
    * ```
    * var token = await api.getAccessToken();
    * ```
    * - `err`, 获取access token出现异常时的异常对象
    * - `result`, 成功时得到的响应结果 * Result:
    * ```
    * {"access_token": "ACCESS_TOKEN","expires_in": 7200}
    * ```
    */
    async getAccessToken() {
        let data = await new Promise(function(resolve, reject){
            axios.get(`${wechatcfg.accessTokenUrl}?grant_type=client_credential&appid=${this.appid}&secret=${this.appsecret}`).then(res => {
                // 微信返回的数据也是 xml, 使用 xmlParser 将它转换成 js 的对象
                resolve(res.data);
            }).catch(err => {
                reject(err)
            })
        });

        if(!!data.errcode) {
            await (async function(time){return new Promise(resolve =>{setTimeout(resolve, time);});})(3000);
            return this.getAccessToken();
        } else {
            // 过期时间，因网络延迟等，将实际过期时间提前10秒，以防止临界点
            var expireTime = Date.now() + (data.expires_in - 10) * 1000;
            var token = new AccessToken(data.access_token, expireTime);
            await this.saveToken(token);
            return token;
        }
    }

    /**
     * 调用用户传入的获取token的异步方法，获得token之后使用（并缓存它）。
     */
    async ensureAccessToken() {
        var token = await this.getToken();
        if (token) {
            let accessToken = new AccessToken(token.accessToken, token.expireTime)
            if(accessToken.isValid()) {
                return accessToken;
            }
        } else if (this.tokenFromCustom) {
            let err = new Error('accessToken Error');
            err.name = 'WeChatAPIError';
            err.code = 40001;
            throw err;
        }
        return this.getAccessToken();
    }

    async unifiedOrder(appId, openId, ip, price, productIntro, tradeId) {

        // attach 是一个任意的字符串, 会原样返回, 可以用作一个标记
        const attach = 'GJS-ORG'
        // 一个随机字符串
        const nonceStr = getNonceStr()
        // 用户的 openId
        //const openId = 'user openId'
        // 生成商家内部自定义的订单号, 商家内部的系统用的, 不用 attach 加入也是可以的
        //const tradeId = getTradeId(attach)
        // 生成签名
        const sign = getPrePaySign(appId, attach, productIntro, wechatcfg.mch_id, nonceStr, wechatcfg.notifyUrl, openId, tradeId, ip, price)
        // 这里是在 express 获取用户的 ip, 因为使用了 nginx 的反向代理, 所以这样获取
        //let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        //ip = ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
        //将微信需要的数据拼成 xml 发送出去
        const sendData = wxSendData(appId, attach, productIntro, wechatcfg.mch_id, nonceStr, wechatcfg.notifyUrl, openId, tradeId, ip, price, sign)
    
        // 使用 axios 发送数据带微信支付服务器, 没错, 后端也可以使用 axios
        let result = await new Promise(function(resolve, reject){
            axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', sendData).then(wxResponse => {
                // 微信返回的数据也是 xml, 使用 xmlParser 将它转换成 js 的对象
                    xmlParser.parseString(wxResponse.data, (err, success) => {
                        if (err) {
                            reject(err)
                        } else {
                            console.log(success);
                            if (success.xml.return_code[0] === 'SUCCESS') {
                                const prepayId = success.xml.prepay_id[0]
                                const payParamsObj = getPayParams(appId, prepayId, tradeId)
                                // 返回给前端, 这里是 express 的写法
                                //res.json(payParamsObj)
                                console.log('payParamsObj', payParamsObj);
                                resolve(payParamsObj);
                            } else {
                                if (err) {
                                    console.log(err);
                                    reject(err)
                                    //res.sendStatus(502)
                                } else if (success.xml.return_code[0] !== 'SUCCESS') {
                                    //res.sendStatus(403)
                                    reject(success.xml.return_msg[0])
                                }
                            }
                        }
                    })
            }).catch(err => {
                console.log(err);
                reject(err)
            })
        });

        return result;
    }
    
    getTradeId(attach) {
        var date = new Date().getTime().toString()
        var text = ""
        var possible = "0123456789"
        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        }
        var tradeId = 'ty_' + attach + '_' + date + text
        return tradeId
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
     * 通过code换取网页授权 access_token
     * { access_token: '22_SP-1b2RjMK-AOjc8vMYoXBq0My52iYr6g-1Oc9y9uFkfI6AEQ_eiJSh5Oo-HKX_XJ7hgr7P4CVBxXSPVhWWrQg' }
     * @param {*} code 
     * @param {*} callback 
     */
    async getOpenidByCode(code, appId, AppSecret) {
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
        //如下地址中，ACCESS_TOKEN为服务端令牌
        //https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
        //如下地址中，ACCESS_TOKEN为客户端用户令牌
        //https://api.weixin.qq.com/sns/userinfo

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

    /**
     * 
     * @param {*} total_amount  红包总金额
     * @param {*} total_num     红包个数
     * @param {*} re_openid     发送用户
     */
    async sendRedPacket(total_amount, total_num, re_openid, redPackConfig) {
        let host = 'api.mch.weixin.qq.com';
        let path = '/mmpaymkttransfers/sendredpack';
        let option = {total_amount, re_openid, total_num};
        let sendData = fnGetWeixinBonus(option, redPackConfig);
        let result = await redpackApi(host, path, sendData);
        return {return_msg: result["return_msg"]}
    }

    /**
    * 
    * @param {*} mch_billno  商户订单号
    */
    async getHBinfo(mch_billno) {
        let host = 'api.mch.weixin.qq.com';
        let path = '/mmpaymkttransfers/gethbinfo';
        let sendData = fnGetHBInfo(mch_billno);
        let result = await redpackApi(host, path, sendData);
        return result
    }
}

module.exports = weChat;