let facade = require('gamecloud')
let request = require('request')
const axios = require('axios')
const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser()
let cache = require('../../util/memcache')
let {md5, sha1} = require('../../util/encrtyto')
let wechatcfg = facade.ini.servers["Index"][1].wechat; //全节点配置信息
let fs = require('fs')
let https = require('https')

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
        //查询订单接口
        this.orderquery = 'https://api.mch.weixin.qq.com/pay/orderquery';
        this.unifiedorderUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

        this.defaults = {};
        this.tokenFromCustom = tokenFromCustom;
    }

    /**
     * 以HTTPS协议发送数据
     */
    async send(host, path, sendData) {
        return new Promise((resolve, reject) => {
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
                       resolve(result);
                    });
                });
     
            }).on('error', function (e) {
                console.log("Got error: " + e.message);
                reject(e)
            });
            req.write(sendData);
            req.end();
        });
    }

    /**
     * 主动向微信查询订单状态
     * @param {*} transaction_id 
     */
    async orderQuery(transaction_id) {
        // 发送内容
        // 公众账号ID	appid	        是	    String(32)	    wxd678efh567hg6787	                微信支付分配的公众账号ID（企业号corpid即为此appId）
        // 商户号	    mch_id	        是	    String(32)	    1230000109	                        微信支付分配的商户号
        // 微信订单号	transaction_id	二选一	String(32)	    1009660380201506130728806387	    微信的订单号，建议优先使用
        // 随机字符串	nonce_str	    是	    String(32)	    C380BEC2BFD727A4B6845133519F3AD6	随机字符串，不长于32位。推荐随机数生成算法
        // 签名	    sign	        是	    String(32)	    5K8264ILTKCH16CQ2502SI8ZNMTM67VS	    通过签名算法计算得出的签名值，详见签名生成算法
        // 签名类型	sign_type	    否	    String(32)	    HMAC-SHA256	                            签名类型，目前支持HMAC-SHA256和MD5，默认为MD5
        // 生成签名
        let ori = {
            appid: wechatcfg.appid,
            mch_id: wechatcfg.mch_id,
            transaction_id: transaction_id,
            nonce_str: getNonceStr(),
        };

        let result = await new Promise((resolve, reject) => {
            axios.post(this.orderquery, this.toXml(ori)).then(wxResponse => {
                xmlParser.parseString(wxResponse.data, (err, success) => {
                    if (err) {
                        reject(err)
                    } else {
                        if (success.xml.return_code[0] === 'SUCCESS') {
                            resolve(success.xml);
                        } else {
                            reject(success.xml.return_msg[0])
                        }
                    }
                })
            }).catch(err => {
                console.log(err);
                reject(err)
            })
        });
        // 返回结果
        // 返回状态码      return_code	String(16)	SUCCESS/FAIL    此字段是通信标识，非交易标识，交易是否成功需要查看trade_state来判断
        // 返回信息        return_msg	    String(128)	OK	            当return_code为FAIL时返回信息为错误原因 ，例如签名失败/参数格式校验错误
        // 公众账号ID	    appid	是	String(32)	wxd678efh567hg6787	微信分配的公众账号ID
        // 商户号	        mch_id	是	String(32)	1230000109	微信支付分配的商户号
        // 随机字符串	    nonce_str	是	String(32)	5K8264ILTKCH16CQ2502SI8ZNMTM67VS	随机字符串，不长于32位。推荐随机数生成算法
        // 签名	        sign	是	String(32)	C380BEC2BFD727A4B6845133519F3AD6	签名，详见签名生成算法
        // 业务结果	    result_code	是	String(16)	SUCCESS	SUCCESS/FAIL
        // 错误代码	    err_code	否	String(32)	 	当result_code为FAIL时返回错误代码，详细参见下文错误列表
        // 错误代码描述	err_code_des	否	String(128)	 	当result_code为FAIL时返回错误描述，详细参见下文错误列表
        // 交易状态	    trade_state	是	String(32)	SUCCESS	
        //                     SUCCESS—支付成功
        //                     REFUND—转入退款
        //                     NOTPAY—未支付
        //                     CLOSED—已关闭
        //                     REVOKED—已撤销（付款码支付）
        //                     USERPAYING--用户支付中（付款码支付）
        //                     PAYERROR--支付失败(其他原因，如银行返回失败)
        // 微信支付订单号	    transaction_id	是	String(32)	1009660380201506130728806387	微信支付订单号
        // 附加数据	    attach	否	String(128)	深圳分店	附加数据，原样返回

        return result;
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

    /**
     * 向微信申请生成预处理订单
     * @param {*} appId 
     * @param {*} openId 
     * @param {*} ip 
     * @param {*} price 
     * @param {*} productIntro 
     * @param {*} tradeId 
     * @param {*} notifyUrl 
     */
    async unifiedOrder(appId, openId, ip, price, productIntro, tradeId, notifyUrl) {
        //待发送数据
        let dat = {
            appId: appId,
            attach: 'GJS-ORG',                                      // 任意字符串, 会原样返回, 可以用作一个标记
            body: productIntro,
            mch_id: wechatcfg.mch_id,
            nonce_str: getNonceStr(),
            notify_url: notifyUrl,
            openid: openId,
            out_trade_no: tradeId,                                  //商家内部自定义的订单号
            spbill_create_ip: ip,
            total_fee: price,
            trade_type: 'JSAPI',
        };

        // 这里是在 express 获取用户的 ip, 因为使用了 nginx 的反向代理, 所以这样获取
        //let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        //ip = ip.match(/\d+\.\d+\.\d+\.\d+/)[0]

        let result = await new Promise((resolve, reject) => {
            axios.post(this.unifiedorderUrl, this.toXml(dat)).then(wxResponse => {
                // 微信返回的数据也是 xml, 使用 xmlParser 将它转换成 js 的对象
                    xmlParser.parseString(wxResponse.data, (err, success) => {
                        if (err) {
                            reject(err)
                        } else {
                            if (success.xml.return_code[0] === 'SUCCESS') {
                                const prepayId = success.xml.prepay_id[0]

                                const nonceStr = getNonceStr();
                                const timeStamp = new Date().getTime().toString();
                                const package = 'prepay_id=' + prepayId;

                                // 前端需要的所有数据, 都从这里返回过去
                                resolve(this.sign({
                                    appId: appId,
                                    timeStamp: timeStamp,
                                    nonceStr: nonceStr,
                                    package: package,
                                    signType: 'MD5',
                                    paySign: paySign,
                                }));
                            } else {
                                if (err) {
                                    console.log(err);
                                    reject(err)
                                } else if (success.xml.return_code[0] !== 'SUCCESS') {
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
    
    /**
     * 生成内部订单号
     * @param {*} attach 
     */
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
        total_amount = total_amount || 10;
        total_num = total_num || 1;

        let host = 'api.mch.weixin.qq.com';
        let path = '/mmpaymkttransfers/sendredpack';
        let now = new Date();
        let date_time = now.getFullYear() + '' + (now.getMonth() + 1) + '' + now.getDate();
        let date_no = (now.getTime() + '').substr(-8); //生成8为日期数据，精确到毫秒
        let random_no = Math.floor(Math.random() * 99);
        if (random_no < 10) { //生成位数为2的随机码
            random_no = '0' + random_no;
        }

        let result = await this.send(host, path, this.toXml({
            act_name: redPackConfig.showName,      //红包名字
            nick_name: redPackConfig.showName,
            send_name: redPackConfig.showName,
            client_ip: redPackConfig.clientIp,     //客户端IP
            mch_billno: redPackConfig.mch_billno,  // muc_id + date_time + date_no + random_no; //订单号为 mch_id + yyyymmdd+10位一天内不能重复的数字; //+201502041234567893';
            mch_id: wechatcfg.mch_id,
            nonce_str: Math.random().toString(36).substr(2, 15),
            re_openid: re_openid,
            remark: redPackConfig.remark,          //备注                     
            total_amount: total_amount,
            total_num: total_num,
            wishing: redPackConfig.wishing,        //红包上显示的祝福语
            wxappid: wechatcfg.appid,
        }));

        return {return_msg: result["return_msg"]};
    }

    /**
    * 
    * @param {*} mch_billno  商户订单号
    */
    async getRecPackInfo(mch_billno) {
        let host = 'api.mch.weixin.qq.com';
        let path = '/mmpaymkttransfers/gethbinfo';

        let result = await this.send(host, path, this.toXml({
            appid: wechatcfg.appid,
            bill_type: 'MCHT',
            mch_billno: mch_billno,
            mch_id: wechatcfg.mch_id,
            nonce_str: getNonceStr(),
        }));
        return result;
    }

    getSign(url, callback) {
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

    /**
     * 为指定对象添加签名项
     * @param {*} json 
     */
    sign(json) {
        //排序、拼接
        let stringA = Object.keys(json).sort().reduce((sofar, cur) => {
            sofar += (sofar=='') ? `${cur}=${json[cur]}` : `&${cur}=${json[cur]}`;
            return sofar;
        }, '');

        //附加密钥
        let stringSignTemp = stringA + "&key=" + wechatcfg.mch_key;

        //添加MD5签名项
        json.sign = md5(stringSignTemp).toUpperCase();

        return json;
    }

    /**
     * 将数据对象封装成微信要求的上行参数字符串
     * @param {*} json 
     */
    toXml(json) {
        return `<xml>${fnCreateXml(this.sign(json))}</xml>`;
    }
}

/**
 * 生成随机字符串
 */
function getNonceStr() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < 16; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

/**
 * 构建传入对象相应的XML
 * @param {*} json 
 */
function fnCreateXml(json) {
    let _xml = '';
    for (let key in json) {
        _xml += '<' + key + '>' + json[key] + '</' + key + '>';
    }
    return _xml;
};

module.exports = weChat;