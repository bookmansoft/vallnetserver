let facade = require('gamecloud')
let tableType = require('./tabletype');
let tableField = require('./tablefield');
let randomHelp = require('./randomHelp')
let md5 = require('md5')
//引入工具包
const toolkit = require('gamegoldtoolkit')
let remoteSetup = require('./gamegold')
const remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch'))  
remote.setup(remoteSetup);

class userhelp {
     /**
     * 构造函数
     * @param {*}  监控对象ID
     */
    constructor(){

    }

    async getUserIdFromOpenId(openid) {
        let userWechats = await facade.GetMapping(tableType.userWechat).groupOf().where([['openid', '==', openid]]).records(['uid']);
        if(userWechats.length >0 ) {
            return userWechats[0].uid;
        }
        return 0
    }

    async regUserFromWechat(openid, userInfo) {
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
            user_type: 2,
            created_at: created_at
        };
        let newUserBase = await facade.GetMapping(tableType.userBase).Create(userBaseItem);
        if(!!newUserBase) {
            //微信openid与用户对应表
            let uid = newUserBase.orm.id 
            let userWechatItem = {
                uid: uid,
                openid: openid,
                ntype: newUserBase.orm.user_type,
                first_time: created_at,
                last_time: created_at
            };
            facade.GetMapping(tableType.userWechat).Create(userWechatItem);

            let ret = await remote.execute('token.user', ['first-acc-01', uid, null, uid]);
            let block_addr = (!!ret && ret.hasOwnProperty("data")) ? ret.data.addr : '';

            //添加用户个人信息
            let userProfileItem = {
                uid: uid,
                nick: userInfo.nickname,
                gender: userInfo.sex,
                country: userInfo.country,
                province: userInfo.province,
                city: userInfo.city,
                avatar_uri: userInfo.headimgurl,
                block_addr: block_addr,
                prop_count: 0,
                current_prop_count: 0,
            };
            facade.GetMapping(tableType.userProfile).Create(userProfileItem);

            return userProfileItem
        }
        return null
    }
}

module.exports = userhelp;