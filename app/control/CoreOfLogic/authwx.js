let facade = require('gamecloud')

/**
 * 自定义认证接口 - 微信专用
 */
class authwx extends facade.Control
{
    /**
     * 微信验证，和Auth上所作的完全一致
     * Auth上所作的微信验证是为了将 openkey 转化为 openid ，这里的微信验证是为了数据安全
     */
    async check(oemInfo) {
        let ret = {};
        if(this.core.options.debug) { 
            ret =  {
                "access_token":"22_Nuc40GcCU2Ry0HfHGS5spLvPiv4lngrLxKv9yaqcHh7bMPsAGsFwrFC5DlCscmWvpIg5giztvQVYSfgMlJO-pA",
                "expires_in":7200,
                "refresh_token":"22_sLtNdLEaCjnemZY1BL322wc8vzXET7Uf7KdLqPb2V5RHewr01nRHVFB2ybwZFVJSQFiqnfyLiSFyyPAm-ZABNw",
                "openid":oemInfo.openid,
                "scope":"snsapi_userinfo",
                "unionid":oemInfo.openid
            }
        } else {
            ret = await this.core.service.wechat.getOpenidByCode(oemInfo.openkey, wechatcfg.appid, wechatcfg.secret);
            /* api.weixin.qq.com/sns/oauth2/access_token 返回结果
            * 注意unionid和openid的不同：unionid可以跨越多个公众号共享，而openid只针对单个公众号有效
                {
                    "access_token":"22_Nuc40GcCU2Ry0HfHGS5spLvPiv4lngrLxKv9yaqcHh7bMPsAGsFwrFC5DlCscmWvpIg5giztvQVYSfgMlJO-pA",
                    "expires_in":7200,
                    "refresh_token":"22_sLtNdLEaCjnemZY1BL322wc8vzXET7Uf7KdLqPb2V5RHewr01nRHVFB2ybwZFVJSQFiqnfyLiSFyyPAm-ZABNw",
                    "openid":"oqR1e1Zr9elneifik1lmMF1LzK44",
                    "scope":"snsapi_userinfo",
                    "unionid":"ougg56Ahg_Ge1qd1qWG0eROJvDpI"
                }
            */

            if(!ret || !!ret.errcode) {
                throw new Error('access openid error');
            }
        }

        if(!ret.unionid) {
            ret.unionid = ret.openid;
        }
    
        return ret; //通过验证后，返回结构化数据
    }

    /**
     * 获取用户档案文件，注意这不是一个控制器方法，而是由 authHandle 中间件自动调用的内部接口，并不面向客户端
     * @param {*} oemInfo 
     */
    async getProfile(oemInfo) {
        let profile = {};
        if(!this.core.options.debug) { 
            try {
                profile = await this.core.service.wechat.getMapUserInfo(oemInfo.access_token, oemInfo.openid);
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
    
                let rt = await this.core.service.gamegoldHelper.execute('token.user', ['first-acc-01', uid, null, uid]);
                profile.block_addr = (!!rt && rt.hasOwnProperty("data")) ? rt.data.addr : '';
            } catch(e) {
                console.log(e.message);
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
            block_addr: profile.block_addr || '',
            prop_count: 0,
            current_prop_count: 0,
            unionid: profile.unionId,
        }
    }
}

exports = module.exports = authwx;
