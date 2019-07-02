let facade = require('gamecloud')
let {EntityType, IndexType, ReturnCode} = facade.const

/**
 * 用户认证控制器 - 使用用户名/密码验证
 * @description 
 *  用户名/密码验证模式仍旧依赖两阶段验证完成注册
 *  它仅仅完成验证，返回的用户证书仍然是两阶段认证生成的证书
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
        //查询两阶段认证期间生成的用户对象
        let usr = this.core.GetObject(EntityType.User, `auth2step.${params.openid}`, IndexType.Domain);

        //验证用户是否否存在，密码是否正确
        if (!usr || params.openkey !== usr.baseMgr.info.getAttr('openkey')) {
            throw(new Error('登录失败，用户不存在或密码错'));
        }

        //验证通过，返回用户资料
        return {
            openid : params.openid,
            openkey : params.openkey,
            domain : 'auth2step',       //注意返回的证书类型，仍旧是两阶段认证
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
            openkey: params.openkey,
            domain : 'auth2step',      //注意返回的证书类型，仍旧是两阶段认证
            nickname: params.nickname || `vallnet${(Math.random()*1000000)|0}`,
            avatar_uri: params.headimgurl || './static/img/icon/mine_no.png',
            unionid: params.openid,
            remark: params.remark,
            state: 1,
        }
    }
}

exports = module.exports = authpwd;
