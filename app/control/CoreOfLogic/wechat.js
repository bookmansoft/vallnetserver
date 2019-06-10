let facade = require('gamecloud')
let crypto = require('crypto')
const fs = require('fs')
const axios = require('axios')

let randomHelp = require('../../util/randomHelp')
let tableType = require('../../util/tabletype')
let userHelp = require('../../util/userhelp')

let wechatcfg = facade.ini.servers["Index"][1].wechat; //全节点配置信息
let WeChat = require('../../util/wechat')
let weChatEntity = new WeChat(wechatcfg.miniBgwAppId, wechatcfg.miniBgwAppSecret);

/**
 * 微信接口
 * Create by gamegold Fuzhou on 2018-11-27
 */
class wechat extends facade.Control {
    /**
     * 从 微信的 code 初始化出 User 对象，其中包括注册过程。
     * 客户端的调用场景未知
     * @param {*} user 
     * @param {*} params 
     */
    async InitUserFromCode(user, params) {
        console.log("【此方法不应该被调用！！！】进入wechat.js InitUserFromCode方法",params.code,params.openid);
        let code = params.code

        console.log(code, wechatcfg.appid, wechatcfg.secret);
        let ret = await weChatEntity.getMapOpenIdByCode(code, wechatcfg.appid, wechatcfg.secret);
        //console.log(ret);
        if (ret.errcode !== undefined) {
            return { errcode: 'fail', errmsg: ret.errmsg };
        } else {
            console.log("wechat.js 47:",ret);
            let openid = ret.openid
            let access_token = ret.access_token
            //调用用户信息获取接口，使用 openid 为参数，获取到该用户的详细信息
            let retUser = await weChatEntity.getMapUserInfo(access_token, openid)
            if (retUser.errcode !== undefined) {
                return { errcode: 'fail', errmsg: retUser.errmsg };
            }
            console.log("wechat.js 55",retUser);
            //通过opendid获取用户；如果获取不到用户，则注册用户
            let uid = await userHelp.getUserIdFromOpenId(openid);
            if (uid == 0) {
                console.log("53 无法获取到用户");
                uid = await userHelp.regUserFromWechat(openid, retUser); //发现bug，此处需要赋值给 uid
                console.log("54 注册了新用户",uid);
            }
            let userProfile = await facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
            if (userProfile.length > 0) {
                userProfile = userProfile[0].orm
                return { errcode: 'success', errmsg: 'getopenid:ok', uid: userProfile.uid, openid: openid, userProfile: userProfile }
            } else {
                return { errcode: 'fail', errmsg: 'user not exist', userProfile: null }
            }
        }
    }
    /**
     * 从 微信的 openid 初始化出 User 对象，其中包括注册过程。
     * 客户端的 Login.vue InitUserFromOpenId() 方法调用，由于此方法的 null 参数，导致无法记录用户资料
     * 增补传递了 code 参数
     * @param {*} user 
     * @param {*} params 
     */
    async InitUserFromOpenId(user, params) {
        console.log("wechat.js InitUserFromOpenId:",user,params);
        let openid = params.openid;
        let access_token=params.access_token;
        let uid = await userHelp.getUserIdFromOpenId(openid, 2)
        if (uid == 0) {
            console.log("uid为0");
            //调用用户信息获取接口，使用 openid 为参数，获取到该用户的详细信息
            let retUser = await weChatEntity.getMapUserInfo(access_token, openid);
            if (retUser.errcode !== undefined) {
                return { errcode: 'fail', errmsg: retUser.errmsg };
            }
            console.log("wechat.js 93",retUser);
            uid = await userHelp.regUserFromWechat(openid, retUser);
        }
        let userProfile = await facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
        if (userProfile.length > 0) {
            userProfile = userProfile[0].orm
            return { errcode: 'success', errmsg: 'getopenid:ok', uid: uid, openid: openid, userProfile: userProfile }
        } else {
            return { errcode: 'fail', errmsg: 'user not exist', userProfile: null }
        }

    }
    /**
     * 获取用户但是不会自动注册。
     * 业务流程是先获取，如果获取不到的情况下，引导到授权注册。
     * @param {*} user 
     * @param {*} params 
     */
    async GetUserFromMapCode(user, params) {
        try {
            console.log("wechat.js 114",params);
            let code = params.code
            console.log(code, wechatcfg.appid, wechatcfg.secret)
            let ret = await weChatEntity.getMapOpenIdByCode(code, wechatcfg.appid, wechatcfg.secret);
            console.log("wechat.js 119 获取到用户信息(看看如何保存)：",ret);
            if (ret.errcode !== undefined) {
                return { errcode: 'fail', errmsg: ret.errmsg };
            } else {
                let openid = ret.openid;
                let access_token= ret.access_token;
                let user = await userHelp.getUserFromOpenId(openid, 2);
                console.log("wechat.js 127",user);
                return { errcode: 'success', openid: openid,access_token:access_token, user: user }
            }
        }
        catch (ex) {
            console.log(100);
        }

    }

    /**
     * 未被调用
     * 【用法还不明确】
     * @param {*} user 
     * @param {*} params
     */
    async GetOpenId(user, params) {
        try {
            let ret = await weChatEntity.getOpenIdByCode(params.code, wechatcfg.miniAppId, wechatcfg.miniAppSecret);
            console.log(ret);
            if (ret.errcode !== undefined) {
                return { errcode: 'fail', errmsg: ret.errmsg };
            } else {
                let openid = ret.openid;
                let userBase = facade.GetMapping(tableType.userBase).groupOf().where([['openid', '==', openid]]).records();
                if (userBase.length == 0) {
                    //注册新用户
                    console.log('wechat.js 142 : 创建新用户');
                    let random = new randomHelp();
                    let user_name = random.randomString(8) + "_" + random.randomNum(8);
                    let auth_key = crypto.createHash('md5').update(user_name + "_" + random.randomNum(4)).digest("hex");

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
                    if (!!newUserBase) {
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
                return { errcode: 'success', errmsg: 'getopenid:ok', detail: { openid: ret.openid, sessionKey: ret.session_key } };
            }
        } catch (err) {
            console.log('get openid fail:' + err.message);
            return { errcode: 'fail', errmsg: err.message };
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
        if (userBase.length > 0) {       //
            let uid = userBase[0].id;
            let userProfile = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
            if (userProfile.length == 0) {
                //创建账户
                let play_uid = openid;
                let ret = await facade.current.service.gamegoldHelper.execute('token.user', ['first-acc-01', play_uid, null, openid]);
                let block_addr = (!!ret && ret.result.hasOwnProperty("data")) ? ret.result.data.addr : '';
                //let ret = await remote.execute('address.create', [openid]);   
                //let block_addr = (!!ret && ret.hasOwnProperty("address")) ? ret.address : '';
                encryptedData = encryptedData.replace(/ /g, '+');
                iv = iv.replace(/ /g, '+');
                let data = weChatEntity.decryptData(wechatcfg.miniAppId, sessionKey, encryptedData, iv)
                console.log('解密后 data: ', data)
                let unionId = ''
                if (data != null && data.hasOwnProperty('unionId')) {
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
                if (userWechats.length > 0) {
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
        return { errcode: 'success', errmsg: errmsg };
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
            signature.sign(url, function (data) {
                console.log({ signature: data });
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
        console.log({ errcode: 'success', wxconfig: res })
        return { errcode: 'success', wxconfig: res }
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
        let productInfo = params.productInfo
        let tradeId = params.tradeId
        let appId = params.appId
        //const appId = 'wx4b3efb80ac5de780'
        try {
            let res = await weChatEntity.unifiedOrder(appId, openid, ip, price, productInfo, tradeId);
            return { errcode: 'success', unifiedOrder: res }
        } catch (e) {
            console.log(e);
            return { errcode: 'error', errmsg: e }
        }
    }

    async GetToken(user, params) {
        const token = await weChatEntity.ensureAccessToken();
        // 拼接url
        const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token.accessToken}`;
        // 发送POST请求
        const response = await axios.post(url, {
            page: 'pages/index/index',
            scene: 'abc123'
        }, { responseType: 'stream' });
        // 将请求结果中的二进制流写入到本地文件qrcode.png
        response.data.pipe(fs.createWriteStream('qrcode.png'));
        return { errcode: 'success', token: token };
    }

    async SendRecPack(user, params) {
        let openid = params.openid

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
        let ret = await weChatEntity.sendRedPacket(total_amount, total_num, openid, redPackConfig)
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
        facade.GetMapping(tableType.redpack).Create(redpackItem);

        return { errcode: 'success', ret: ret.return_msg }
    }

    async GetRecPackInfo(user, params) {
        let mch_billno = params.mch_billno
        let ret = await weChatEntity.getHBinfo(mch_billno)
        return { errcode: 'success', ret: ret }
    }
}

exports = module.exports = wechat;
