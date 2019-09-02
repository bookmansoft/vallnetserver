var https = require('https'); //引入https模块
var url = require('url'); //引入url模块
var querystring = require('querystring'); // 引入querystring模块
let facade = require('gamecloud')
let CoreOfBase = facade.CoreOfBase

class sms extends facade.Service
{
     /**
     * 构造函数
     * @param {CoreOfBase} core
     */
    constructor(core) {
        super(core);
    }

    /**
     * 发送短信
     * @param {*} receiver 短信接收人号码, 必填,全局号码格式(包含国家码),示例:+8615123456789, 多个号码之间用英文逗号分隔 '+8615123456789,+8615234567890'
     */
    send(params) {
        let {addr, template, tp} = params;
        var urlobj = url.parse(this.core.options.sms.realUrl); //解析realUrl字符串并返回一个 URL对象

        var options = {
            host: urlobj.hostname, //主机名
            port: urlobj.port, //端口
            path: urlobj.pathname, //URI
            method: 'POST', //请求方法为POST
            headers: { //请求Headers
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'WSSE realm="SDP",profile="UsernameToken",type="Appkey"',
                'X-WSSE': this.buildWsseHeader(this.core.options.sms.appKey, this.core.options.sms.appSecret)
            },
            rejectUnauthorized: false //为防止因HTTPS证书认证失败造成API调用失败,需要先忽略证书信任问题
        };
        // 请求Body,不携带签名名称时, signature 请填null
        var body = this.buildRequestBody(
            this.core.options.sms.templates[template].sender, 
            addr, 
            this.core.options.sms.templates[template].templateId, 
            tp, 
            this.core.options.sms.statusCallBack, 
            this.core.options.sms.templates[template].signature
        );
        
        var req = https.request(options, (res) => {
            console.log('statusCode:', res.statusCode); //打印响应码
        
            res.setEncoding('utf8'); //设置响应数据编码格式
            res.on('data', (d) => {
                console.log('resp:', d); //打印响应数据
            });
        });
        req.on('error', (e) => {
            console.error(e.message); //请求错误时,打印错误信息
        });
        req.write(body); //发送请求Body数据
        req.end(); //结束请求
    }

    /**
     * 构造X-WSSE参数值
     * 
     * @param appKey
     * @param appSecret
     * @returns
     */
    buildWsseHeader(appKey, appSecret){
        var crypto = require('crypto');
        var util = require('util');

        var time = new Date(Date.now()).toISOString().replace(/.[0-9]+\Z/, 'Z'); //Created
        var nonce = crypto.randomBytes(64).toString('hex'); //Nonce
        var passwordDigestBase64Str = crypto.createHash('sha256').update(nonce + time + appSecret).digest('base64'); //PasswordDigest

        return util.format('UsernameToken Username="%s",PasswordDigest="%s",Nonce="%s",Created="%s"', appKey, passwordDigestBase64Str, nonce, time);
    }

    /**
     * 构造请求Body体
     * 
     * @param sender
     * @param receiver
     * @param templateId
     * @param templateParas
     * @param statusCallBack
     * @param signature | 签名名称,使用国内短信通用模板时填写
     * @returns
     */
    buildRequestBody(sender, receiver, templateId, templateParas, statusCallBack, signature){
        if (null !== signature && signature.length > 0) {
            return querystring.stringify({
                'from': sender,
                'to': receiver,
                'templateId': templateId,
                'templateParas': templateParas,
                'statusCallback': statusCallBack,
                'signature': signature
            });
        }

        return querystring.stringify({
            'from': sender,
            'to': receiver,
            'templateId': templateId,
            'templateParas': templateParas,
            'statusCallback': statusCallBack
        });
    }
}

module.exports = sms;
