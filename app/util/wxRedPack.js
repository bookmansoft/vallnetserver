let wechatcfg = require('./wechat.cfg')

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
/*
let redPackConfig = {
    showName: '百谷红包',
    clientIp: '110.90.229.163',
    wishing: '新年快乐',
    remark: '分享越多，快乐越多',
}
*/
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
    let xmlTemplate = '<xml>{content}</xml>';
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
    let crypto = require('crypto');
    contentJson.sign = crypto.createHash('md5').update(contentStr, 'utf8').digest('hex').toUpperCase();
    delete contentJson.key;
    let xmlData = fnCreateXml(contentJson);
    let sendData = '<xml>' + xmlData + '</xml>'; //_xmlTemplate.replace(/{content}/)
    return sendData;
};

//生成微信红包数据
let fnGetHBInfo = function (mch_billno) {

    let mch_id = wechatcfg.mch_id;					//商户ID
    let wxappid = wechatcfg.appid;					//微信公众号APPID
    let wxkey = wechatcfg.mch_key;					//商户号key
    
    let muc_id = mch_id;
    let xmlTemplate = '<xml>{content}</xml>';
    let contentJson = {};

    contentJson.appid = wxappid;
    contentJson.bill_type = 'MCHT';
    contentJson.mch_billno = mch_billno;
    contentJson.mch_id = muc_id;
    contentJson.nonce_str = Math.random().toString(36).substr(2, 15);
    contentJson.key = wxkey;
    let contentStr = fnCreateUrlParam(contentJson);
    let crypto = require('crypto');
    contentJson.sign = crypto.createHash('md5').update(contentStr, 'utf8').digest('hex').toUpperCase();
    delete contentJson.key;
    let xmlData = fnCreateXml(contentJson);
    let sendData = '<xml>' + xmlData + '</xml>'; //_xmlTemplate.replace(/{content}/)
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
            key: fs.readFileSync('./cert/apiclient_key.pem'),     //将微信生成的证书放入 cert目录
            cert: fs.readFileSync('./cert/apiclient_cert.pem')
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

/**
 * 
 * @param {*} total_amount  红包总金额
 * @param {*} total_num     红包个数
 * @param {*} re_openid     发送用户
 */
async function  sendRedPacket(total_amount, total_num, re_openid, redPackConfig) {
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
async function  getHBinfo(mch_billno) {
    let host = 'api.mch.weixin.qq.com';
    let path = '/mmpaymkttransfers/gethbinfo';
    let sendData = fnGetHBInfo(mch_billno);
    let result = await redpackApi(host, path, sendData);
    return result
}

exports = module.exports = {
    sendRedPacket, getHBinfo 
}