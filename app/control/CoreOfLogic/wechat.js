let facade = require('gamecloud');
let weChat = require('../../util/wechat');
let randomHelp = require('../../util/randomHelp');
let md5 = require('md5');
let tableType = require('../../util/tabletype');
let remoteSetup = require('../../util/gamegold');
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

    /**
     * 获取openid
     * 【用法还不明确】
     * @param {*} user 
     * @param {*} params
     */
    async GetOpenId(user, params) {
       var weChatEntity = new weChat();
       try {
            let ret = await weChatEntity.getOpenIdByCode(params.code);
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
                return {errcode: 'success', errmsg:'getopenid:ok', detail:{openid: ret.openid}};
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
        let userBase = facade.GetMapping(tableType.userBase).groupOf().where([['openid', '==', openid]]).records(['id']);
        let errmsg = '';
        if(userBase.length > 0) {       //
            let uid = userBase[0].id;
            let userProfile = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
            if(userProfile.length == 0) {
                //创建账户
                //let ret = await remote.execute('token.user', ['first-acc-01', openid, openid]);   
                let ret = await remote.execute('address.create', [openid]);   
                let block_addr = ret.hasOwnProperty("address") ? ret.address : '';
                //添加用户个人信息
                let userProfileItem = {
                    uid: uid,
                    nick: params.nickName,
                    gender: params.gender,
                    country: params.country,
                    province: params.province,
                    block_addr: block_addr,
                    city: params.city,
                    avatar_uri: params.avatarUrl
                };
                facade.GetMapping(tableType.userProfile).Create(userProfileItem);
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
}

exports = module.exports = wechat;
