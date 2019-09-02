const fs = require('fs')
const axios = require('axios')
let facade = require('gamecloud')
let {TableType} = facade.const;
let wechatcfg = facade.ini.servers["Index"][1].wechat; //全节点配置信息

/**
 * 微信接口
 * Create on 2018-11-27
 */
class wechat extends facade.Control {
    /**
      * 获取签名
      * @param {*} user 
      * @param {*} params
      */
     async WechatConfig(user, params) {
        let url = params.uri;
        let self = this;
        let res = await new Promise(function (resolve, reject) {
            self.core.service.wechat.getSign(url, function (data) {
                let wxconfig = {
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: wechatcfg.appid, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.noncestr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名，见附录1
                    jsApiList: wechatcfg.jsApiList,// 必填，需要使用的JS接口列表
                }
                resolve(wxconfig);
            });
        })
        return { code: 0, data: res };
    }

    async GetToken(user, params) {
        const token = await this.core.service.wechat.ensureAccessToken();
        
        //#region 获取微信二维码
        const response = await axios.post(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token.accessToken}`, {
            page: 'pages/index/index',
            scene: 'abc123'
        }, { responseType: 'stream' });
        // 将请求结果中的二进制流写入到本地文件qrcode.png
        response.data.pipe(fs.createWriteStream('qrcode.png'));
        //#endregion

        return { code: 0, data: token };
    }

    /**
     * 发送红包 - 企业为个人发送红包？ todo 待确认
     * @param {*} user 
     * @param {*} params 
     */
    async SendRecPack(user, params) {
        let openid = user.openid;

        let now = new Date();
        let date_time = now.getFullYear() + '' + (now.getMonth() + 1) + '' + now.getDate();
        let date_no = (now.getTime() + '').substr(-8); //生成8为日期数据，精确到毫秒
        let random_no = Math.floor(Math.random() * 99);
        if (random_no < 10) { //生成位数为2的随机码
            random_no = '0' + random_no;
        }

        let redPackConfig = {
            showName: '游戏金',
            clientIp: params.userip,
            wishing: '新年快乐，大吉大利',
            remark: '分享越多，快乐越多，游戏金越多',
            mch_billno: wechatcfg.mch_id + date_time + date_no + random_no //订单号为 mch_id + yyyymmdd+10位一天内不能重复的数字;
        }
        let total_amount = 100
        let total_num = 1
        let ret = await this.core.service.wechat.sendRedPacket(total_amount, total_num, openid, redPackConfig)
        let redpackItem = {
            act_name: redPackConfig.showName,
            mch_billno: redPackConfig.mch_billno,
            nick_name: redPackConfig.showName,
            re_openid: openid,
            remark: redPackConfig.remark,
            send_name: redPackConfig.showName,
            total_amount: total_amount,
            total_num: total_num,
            wishing: redPackConfig.wishing,
            return_msg: ret.return_msg,
            order_status: 0,
        }
        this.core.GetMapping(TableType.redpack).Create(redpackItem);

        return { code: 0, data: ret.return_msg };
    }

    async GetRecPackInfo(user, params) {
        let mch_billno = params.mch_billno;
        let ret = await this.core.service.wechat.getRecPackInfo(mch_billno)
        return { code: 0, data: ret }
    }
}

exports = module.exports = wechat;
