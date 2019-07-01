let facade = require('gamecloud')
let {EntityType, IndexType, ReturnCode} = facade.const

/**
 * 自定义控制器：用户认证控制器
 */
class authpwd extends facade.Control
{
    /**
     * 返回自定义中间件序列
     * @description 该序列不包含鉴权中间件，意味着该控制器可以被匿名访问
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 验证密码函数
     * @description 该函数并非外部控制器方法，而是由鉴权中间件(authCRMMgr)自动调用的内部接口，提供基于用户名/密码校验模式的身份校验
     * @param {Object} params
     */
    check(params) {
        let usr = this.core.GetObject(EntityType.User, `${params.domain}.${params.openid}`, IndexType.Domain);

        //验证用户是否否存在，密码是否正确
        if (!usr || params.openkey !== usr.baseMgr.info.getAttr('pwd')) {
            throw(new Error('登录失败，用户不存在或密码错'));
        }

        //验证通过，返回用户资料
        return {
            openid : params.openid,
            nickname: params.openid,
            avatar_uri: params.headimgurl || './static/img/icon/mine_no.png',
            unionid: params.openid,
        }
    }
    
    /**
     * 为新增用户提供默认的用户档案
     * @description 该函数并非外部控制器方法，而是由鉴权中间件(authCRMMgr)自动调用的内部接口
     * @param {*} params 
     */
    async getProfile(params) {
        return {
            openid : params.openid,
            pwd: params.openkey,
            nickname: params.nickname || `vallnet${(Math.random()*1000000)|0}`,
            avatar_uri: params.headimgurl || './static/img/icon/mine_no.png',
            unionid: params.openid,
            remark: params.remark,
            state: 1,
        }
    }
}

exports = module.exports = authpwd;
