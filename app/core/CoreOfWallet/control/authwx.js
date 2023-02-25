let facade = require('gamecloud')
let wechatcfg = facade.ini.servers["CoreOfIndex"][1].wechat; //全节点配置信息

/**
 * 自定义认证接口 - 微信专用
 */
class authwx extends facade.Control
{
    /**
     * 微信验证
     * Auth上所作的微信验证是为了将 openkey 转化为 openid ，这里的微信验证是为了数据安全
     */
    async check(oemInfo) {
        let profile = {};
        if(!this.core.options.debug) { 
            profile = await this.core.service.wechat.getMapUserInfo(oemInfo.openkey, oemInfo.openid);
            /*
            {
                "openid":"oqR1e1Zr9elneifik1lmMF1LzK44",
                "nickname":"百晓生",
                "sex":1,
                "language":"zh_CN",
                "city":"Fuzhou",
                "province":"Fujian",
                "country":"CN",
                "headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI5Qw1flMibKSBwZ8MXSmod0YsC7d9fornhL9KibjGvrsia0AMoZaXHicHf0ibNNIw0hoic69282UjFOwBg/132",
                "privilege":[],
                "unionid":"ougg56Ahg_Ge1qd1qWG0eROJvDpI"
            }
            */
           if(!profile || !!profile.errcode) {
                throw new Error('access openid error');
            }
        } else {
            profile = {
                "openid":oemInfo.openid,
                "nickname":"百晓生",
                "sex":1,
                "language":"zh_CN",
                "city":"Fuzhou",
                "province":"Fujian",
                "country":"CN",
                "headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI5Qw1flMibKSBwZ8MXSmod0YsC7d9fornhL9KibjGvrsia0AMoZaXHicHf0ibNNIw0hoic69282UjFOwBg/132",
                "privilege":[],
                "unionid":oemInfo.openid
            }
        }

        //做统一的格式转换
        return {
            openid : profile.openid,
            openkey: oemInfo.openkey,
            nickname: profile.nickname,
            sex: profile.sex,
            country: profile.country,
            province: profile.province,
            city: profile.city,
            avatar_uri: profile.headimgurl || './static/img/icon/mine_no.png',
            prop_count: 0,
            current_prop_count: 0,
            unionid: profile.unionid,
        }
    }

    /**
     * 获取用户档案文件，注意这不是一个控制器方法，而是由 authHandle 中间件自动调用的内部接口，并不面向客户端
     * @param {*} oemInfo 
     */
    async getProfile(oemInfo) {
        let profile = {};
        if(!this.core.options.debug) { 
            profile = await this.core.service.wechat.getMapUserInfo(oemInfo.openkey, oemInfo.openid);
            /*
            {
                "openid":"oqR1e1Zr9elneifik1lmMF1LzK44",
                "nickname":"百晓生",
                "sex":1,
                "language":"zh_CN",
                "city":"Fuzhou",
                "province":"Fujian",
                "country":"CN",
                "headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI5Qw1flMibKSBwZ8MXSmod0YsC7d9fornhL9KibjGvrsia0AMoZaXHicHf0ibNNIw0hoic69282UjFOwBg/132",
                "privilege":[],
                "unionid":"ougg56Ahg_Ge1qd1qWG0eROJvDpI"
            }
            */
           if(!profile || !!profile.errcode) {
                throw new Error('access openid error');
            }
        } else {
            profile = {
                "openid":oemInfo.openid,
                "nickname":"百晓生",
                "sex":1,
                "language":"zh_CN",
                "city":"Fuzhou",
                "province":"Fujian",
                "country":"CN",
                "headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI5Qw1flMibKSBwZ8MXSmod0YsC7d9fornhL9KibjGvrsia0AMoZaXHicHf0ibNNIw0hoic69282UjFOwBg/132",
                "privilege":[],
                "unionid":oemInfo.openid
            }
        }

        //做统一的格式转换
        return {
            openid : profile.openid,
            nickname: profile.nickname,
            sex: profile.sex,
            country: profile.country,
            province: profile.province,
            city: profile.city,
            avatar_uri: profile.headimgurl || './static/img/icon/mine_no.png',
            prop_count: 0,
            current_prop_count: 0,
            unionid: profile.unionid,
        }
    }
}

exports = module.exports = authwx;
