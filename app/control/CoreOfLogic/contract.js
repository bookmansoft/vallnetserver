let facade = require('gamecloud')
/**
 * 交易对
 * Updated by thomasFuzhou on 2018-11-19.
 */
class contract extends facade.Control
{
    /**
     * 创建一个收款地址：address.create 不需要参数
     * 
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async AddressCreate(user, params) {
        console.log(params.items);
        let ret = await this.core.service.gamegoldHelper.execute('address.create', params.items);
        console.log(ret.result);
        return {errcode: 'success', errmsg: 'address.create:ok', ret: ret.result};
    }
    //发布交易对合约
    async ContractCreate(user, params) {
        let ntype = params.ntype;
        let num = params.num;
        let btc = params.btc;
        let addr = params.addr;
        let ret = await this.core.service.gamegoldHelper.execute('contract.create', [
            ntype, num, btc, addr, user.openid
        ]);
        return {errcode: 'success', errmsg: 'contract.create:ok', ret: ret.result};
    }

    //签署交易对
    async ContractPromise(user, params) {
        let txid = params.txid;
        let ret = await this.core.service.gamegoldHelper.execute('contract.promise', [
            txid, user.openid
        ]);
        return {errcode: 'success', errmsg: 'contract.promise', ret: ret.result};
    }

    //执行交易对
    async ContractExcute(user, params) {
        let txid = params.txid;
        let addr = params.addr;
        let ret = await this.core.service.gamegoldHelper.execute('contract.excute', [
            txid, addr
        ]);
        return {errcode: 'success', errmsg: 'contract.excute:ok', ret: ret.result};
    }

    async ContractList(user, params) {
        let ret = await this.core.service.gamegoldHelper.execute('contract.list', [1, 1]);
        return {errcode: 'success', errmsg: 'contract.list:ok', ret: ret.result};
    }

}

exports = module.exports = contract;
