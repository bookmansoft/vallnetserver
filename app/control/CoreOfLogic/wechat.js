let facade = require('gamecloud')
let weChat = require('../../util/wechat')
let randomHelp = require('../../util/randomHelp')
let md5 = require('md5')
let tableType = require('../../util/tabletype')
let remoteSetup = require('../../util/gamegold')
let signature = require('../../util/signature.js')
let wechatcfg = require('../../util/wechat.cfg')
let wxUnifiedorder = require('../../util/wx_unifiedorder')
let wxSendRecPack = require('../../util/wxRedPack')
let WXBizDataCrypt = require('../../util/WXBizDataCrypt')

const WechatAPI = require('co-wechat-api')
const fs = require('fs')
const axios = require('axios')

//引入工具包
const toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
const remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch'))  
remote.setup(remoteSetup);

/**
 * 微信接口
 * Create by gamegold Fuzhou on 2018-11-27
 */
class wechat extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        console.log('wechat middleware');
        return ['parseParams', 'commonHandle'];
    }

    async GetMapOpenId(user, params) {
        let code = params.code
        var weChatEntity = new weChat();
        console.log(code, wechatcfg.appid, wechatcfg.secret)
        let ret = await weChatEntity.getMapOpenIdByCode(code, wechatcfg.appid, wechatcfg.secret);
        console.log(ret);
        if(ret.errcode !== undefined ) {
            return {errcode: 'fail', errmsg: ret.errmsg};
        } else {
            console.log(ret)
            //let openid = ret.openid
            //let unionid = ret.unionid
            return {errcode: 'success', errmsg:'getopenid:ok', ret: ret}
        }
    }

    /**
     * 获取openid
     * 【用法还不明确】
     * @param {*} user 
     * @param {*} params
     */
    async GetOpenId(user, params) {
       var weChatEntity = new weChat();
       try {
            let ret = await weChatEntity.getOpenIdByCode(params.code, wechatcfg.miniAppId, wechatcfg.miniAppSecret);
            console.log(ret);
            if(ret.errcode !== undefined ) {
                return {errcode: 'fail', errmsg: ret.errmsg};
            } else {
                let openid = ret.openid;
                let userBase = facade.GetMapping(tableType.userBase).groupOf().where([['openid', '==', openid]]).records();
                if(userBase.length==0) {            
                    //注册新用户
                    console.log('now create new user');
                    let random = new randomHelp();
                    let user_name = random.randomString(8) + "_" + random.randomNum(8);
                    let auth_key = md5(user_name + "_" + random.randomNum(4));
                    let created_at = new Date().getTime();
                    let userBaseItem = {
                        user_name: user_name,
                        auth_key: auth_key,
                        password_hash: auth_key,
                        remember_token: random.randomString(32),
                        openid: openid,
                        flags: 1,
                        user_type: 1,
                        created_at: created_at
                    };
                    let newUserBase = await facade.GetMapping(tableType.userBase).Create(userBaseItem);
                    if(!!newUserBase) {
                        //微信openid与用户对应表
                        let userWechatItem = {
                            openid: openid,
                            ntype: newUserBase.orm.user_type,
                            uid: newUserBase.orm.id,
                            first_time: created_at,
                            last_time: created_at
                        };
                        facade.GetMapping(tableType.userWechat).Create(userWechatItem);
                    }
                }
                return {errcode: 'success', errmsg:'getopenid:ok', detail:{openid: ret.openid, sessionKey: ret.session_key}};
            }
       } catch(err) {
            console.log('get openid fail:' + err.message);
            return {errcode: 'fail', errmsg: err.message};
       }
    }

   /**
     * 注册用户个人信息
     * 【用法还不明确】
     * @param {*} user 
     * @param {*} params
     */
    async RegUserProfile(user, params) {
        let openid = params.openid;
        let sessionKey = params.sessionKey;
        let iv = params.iv;
        let encryptedData = params.encryptedData;
        let userBase = facade.GetMapping(tableType.userBase).groupOf().where([['openid', '==', openid]]).records(['id']);
        let errmsg = '';
        if(userBase.length > 0) {       //
            let uid = userBase[0].id;
            let userProfile = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
            if(userProfile.length == 0) {
                //创建账户
                let play_uid = openid;
                let ret = await remote.execute('token.user', ['first-acc-01', play_uid, null, openid]);
                let block_addr = (!!ret && ret.hasOwnProperty("data")) ? ret.data.addr : '';
                //let ret = await remote.execute('address.create', [openid]);   
                //let block_addr = (!!ret && ret.hasOwnProperty("address")) ? ret.address : '';
                encryptedData = encryptedData.replace(/ /g,'+');
                iv = iv.replace(/ /g,'+');
                let pc = new WXBizDataCrypt(wechatcfg.miniAppId, sessionKey)
                let data = pc.decryptData(encryptedData , iv)
                console.log('解密后 data: ', data)
                let unionId = ''
                if(data != null && data.hasOwnProperty('unionId')) {
                    unionId = data.unionId
                }
                //添加用户个人信息
                let userProfileItem = {
                    uid: uid,
                    nick: params.nickName,
                    gender: params.gender,
                    country: params.country,
                    province: params.province,
                    block_addr: block_addr,
                    city: params.city,
                    avatar_uri: params.avatarUrl,
                    unionid: unionId
                };
                facade.GetMapping(tableType.userProfile).Create(userProfileItem);
                let userWechats = facade.GetMapping(tableType.userWechat).groupOf().where([['openid', '==', openid]]).records();
                if(userWechats.length >0 ) {
                    userWechats[0].setAttr('unionid', unionId)
                    userWechats[0].orm.save()
                }
                errmsg = 'regUserProfile:ok';
            } else {
                //用户个人信息已存在
                errmsg = 'regUserProfile:already';
            }
        } else {
            errmsg = 'regUserProfile:not ready';
        }
        return {errcode: 'success', errmsg: errmsg};
    }

   /**
     * 获取签名
     * 【用法还不明确】
     * @param {*} user 
     * @param {*} params
     */
    async WechatConfig(user, params) {
        let url = params.url;
        console.log("signature url " + url);
        let res = await new Promise(function (resolve, reject) {
            signature.sign(url, function(data) {
                console.log({signature: data});
                let wxconfig = {
                    //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: wechatcfg.appid, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.noncestr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名，见附录1
                    jsApiList: wechatcfg.jsApiList,
                }
                //res.json(wxconfig);
                console.log("wxconfig " + wxconfig);
                resolve(wxconfig);
            });
        })
        console.log({errcode: 'success', wxconfig: res})
        return {errcode: 'success', wxconfig: res}
    }

    /**
     * 统一下单
     * 【用法还不明确】
     * @param {*} user 
     * @param {*} params
    */
    async UnifiedOrder(user, params) {
        let openid = params.openid
        let ip = params.userip
        let price = params.price
        let productIntro = params.productIntro
        let tradeId = params.tradeId
        try {
            let res = await wxUnifiedorder.unifiedOrder(openid, ip, price, productIntro, tradeId);
            return {errcode: 'success', unifiedOrder: res}
        }catch(e) {
            console.log(e);
            return {errcode: 'error', errmsg: e}
        }
    }

    async GetToken(user, params) {
        const wxAppAPI = new WechatAPI(wechatcfg.miniBgwAppId, wechatcfg.miniBgwAppSecret)
        const token = await wxAppAPI.ensureAccessToken()
        // 拼接url
        const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token.accessToken}`

        // 发送POST请求
        const response = await axios.post(url, {
        page: 'pages/index/index',
        scene: 'abc123'
        }, { responseType: 'stream' })

        // 将请求结果中的二进制流写入到本地文件qrcode.png
        response.data.pipe(fs.createWriteStream('qrcode.png'))

        return {errcode: 'success', token: token}
    }

    async SendRecPack(user, params) {
        let openid = params.openid
        let ret = await wxSendRecPack(200, openid)
        return {errcode: 'success', ret: ret}
    }
}

exports = module.exports = wechat;
