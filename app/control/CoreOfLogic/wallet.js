let facade = require('gamecloud')

//引入工具包
const toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
const remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch'));  
remote.setup({
        type:   'testnet',
        ip:     '114.116.14.176',     //远程服务器地址
        head:   'http',               //远程服务器通讯协议，分为 http 和 https
        id:     'primary',            //默认访问的钱包编号
        apiKey: 'bookmansoft',        //远程服务器基本校验密码
        cid:    'xxxxxxxx-game-gold-root-xxxxxxxxxxxx', //授权节点编号，用于访问远程钱包时的认证
        token:  '03aee0ed00c6ad4819641c7201f4f44289564ac4e816918828703eecf49e382d08', //授权节点令牌固定量，用于访问远程钱包时的认证
});

/**
 * 钱包
 * Updated by thomasFuzhou on 2018-11-19.
 */
class wallet extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        console.log('wallet middleware');
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 创建一个收款地址：address.create 不需要参数
     * 
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async AddressCreate(user, paramGold) {
        console.log(paramGold.items);
        let ret = await remote.execute('address.create', paramGold.items);
        console.log(ret);
        return {errcode: 'success', errmsg: 'address.create:ok', ret: ret};
    }

    /**
     * 根据输入的金额和地址，创建、签署、发送一笔P2PKH类转账交易：
     * 【钱包-转出功能使用】
     * tx.send addr value [openid]
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async TxSend(user, params) {
        let addr = params.addr;
        let amount = params.amount;
        let openid = params.openid;
        let ret = await remote.execute('tx.send', [
            addr, 
            amount,
            openid
        ]);      
        console.log(ret);
        return {errcode: 'success', errmsg: 'tx.send:ok', ret: ret}; 
    }

    /**
     * 查询账户余额
     * balance.all [openid]
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
     async BalanceAll(user, params) {
        let openid = params.openid;
        let ret = await remote.execute('balance.all', [
            openid //openid
        ]);    
        console.log(ret);
        return {errcode: 'success', errmsg: 'balance.all:ok', balance: ret}; 
    }

    /**
     * 查询交易记录
     * tx.list openid [number]
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async TxLogs(user, params) {
        let openid = params.openid;
        let number = 10000;
        let ret = await remote.execute('tx.list', [
            openid, 
            number
        ]);    
        console.log(ret);
        return {errcode: 'success', errmsg: 'tx.list:ok', list: ret};           
    }

}

exports = module.exports = wallet;
