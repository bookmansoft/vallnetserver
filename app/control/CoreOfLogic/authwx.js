let facade = require('gamecloud')

let wechatcfg = facade.ini.servers["Index"][1].wechat; //全节点配置信息

/**
 * 自定义认证接口 - 微信专用
 */
class authwx extends facade.Control
{
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
        ];
    }

    /**
     * 验签函数，约定函数名为 check
     * @param {*} user 
     * @param {*} oemInfo 
     */
    async check(oemInfo) {
        if(!this.parent.options.debug) { 
            let ret = await this.parent.service.wechat.getOpenidByCode(oemInfo.openkey, wechatcfg.appid, wechatcfg.secret);
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
    
            return ret; //通过验证后，返回结构化数据
        } else {
            return {
                    "access_token":"22_Nuc40GcCU2Ry0HfHGS5spLvPiv4lngrLxKv9yaqcHh7bMPsAGsFwrFC5DlCscmWvpIg5giztvQVYSfgMlJO-pA",
                    "expires_in":7200,
                    "refresh_token":"22_sLtNdLEaCjnemZY1BL322wc8vzXET7Uf7KdLqPb2V5RHewr01nRHVFB2ybwZFVJSQFiqnfyLiSFyyPAm-ZABNw",
                    "openid":oemInfo.openkey,
                    "scope":"snsapi_userinfo",
                    "unionid":oemInfo.openkey
            }
        }

    }

    async getProfile(oemInfo) {
        let profile = {};
        if(!this.parent.options.debug) { 
            try {
                profile = await this.parent.service.wechat.getMapUserInfo(oemInfo.access_token, oemInfo.openid);
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
    
                let rt = await facade.current.service.gamegoldHelper.execute('token.user', ['first-acc-01', uid, null, uid]);
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
