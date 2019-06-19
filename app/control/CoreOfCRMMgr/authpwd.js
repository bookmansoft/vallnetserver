let facade = require('gamecloud')
let {EntityType, IndexType, ReturnCode} = facade.const
let {now, sign} = facade.util

/**
 * 自定义认证接口
 */
class authpwd extends facade.Control
{
    /**
     * 自定义中间件，跳过默认用户认证中间件 authHandle
     */
    get middleware(){
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 验证密码
     * @param {*} objData
     */
    check(objData) {
        let usr = this.core.GetObject(EntityType.User, `${objData.domain}.${objData.openid}`, IndexType.Domain);

        //如果用户存在，则验证密码，否则返回注册资料，供后续流程自动注册新用户
        if (!!usr && objData.openkey !== usr.baseMgr.info.getAttr('pwd')) {
            throw(new Error('登录失败，密码错误'));
        }

        return {
            openid : objData.openid,
            nickname: objData.openid,
            avatar_uri: objData.headimgurl || './static/img/icon/mine_no.png',
            unionid: objData.openid,
        }
    }
    
    /**
     * 获取用户档案文件，注意这不是一个控制器方法，而是由 authHandle 中间件自动调用的内部接口，并不面向客户端
     * @param {*} oemInfo 
     */
    async getProfile(oemInfo) {
        return {
            openid : oemInfo.openid,
            pwd: oemInfo.openkey,
            nickname: oemInfo.nickname || `vallnet${(Math.random()*1000000)|0}`,
            avatar_uri: oemInfo.headimgurl || './static/img/icon/mine_no.png',
            unionid: oemInfo.openid,
            remark: oemInfo.remark,
            state: 1,
        }
    }
}

exports = module.exports = authpwd;
