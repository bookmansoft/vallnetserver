let facade = require('gamecloud');
let {EntityType, IndexType, PurchaseStatus, em_Condition_Type} = facade.const;

/**
 * Created by liub on 2019.06.05
 * 现金订单支付事件
 * @description 目前订单回调处理、主动查询都是以逻辑服为单位进行处理的，未来也可以考虑假设专有节点，集中处理所有订单
 */
async function handle(data) { 
    // {
    //     shash: "6b1e0083b14c1ef1a2b62c7589e267dbf546be5f1a053cfce57777761231f2c5",
    //     sidx: 0,
    //     bob: "tb1qcd8gmllhy0vupnp6h72p9w8fp0r3f8n4hs4tum",
    //     body: {
    //       alice: "tb1q50ux05c9gqz0k7mt9qme4swvvhn6jdy27cr80p",
    //       sn: "d8604f40-ba6f-11ed-ab53-8d1c16b6d27f",
    //     },
    //     wid: 1,
    //     account: "default",
    // }    

    let order = this.GetObject(EntityType.BuyLog, data.data.body.sn, IndexType.Domain);
    if(!!order) {
        if(order.orm.result !== PurchaseStatus.commit) {
            //实际处理订单内容
            let user = this.GetObject(EntityType.User, order.getAttr('domainid'), IndexType.Domain);
            if(user) {
                user.getBonus(order.getAttr('product'), false);
            }

            order.setAttr('result', PurchaseStatus.commit);
            order.orm.save(); //强制保存到数据库，确保不会重复处理

            this.notifyEvent('user.task', {user:user, data:{type:em_Condition_Type.totalPurchase, value: order.getAttr('total_fee')/10}});
            this.notifyEvent('user.afterPurchase', {user:user, amount: order.getAttr('total_fee')});
        }
    }
}

module.exports.handle = handle;