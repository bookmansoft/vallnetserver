let facade = require('gamecloud')
let request = require('request')
let crypto = require('crypto');
const axios = require('axios')
const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser()
let fs = require('fs')
let https = require('https')

let cache = require('./memcache')
let {md5, sha1} = require('./encrtyto')
let wechatcfg = facade.ini.servers["Index"][1].wechat; //全节点配置信息

// 收到微信支付的回调通知，进行相应的处理
// 支付完成后，微信会把相关支付结果及用户信息通过数据流的形式发送给商户，商户需要接收处理，并按文档规范返回应答，注意：
// 1、同样的通知可能会多次发送给商户系统。商户系统必须能够正确处理重复的通知。
// 2、后台通知交互时，如果微信收到商户的应答不符合规范或超时，微信会判定本次通知失败，重新发送通知，直到成功为止（在通知一直不成功的情况下，微信总共会发起10次通知，通知频率为15s/15s/30s/3m/10m/20m/30m/30m/30m/60m/3h/3h/3h/6h/6h - 总计 24h4m），但微信不保证通知最终一定能成功。
// 3、在订单状态不明或者没有收到微信支付结果通知的情况下，建议商户主动调用微信支付【查询订单API】确认订单状态。
// 微信支付回调信息
// <xml>
//     <sign><![CDATA[B552ED6B279343CB493C5DD0D78AB241]]></sign>                        //签名
//     <sign_type><![CDATA[HMAC-SHA256]]></sign_type>                                   //签名类型，默认 MD5，可能值包括 HMAC-SHA256/MD5
//     <return_code><![CDATA[SUCCESS]]></return_code>                                   //返回状态码	String(16)
//     <result_code><![CDATA[SUCCESS]]></result_code>                                   //业务结果
//     <mch_id><![CDATA[10000100]]></mch_id>                                            //商户号
//     <appid><![CDATA[wx2421b1c4370ec43b]]></appid>                                    //公众账号ID
//     <openid><![CDATA[oUpF8uMEb4qRXf22hE3X68TekukE]]></openid>                        //用户标识
//     <total_fee>1</total_fee>                                                         //订单金额
//     <cash_fee>100</cash_fee>                                                         //现金支付金额
//     <transaction_id><![CDATA[1004400740201409030005092168]]></transaction_id>        //微信支付订单号
//     <out_trade_no><![CDATA[1409811653]]></out_trade_no>                              //商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一
//     <attach><![CDATA[支付测试]]></attach>                                             //商家数据包 String(128) 原样返回
//     <nonce_str><![CDATA[5d2b6c2a8db53831f7eda20af46e531c]]></nonce_str>              //随机字符串
//     <bank_type><![CDATA[CFT]]></bank_type>                                           //付款银行
//     <fee_type><![CDATA[CNY]]></fee_type>                                             //货币种类 默认 CNY
//     <cash_fee_type><![CDATA[CNY]]></cash_fee_type>                                   //现金支付货币类型
//     <is_subscribe><![CDATA[Y]]></is_subscribe>                                       //是否关注公众账号
//     <sub_mch_id><![CDATA[10000100]]></sub_mch_id>                                    //子商户号
//     <time_end><![CDATA[20140903131540]]></time_end>                                  //支付完成时间
//     <coupon_fee_0><![CDATA[10]]></coupon_fee_0>                                      //优惠券支付金额 有下标
//     <coupon_count><![CDATA[1]]></coupon_count>                                       //代金券使用数量
//     <coupon_type_0><![CDATA[CASH]]></coupon_type_0>                                  //代金券类型 有下标
//     <coupon_id_0><![CDATA[10000]]></coupon_id_0>                                     //代金券ID 有下标
//     <trade_type><![CDATA[JSAPI]]></trade_type>                                       //交易类型
// </xml>
//
// 如果验证通过，就可以对指定订单进行相应处理
// data.result_code;         //订单状态
// data.appid;               //公众号ID
// data.mch_id;              //商户ID
// data.openid;              //用户ID
// data.transaction_id;      //微信订单号
// data.out_trade_no;        //商户自定义订单号
// data.total_fee;           //订单金额，单位为分
// data.cash_fee;            //现金支付金额，单位为分
// data.attach;              //附加字段，原样返回

/**
 * 微信服务接口封装对象
 */
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
        this.mchHost = 'api.mch.weixin.qq.com';
        //查询订单接口
        this.orderquery = `https://${this.mchHost}/pay/orderquery`;
        this.unifiedorderUrl = `https://${this.mchHost}/pay/unifiedorder`;
        //微信红包相关接口
        this.sendRedPackUrl = `/mmpaymkttransfers/sendredpack`;
        this.getRedPackUrl = '/mmpaymkttransfers/gethbinfo';

        this.defaults = {};
        this.tokenFromCustom = tokenFromCustom;
    }

    /**
     * 主动向微信查询订单状态
     * @param {*} options 
     */
    async orderQuery(options) {
        // 发送内容
        // 公众账号ID	appid	        是	    String(32)	    wxd678efh567hg6787	                微信支付分配的公众账号ID（企业号corpid即为此appId）
        // 商户号	    mch_id	        是	    String(32)	    1230000109	                        微信支付分配的商户号
        // 微信订单号	transaction_id	二选一	String(32)	    1009660380201506130728806387	    微信的订单号，建议优先使用
        // 商户订单号   out_trade_no
        // 随机字符串	nonce_str	    是	    String(32)	    C380BEC2BFD727A4B6845133519F3AD6	随机字符串，不长于32位。推荐随机数生成算法
        // 签名	        sign	        是	    String(32)	    5K8264ILTKCH16CQ2502SI8ZNMTM67VS	    通过签名算法计算得出的签名值，详见签名生成算法
        // 签名类型	    sign_type	    否	    String(32)	    HMAC-SHA256	                            签名类型，目前支持HMAC-SHA256和MD5，默认为MD5
        // 生成签名
        let ori = {
            appid: wechatcfg.appid,
            mch_id: wechatcfg.mch_id,
            nonce_str: getNonceStr(),
        };

        if(options.inner) {
            ori.out_trade_no = options.inner;
        } else if(options.outer) {
            ori.transaction_id = options.outer;
        } else {
            return null;
        }

        let result = await new Promise((resolve, reject) => {
            request.post({
                uri: this.orderquery,
                body: this.toXml(ori),
            }, (err, response, data) => {
                if (err) {
                    reject(err);
                } else {
                    this.verifyXml(data).then(dt => {
                        resolve(dt);
                    });
                }
            });
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

    /**
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
     * @param {*} openId            //用户ID，目前系统统一使用 unionid
     * @param {*} ip                //来访IP地址
     * @param {*} price             //支付总额(分)
     * @param {*} productIntro      //商品描述字符串
     * @param {*} tradeId           //商户内部订单号
     * 
     * @warning 此处使用 unionid 代替 openid 的做法需要进一步验证
     */
    async unifiedOrder(openId, ip, price, productIntro, tradeId) {
        //待发送数据
        let dat = {
            appid: wechatcfg.appid,         //公众账号ID
            mch_id: wechatcfg.mch_id,       //商户号
            nonce_str: getNonceStr(),       //随机字符串
            attach: 'GJS-ORG',              //任意字符串, 会原样返回, 可以用作一个标记
            body: productIntro,             //商品描述 String(128)
            //通知地址，回调函数置于 config.wxnotify 因为它属于开放式接口，不需要经过用户认证
            notify_url: `${this.core.options.UrlHead}://${this.core.options.webserver.host}:${this.core.options.webserver.port}/wxnotify`,
            openid: openId,                 //用户ID
            out_trade_no: tradeId,          //商家内部自定义的订单号
            total_fee: price,               //订单总额 单位分
            spbill_create_ip: ip,           //终端IP
            trade_type: 'JSAPI',            //交易类型 JSAPI-JSAPI支付 NATIVE-Native支付 APP-APP支付
        };

        let result = await new Promise((resolve, reject) => {
            axios.post(this.unifiedorderUrl, this.toXml(dat)).then(wxResponse => {
                this.verifyXml(wxResponse.data).then(data=>{
                    const timeStamp = new Date().getTime().toString();

                    if(data.return_code === 'SUCCESS' && data.result_code === 'SUCCESS') {
                        resolve(this.sign({
                            appId: wechatcfg.appid,
                            timeStamp: timeStamp,
                            nonceStr: getNonceStr(),
                            package: `prepay_id=${data.prepay_id}`,
                            signType: 'MD5',
                        }));
                    } else {
                        reject(new Error(`${data.return_msg}/${data.err_code}/${data.err_code_des}`));
                    }
                });
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
        var date = new Date().getTime().toString();
        var text = "";
        var possible = "0123456789";
        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return `ty_${attach}_${date}${text}`;
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
            //uri: `https://api.weixin.qq.com/sns/jscode2session`,          //代码中曾经使用过的访问地址，有效性待调研
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
     * 使用 openid 及 access_token 参数获取用户详细信息
     * @param {*} access_token 
     * @param {*} openid 
     */
    async getMapUserInfo(access_token, openid) {
        let options = {
            //如下地址中，ACCESS_TOKEN为服务端令牌
            //uri: https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
            //如下地址中，ACCESS_TOKEN为客户端用户令牌
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
     * 发送微信红包
     * @param {*} total_amount  红包总金额
     * @param {*} total_num     红包个数
     * @param {*} re_openid     发送用户
     */
    async sendRedPacket(total_amount, total_num, re_openid, redPackConfig) {
        total_amount = total_amount || 10;
        total_num = total_num || 1;

        let now = new Date();
        let date_time = now.getFullYear() + '' + (now.getMonth() + 1) + '' + now.getDate();
        let date_no = (now.getTime() + '').substr(-8); //生成8为日期数据，精确到毫秒
        let random_no = Math.floor(Math.random() * 99);
        if (random_no < 10) { //生成位数为2的随机码
            random_no = '0' + random_no;
        }

        let result = await this.send(this.mchHost, this.sendRedPackUrl, this.toXml({
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
        let result = await this.send(this.mchHost, this.getRedPackUrl, this.toXml({
            appid: wechatcfg.appid,
            bill_type: 'MCHT',
            mch_billno: mch_billno,
            mch_id: wechatcfg.mch_id,
            nonce_str: getNonceStr(),
        }));
        return result;
    }

    /**
     * 获取微信签名
     * @param {*} url 
     * @param {*} callback 
     */
    getSign(url, callback) {
        var noncestr = wechatcfg.noncestr, timestamp = Math.floor(Date.now()/1000), jsapi_ticket;
        if(cache.has('ticket')) {
            jsapi_ticket = cache.get('ticket'); //直接从缓存中获取

            //回传参数
            callback({
                debug: true,
                noncestr:noncestr,
                timestamp:timestamp,
                url:url,
                jsapi_ticket:jsapi_ticket,
                signature:sha1(`jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`),
            });
        } else {
            request(`${wechatcfg.accessTokenUrl}?grant_type=${wechatcfg.grant_type}&appid=${wechatcfg.appid}&secret=${wechatcfg.secret}`, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var tokenMap = JSON.parse(body);
                    request(`${wechatcfg.ticketUrl}?access_token=${tokenMap.access_token}&type=jsapi`, function(err, resp, json){
                        if (!err && resp.statusCode == 200) {
                            var ticketMap = JSON.parse(json);
                            cache.set('ticket', ticketMap.ticket, wechatcfg.cache_duration);  //加入缓存

                            //回传参数
                            callback({
                                debug: true,
                                noncestr: noncestr,
                                timestamp: timestamp,
                                url: url,
                                jsapi_ticket: ticketMap.ticket,
                                signature: sha1(`jsapi_ticket=${ticketMap.ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`),
                            });
                        }
                    })
                }
            })
        }
    }

    /**
     * 校验微信返回的XML数据的签名，成功则返回解析后的对象，否则返回NULL
     * @param {*} xml 
     */
    async verifyXml(xml) {
        //如果是字符串形式，先做XML解析
        if(typeof xml == 'string') {
            xml = await new Promise(function(resolve, reject) {
                xmlParser.parseString(xml, (err, success) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(success.xml);
                    }
                })
            });
        }

        let sign = '', sign_type = 'MD5';
        let data = Object.keys(xml).reduce((sofar,cur)=>{
            if(cur == 'sign_type') {
                sign_type = xml[cur][0];
            }

            if(cur != 'sign') {
                sofar[cur] = xml[cur][0];
            } else {
                sign = xml[cur][0];
            }
            return sofar;
        }, {});

        //重新对对象进行签名
        data = this.sign(data, sign_type);
        //检验本地签名结果和网络签名是否一致
        if(data.sign != sign) {
            return null;
        }
        return data;
    }

    /**
     * 为指定对象添加签名项
     * @param {*} json      待签名的对象
     * @param {*} stype     签名算法类型，默认 MD5 否则都按照 HMAC_SHA256 处理(使用商户密钥作为 salt)
     */
    sign(json, stype='MD5') {
        //排序、拼接
        let stringA = Object.keys(json).sort().reduce((sofar, cur) => {
            if(!!json[cur]) { // 跳过空字段
                sofar += (sofar=='') ? `${cur}=${json[cur]}` : `&${cur}=${json[cur]}`;
            }
            return sofar;
        }, '');

        //附加密钥
        let stringSignTemp = stringA + "&key=" + wechatcfg.mch_key;

        //添加签名项
        switch(stype) {
            case 'MD5': {
                json.sign = crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
                break;
            }

            default: {
                json.sign = crypto.createHmac('sha256', wechatcfg.mch_key).update(stringSignTemp).digest('hex').toUpperCase();
                break;
            }
        }

        return json;
    }

    /**
     * 将数据对象封装成微信要求的上行参数字符串
     * @param {*} json 
     */
    toXml(json) {
        return `<xml>${fnCreateXml(this.sign(json))}</xml>`;
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
}

/**
 * 微信令牌对象
 */
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