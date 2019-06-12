let facade = require('gamecloud')

let wechatcfg = facade.ini.servers["Index"][1].wechat; //全节点配置信息

/**
 * 自定义认证接口 - 微信专用
 */
class authwx extends facade.Control
{
    constructor(parent) {
        super(parent);
        this.domain = 'authwx';
    }

    /**
     * 自定义路由
     */
    get middleware(){
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 控制器自带的Url路由信息
     */
    get router() {
        return [
            [`/${this.domain}`, 'auth'],        //定义发放签名功能的路由、函数名
        ];
    }

    /**
     * 验签函数，约定函数名为 check
     * @param {*} user 
     * @param {*} oemInfo 
     */
    async check(oemInfo) {
        let ret = await this.parent.service.wechat.getOpenidByCode(oemInfo.openkey, wechatcfg.appid, wechatcfg.secret);
        let usr = await this.parent.service.wechat.getMapUserInfo(ret.access_token, ret.openid);

        await facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
        return ret.openid; //通过验证后，返回平台用户ID
    }

    async regUserFromWechat(openid, userProfile) {
        console.log('userhelp.js 77 创建新用户',userProfile);
        let random = new randomHelp();
        let user_name = random.randomString(4) + "_" + random.randomNum(4);
        let auth_key = crypto.createHash('md5').update(user_name + "_" + random.randomNum(4)).digest("hex");

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
            console.log("userhelp.js 104 保存user_wechat表完成");

            let ret = await facade.current.service.gamegoldHelper.execute('token.user', ['first-acc-01', uid, null, uid]);
            let block_addr = (!!ret && ret.hasOwnProperty("data")) ? ret.data.addr : '';

            //添加用户个人信息
            let userProfileItem = null
            if(userProfile == null) {
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
                    id: uid,
                    uid: uid,
                    nick: userProfile.nickname,
                    gender: userProfile.sex,
                    country: userProfile.country,
                    province: userProfile.province,
                    city: userProfile.city,
                    avatar_uri: userProfile.headimgurl,
                    block_addr: block_addr,
                    prop_count: 0,
                    current_prop_count: 0,
                };
            }
            console.log("userhelp.js 135 保存user_profile表开始",userProfileItem);
            await facade.GetMapping(tableType.userProfile).Create(userProfileItem);
            console.log("userhelp.js 135 保存user_profile表完成");
            return uid;
        }
        return 0
    }    
}

exports = module.exports = authwx;
