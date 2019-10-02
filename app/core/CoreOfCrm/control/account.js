let facade = require('gamecloud')
let { ReturnCode, NotifyType } = facade.const

/**
 * 账户的控制器
 * Updated on 2018-11-20.
 */
class account extends facade.Control {
    /**
     * 查询账户余额
     * @param {*} user 
     * @param {*} params
     */
    async BalanceAll(user, params) {
        let paramArray = params.items;
        if (typeof (paramArray) == "string") {
            paramArray = JSON.parse(paramArray);
        }
        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('balance.all', paramArray);
        return { code: ret.code, data: ret.result };
    }
}

exports = module.exports = account;
