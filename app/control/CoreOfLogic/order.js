let facade = require('gamecloud')
let {TableType} = facade.const;

/**
 * 节点控制器--订单
 * Updated by thomasFuzhou on 2018-11-19.
 */
class order extends facade.Control
{
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
        let ret = await this.core.service.gamegoldHelper.execute('order.pay', [
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
        let uid = user.id
        let price = params.price
        let productId = params.productId
        let productIntro = params.productIntro
        let attach = params.attach
        let quantity = params.quantity
        let current_time = parseInt(new Date().getTime() / 1000)
        let tradeId = this.core.service.wechat.getTradeId('bgw')
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
        await this.core.GetMapping(TableType.order).Create(orderItem);
        return {errcode: 'success', errmsg: 'order:ok', tradeId: tradeId, order:orderItem};
    }

    async OrderStatus(user, params) {
        let tradeId = params.tradeId
        let userOrders = this.core.GetMapping(TableType.order).groupOf().where([['order_sn', '==', tradeId]]).records();
        if(userOrders.length >0 ) {
            let order = userOrders[0];
            return {errcode: 'success', errmsg: 'order:ok', order: order.orm};
        } else {
            return {errcode: 'fail', errmsg: 'order:error'};
        }
    }

    /**
     * 收到支付完成请求
     * @param {*} user 
     * @param {*} params 
     */
    async OrderPayResult(user, params) {
        let uid = user.id
        let tradeId = params.tradeId
        let status = params.status

        let userOrders = this.core.GetMapping(TableType.order).groupOf().where([['order_sn', '==', tradeId]]).records();
        if(userOrders.length >0 ) {
            let order = userOrders[0]
            let current_time = parseInt(new Date().getTime() / 1000)
            order.setAttr('pay_status', status)
            order.setAttr('update_time', current_time)
            if(status==1) { //支付成功 
                if (order.orm.product_id < 10) {
                    let vip_level =  order.orm.product_id;

                    // `vip_level` INT(4) 'VIP等级',
                    // `vip_start_time` INT(8) 'VIP开始时间',
                    // `vip_end_time` INT(8) 'VIP结束时间',
                    // `vip_last_get_time` INT(8) 'VIP获取福利时间',
                    // `is_expired` INT(1) '是否过期',
                    // `vip_last_get_count` INT(8) 'VIP获取数量',
                    // `vip_usable_count` INT(8) 'VIP可用游戏金',
                    let current_time = parseInt(new Date().getTime() / 1000)
                    let month_time =  3600 * 24 * 30;
            
                    if(user.baseMgr.info.getAttr('is_expired') == 1) {   //过期，重新开卡
                        user.baseMgr.info.setAttr('vip_start_time', current_time);
                        user.baseMgr.info.setAttr('vip_end_time', current_time + month_time);
                        user.baseMgr.info.setAttr('vip_last_get_time', current_time);
                        user.baseMgr.info.setAttr('vip_last_get_count', 0);
                        user.baseMgr.info.setAttr('vip_level', vip_level);
                        user.baseMgr.info.setAttr('is_expired', 0);
                    } else if(user.baseMgr.info.getAttr('vip_level') == vip_level) {     //续费
                        user.baseMgr.info.setAttr('vip_end_time', user.baseMgr.info.getAttr('vip_end_time' + month_time));
                    } else if(user.baseMgr.info.getAttr('vip_level') < vip_level) {      //升级
                        user.baseMgr.info.setAttr('vip_level', vip_level);
                    }
                } else if (!!order.orm.attach) {
                    let cid = order.orm.attach;
                    let quantity = order.orm.quantity;
                    let addr = await this.core.service.userhelp.getAddrFromUserIdAndCid(uid, cid);
                    await this.core.service.gamegoldHelper.execute('stock.send', [cid, quantity, addr, 'alice']);

                    let stock = this.core.GetObject(TableType.stock, order.orm.product_id);          
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
                        await this.core.GetMapping(TableType.userstocklog).Create(userStockLogItem)

                        let userStockItems = this.core.GetMapping(TableType.userstock).groupOf().where([
                            ['uid', '==', uid],
                            ['cid', '==', cid]
                        ]).records();
                        if(userStockItems.length >0 ) {
                            let userStockItem = userStockItems[0]
                            userStockItem.setAttr('amount', userStockItem.orm.amount + order.orm.order_num)
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
                            await this.core.GetMapping(TableType.userstock).Create(userStockItem)
                        }

                    }
                }

            }
            return {errcode: 'success', errmsg: 'result:ok'}; 

        } else {
            return {errcode: 'error', errmsg: 'no order'};
        }
    }
}

exports = module.exports = order;
