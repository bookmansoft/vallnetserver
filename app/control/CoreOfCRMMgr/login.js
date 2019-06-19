let facade = require('gamecloud')
let {em_Effect_Comm, UserStatus, NotifyType, OperEnum, ReturnCode, ActionExecuteType} = facade.const

class login extends facade.Control
{
    /**
     * 用户登陆
     * @param {UserEntity} pUser	用户
     * @param {*} info		        用户信息
     * @returns {{}}
     */
    async UserLogin(pUser, info) {
        let ret = {code:ReturnCode.Success};

        ret.data = pUser.GetInfo();
        ret.data.id = pUser.id;         //本服唯一数字编号
        ret.data.openid = pUser.openid; //uuid
        ret.data.name = pUser.name;     //用户昵称，客户端直接获取，info.name不再可用
        ret.data.token = pUser.sign;    //登录令牌
        ret.data.time = pUser.time;     //标记令牌有效期的时间戳
        ret.data.currentAuthority = 'admin';

        return ret;
    }
}
exports = module.exports = login;
