let facade = require('gamecloud')
let wechatcfg = facade.ini.servers["Index"][1].wechat; //全节点配置信息

/**
 * 自定义认证接口 - 微信专用
 */
class auth extends facade.Control
{
    /**
     * 配置URL路由，用户可以直接经由页面访问获取签名数据集
     */
    get router() {
        return [
            [`/authwx.Wallet`, 'authwx'],        //定义发放签名功能的路由路径和处理函数
        ];
    }

    /**
     * 验签函数，注意这不是一个控制器方法，而是一个路由方法
     * @param {*} user 
     * @param {*} oemInfo 
     */
    async authwx(oemInfo) {
        let ret = {};
        if(this.core.options.debug) { 
            ret =  {
                "access_token":"22_Nuc40GcCU2Ry0HfHGS5spLvPiv4lngrLxKv9yaqcHh7bMPsAGsFwrFC5DlCscmWvpIg5giztvQVYSfgMlJO-pA",
                "expires_in":7200,
                "refresh_token":"22_sLtNdLEaCjnemZY1BL322wc8vzXET7Uf7KdLqPb2V5RHewr01nRHVFB2ybwZFVJSQFiqnfyLiSFyyPAm-ZABNw",
                "openid":oemInfo.openkey,
                "scope":"snsapi_userinfo",
                "unionid":oemInfo.openkey
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
}

exports = module.exports = auth;
