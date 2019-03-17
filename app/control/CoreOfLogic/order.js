let facade = require('gamecloud')
let wxUnifiedorder = require('../../util/wxUnifiedorder');
let remoteSetup = require('../../util/gamegold');
let tableType = require('../../util/tabletype');
let VipHelp = require('../../util/viphelp');
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
        let user_id = params.user_id;
        let account = params.account;
        let sn = params.sn;
        let price = params.price;
        console.log(params);
        let ret = await remote.execute('order.pay', [
            cid, //game_id
            user_id, //user_id
            sn, //order_sn订单编号
            price, //order_sum订单金额
            account  //指定结算的钱包账户，一般为微信用户的openid
          ]);
        console.log(ret);
        if(ret == null) {
            return {errcode: 'faile', errmsg: 'pay error'};
        } else {
            return {errcode: 'success', errmsg: 'orderpay:ok', ret: ret};
        }
    }

    /**
     * 普通订单下单
     */
    async CommonOrderRepay(user, params) {
        let uid = params.uid
        let price = params.price
        let productId = params.productId
        let productIntro = params.productIntro
        let current_time = parseInt(new Date().getTime() / 1000)
        let tradeId = wxUnifiedorder.getTradeId('bgw')
        let orderItem = {
            uid: uid,
            order_sn: tradeId,
            order_num: price,
            product_id: productId,
            product_info: productIntro,
            order_status: 0,
            pay_status: 0,
            create_time: current_time,
            update_time: 0,
        };
        await facade.GetMapping(tableType.order).Create(orderItem);
        //return {errcode: 'success', errmsg: 'order:ok', tradeId: tradeId};
        return {errcode: 'success', errmsg: 'order:ok', tradeId: tradeId, order:orderItem};
    }

    async OrderStatus(user, params) {
        let uid = params.uid
        let tradeId = params.tradeId
        let userOrders = facade.GetMapping(tableType.order).groupOf().where([['order_sn', '==', tradeId]]).records();
        if(userOrders.length >0 ) {
            let order = userOrders[0];
            return {errcode: 'success', errmsg: 'order:ok', order: order.orm};
        } else {
            return {errcode: 'fail', errmsg: 'order:error'};
        }
    }

    async OrderPayResutl(user, params) {
        let uid = params.uid
        let tradeId = params.tradeId
        let status = params.status

        let userOrders = facade.GetMapping(tableType.order).groupOf().where([['order_sn', '==', tradeId]]).records();
        if(userOrders.length >0 ) {
            let order = userOrders[0]
            let current_time = parseInt(new Date().getTime() / 1000)
            order.setAttr('pay_status', status)
            order.setAttr('update_time', current_time)
            order.orm.save()
            if(status==1) { //支付成功 
                let vip_level =  order.orm.product_id
                uid = order.orm.uid
                let vipHelp = new VipHelp()
                vipHelp.recharge(uid, vip_level)
            }
            return {errcode: 'success', errmsg: 'result:ok'}; 
        } else {
            return {errcode: 'error', errmsg: 'no order'};
        }
    }
}

exports = module.exports = order;
