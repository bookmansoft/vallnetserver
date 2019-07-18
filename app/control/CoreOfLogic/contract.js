let facade = require('gamecloud')
/**
 * 交易对
 * Updated by thomasFuzhou on 2018-11-19.
 */
class contract extends facade.Control
{
    /**
     * 发布交易对合约
     */
    async ContractCreate(user, params) {
        let ntype = params.ntype;
        let num = params.num;
        let btc = params.btc;
        let addr = params.addr;
        let ret = await this.core.service.gamegoldHelper.execute('contract.create', [
            ntype, num, btc, addr, user.openid
        ]);
        return {code: 0, msg: 'contract.create:ok', data: ret.result};
    }

    //签署交易对
    async ContractPromise(user, params) {
        let txid = params.txid;
        let ret = await this.core.service.gamegoldHelper.execute('contract.promise', [
            txid, user.openid
        ]);
        return {code: 0, msg: 'contract.promise', data: ret.result};
    }

    //执行交易对
    async ContractExcute(user, params) {
        let txid = params.txid;
        let addr = params.addr;
        let ret = await this.core.service.gamegoldHelper.execute('contract.excute', [
            txid, addr
        ]);
        return {code: 0, data: ret.result};
    }

    async ContractList(user, params) {
        let ret = await this.core.service.gamegoldHelper.execute('contract.list', [1, 1]);
        return {code: 0, msg: 'contract.list:ok', data: ret.result};
    }

}

exports = module.exports = contract;
