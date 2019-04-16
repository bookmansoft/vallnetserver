let facade = require('gamecloud')
let tableType = require('./tabletype');
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

    async getUserIdFromOpenId(openid, ntype) {
        let userWechats = await facade.GetMapping(tableType.userWechat).groupOf()
            .where([
                ['openid', '==', openid],
                ['ntype', '==', ntype],
            ])
            .records(['uid']);
        if(userWechats.length >0 ) {
            return userWechats[0].uid;
        }
        return 0
    }

    async getUserFromOpenId(openid, ntype) {
        let userWechats = await facade.GetMapping(tableType.userWechat).groupOf()
            .where([
                ['openid', '==', openid],
                ['ntype', '==', ntype],
            ]).records(['uid'])
        if(userWechats.length >0 ) {
            let uid = userWechats[0].uid
            let userBase = await facade.GetMapping(tableType.userBase).groupOf()
                .where([['id', '==', uid]]).records(['id', 'user_name'])
            if(userBase.length >0 ) {
                return userBase[0]
            }
        }
        return {id:0, user_name:''}
    }

    async regUserFromWechat(openid, userInfo) {
        //注册新用户
        console.log('now create new user');
        let random = new randomHelp();
        let user_name = random.randomString(4) + "_" + random.randomNum(4);
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
            let userProfileItem = null
            if(userInfo == null) {
                userProfileItem = {
                    id: uid,
                    uid: uid,
                    nick: user_name,
                    gender: '1',
                    block_addr: block_addr,
                    avatar_uri: './static/img/icon/mine_no.png'
                };
            } else {
                userProfileItem = {
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
            }
            await facade.GetMapping(tableType.userProfile).Create(userProfileItem);
            return uid
        }
        return 0
    }

    isPoneAvailable($poneInput) {
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test($poneInput.val())) {
            return false;
        } else {
            return true;
        }
    }

}

module.exports = userhelp;