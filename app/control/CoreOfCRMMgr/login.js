let facade = require('gamecloud')
let {ReturnCode} = facade.const

/**
 * 自定义控制器：用户登录模块
 * @description 该模块覆盖了同名的系统缺省控制器
 */
class login extends facade.Control
{
    /**
     * 用户登录
     * @param {UserEntity}  user	认证用户对象
     * @param {Object}      params	上行参数数组
     * @returns {Object}
     */
    async UserLogin(user, params) {
        let ret = {code:ReturnCode.Success};

        ret.data = user.GetInfo();
        ret.data.id = user.id;         //本服唯一数字编号
        ret.data.openid = user.openid; //uuid
        ret.data.name = user.name;     //用户昵称，客户端直接获取
        ret.data.token = user.sign;    //登录令牌
        ret.data.time = user.time;     //标记令牌有效期的时间戳
        ret.data.currentAuthority = user.baseMgr.info.getAttr('currentAuthority') || ['user']; //客户端需要的权限信息

        return ret;
    }
}
exports = module.exports = login;
