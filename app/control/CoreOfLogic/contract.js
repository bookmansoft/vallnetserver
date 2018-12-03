let facade = require('gamecloud')

//引入工具包
const toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
const remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch'))  

/**
 * 交易对
 * Updated by thomasFuzhou on 2018-11-19.
 */
class contract extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 创建一个收款地址：address.create 不需要参数
     * 
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async AddressCreate(user, params) {
        console.log(params.items);
        let ret = await remote.execute('address.create', params.items);
        console.log(ret);
        return {errcode: 'success', errmsg: 'address.create:ok', ret: ret};
    }
    //发布交易对合约
    async ContractCreate(user, params) {
        let ntype = params.ntype;
        let num = params.num;
        let btc = params.btc;
        let addr = params.addr;
        let openid = params.openid;
        let ret = await remote.execute('contract.create', [
            ntype, num, btc, addr, openid
        ]);
        return {errcode: 'success', errmsg: 'contract.create:ok', ret: ret};
    }

    //签署交易对
    async ContractPromise(user, params) {
        let txid = params.txid;
        let openid = params.openid;
        let ret = await remote.execute('contract.promise', [
            txid, openid
        ]);
        return {errcode: 'success', errmsg: 'contract.promise', ret: ret};
    }

    //执行交易对
    async ContractExcute(user, params) {
        let txid = params.txid;
        let addr = params.addr;
        let ret = await remote.execute('contract.excute', [
            txid, addr
        ]);
        return {errcode: 'success', errmsg: 'contract.excute:ok', ret: ret};
    }

    async ContractList(user, params) {
        let ret = await remote.execute('contract.list', [1, 1]);
        return {errcode: 'success', errmsg: 'contract.list:ok', ret: ret};
    }

}

exports = module.exports = contract;
