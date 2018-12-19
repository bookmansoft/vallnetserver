let facade = require('gamecloud')
let {ReturnCode, NotifyType} = facade.const
let remoteSetup = require('../../util/gamegold');
//引入工具包
const toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
const remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch'))  
remote.setup(remoteSetup);

/**
 * 节点控制器--订单
 * Updated by thomasFuzhou on 2018-11-19.
 */
class order extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 订单支付
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async OrderPay(user, params) {
        let cid = params.cid;
        let uid = params.uid;
        let openid = params.openid;
        let sn = params.sn;
        let price = params.price;
        console.log(params);
        let ret = await remote.execute('order.pay', [
            cid, //game_id
            uid, //user_id
            sn, //order_sn订单编号
            price, //order_sum订单金额
            openid  //指定结算的钱包账户，一般为微信用户的openid
          ]);
        console.log(ret);
        return {errcode: 'success', errmsg: 'orderpay:ok', ret: ret};
    }
}

exports = module.exports = order;
