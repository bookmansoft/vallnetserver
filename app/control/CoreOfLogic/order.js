let facade = require('gamecloud')
let wxUnifiedorder = require('../../util/wxUnifiedorder');
let tableType = require('../../util/tabletype');
let VipHelp = require('../../util/viphelp');
const gamegoldHelp = require('../../util/gamegoldHelp');
let userHelp = require('../../util/userhelp')
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
        let ret = await gamegoldHelp.execute('order.pay', [
            cid, //game_id
            user_id, //user_id
            sn, //order_sn订单编号
            price, //order_sum订单金额
            account  //指定结算的钱包账户，一般为微信用户的openid
          ]);
        console.log(ret.result);
        if(ret.result == null) {
            return {errcode: 'faile', errmsg: 'pay error'};
        } else {
            return {errcode: 'success', errmsg: 'orderpay:ok', ret: ret.result};
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
        let attach = params.attach
        let quantity = params.quantity
        let current_time = parseInt(new Date().getTime() / 1000)
        let tradeId = wxUnifiedorder.getTradeId('bgw')
        let orderItem = {
            uid: uid,
            order_sn: tradeId,
            order_num: price,
            product_id: productId,
            product_info: productIntro,
            attach: attach,
            quantity: quantity,
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
                if (order.orm.product_id < 10) {
                    let vip_level =  order.orm.product_id
                    uid = order.orm.uid
                    let vipHelp = new VipHelp()
                    vipHelp.recharge(uid, vip_level)
                } else if (!!order.orm.attach) {
                    let cid = order.orm.attach
                    let quantity = order.orm.quantity
                    let uhelp = new userHelp()
                    let addr = uhelp.getAddrFromUserIdAndCid(uid, cid)
                    await gamegoldHelp.execute('stock.send', [cid, quantity, addr, 'alice']);

                    let stock = facade.GetObject(tableType.stock, order.orm.product_id);          
                    if(!!stock) {
                        stock.setAttr('support', stock.orm.support+1);
                        stock.setAttr('remainder', stock.orm.remainder - quantity);
                        stock.orm.save()
                        
                        let userStockLogItem = {
                            uid: uid,
                            cid: cid,
                            quantity: quantity,
                            pay_at: current_time,
                            status: 1
                        }
                        await facade.GetMapping(tableType.userStockLog).Create(userStockLogItem)

                        let userStockItems = facade.GetMapping(tableType.userStock).groupOf().where([
                            ['uid', '==', uid],
                            ['cid', '==', cid]
                        ]).records();
                        if(userStockItems.length >0 ) {
                            let userStockItem = userStockItems[0]
                            userStockItem.setAttr('amount', userStockItem.orm.amount + amount)
                            userStockItem.setAttr('quantity', userStockItem.orm.quantity + quantity)
                            userStockItem.setAttr('pay_at', current_time)
                            userStockItem.orm.save()
                        } else {
                            let userStockItem = {
                                uid: uid,
                                cid: cid,
                                gamegold: 0,
                                amount: order.orm.order_num,
                                quantity: quantity,
                                pay_at: current_time,
                                order_sn: order.orm.order_sn,
                                status: 1,
                                src: stock.orm.item_pic,
                                title: stock.orm.cname
                            }
                            await facade.GetMapping(tableType.userStock).Create(userStockItem)
                        }

                    }
                    return {code: -1};
                }

            }
            return {errcode: 'success', errmsg: 'result:ok'}; 
        } else {
            return {errcode: 'error', errmsg: 'no order'};
        }
    }
}

exports = module.exports = order;
