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
    let _str = '';
    let _arr = [];
    for (let key in json) {
        _arr.push(key + '=' + json[key]);
    }
    return _arr.join('&');
};

let wxConfig = {
    showName: '百谷红包',
    clientIp: '110.90.229.163',
    wishing: '新年快乐',
    remark: '分享越多，快乐越多',
    mch_id: '1520782501',
    wxappid: 'wx4b3efb80ac5de780',
    wxkey: '41134e3b985d0254c6c7c64912fc0935'
}
//生成微信红包数据
let fnGetWeixinBonus = function (option) {
    let total_amount = option.total_amount || 10, 	//红包总金额
        re_openid = option.re_openid, 				//红包发送的目标用户
        total_num = option.total_num || 1; 			//红包个数
    let now = new Date();
    let showName = wxConfig.showName;				//红包名字
    let clientIp = wxConfig.clientIp;				//客户端IP
    let wishing = wxConfig.wishing;					//红包上显示的祝福语
    let mch_id = wxConfig.mch_id;					//商户ID
    let wxappid = wxConfig.wxappid;					//微信支付APPID
    let wxkey = wxConfig.wxkey;						//公众号secret
    let remark = wxConfig.remark;
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
    contentJson.mch_billno = muc_id + date_time + date_no + random_no; //订单号为 mch_id + yyyymmdd+10位一天内不能重复的数字; //+201502041234567893';
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

async function  sendRedPacket(total_amount, re_openid) {
    return new Promise((resolve, reject) => {
        let host = 'api.mch.weixin.qq.com';
        let path = '/mmpaymkttransfers/sendredpack';
        let total_num = 1;
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
                    if (result["result_code"] === "SUCCESS") {
                        resolve({"code": result["result_code"], "mch_billno": result["mch_billno"]});
                    } else {
                        console.log(result["return_msg"]);
                        resolve({"code": result["result_code"]});
                    }
                });
            });
 
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
        });
 
        let option = {total_amount, re_openid, total_num};
        let sendData = fnGetWeixinBonus(option);
        req.write(sendData);
        req.end();
    });

}

exports = module.exports = sendRedPacket