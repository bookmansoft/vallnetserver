let facade = require('gamecloud')
let {NotifyType, ReturnCode, UserStatus, PurchaseStatus, EntityType, IndexType} = facade.const

/**
 * Created by liub on 2019.06.05
 */
function handle(event) { 
    //用户订单支付成功，对应服务端的 order.pay
    let tradeNo = event.data.trade_no;
    let total_fee = event.data.price;

    let item = this.GetObject(EntityType.BuyLog, tradeNo, IndexType.Domain);
    if (!item || item.getAttr('trade_no') != tradeNo || item.getAttr('total_fee') != total_fee || item.getAttr('result') == PurchaseStatus.cancel) {
        console.log('[trade not exist]');
        return {code: ReturnCode.illegalData};
    }

    if(item.getAttr('result') == PurchaseStatus.commit) { //已经处理完毕的重复订单, 直接返回
        return {code: ReturnCode.Success};
    }

    let pUser = this.GetObject(EntityType.User, item.getAttr('domainid'), IndexType.Domain);
    if(!pUser) {
        return {code: ReturnCode.userIllegal};
    }

    //设置首充标记,单笔金额必须大于等于60
    if(total_fee >= 60) {
        if(!pUser.baseMgr.info.CheckStatus(UserStatus.isFirstPurchase)){
            pUser.baseMgr.info.SetStatus(UserStatus.isFirstPurchase);
            pUser.baseMgr.info.UnsetStatus(UserStatus.isFirstPurchaseBonus);
        }
    }

    pUser.getBonus(item.getAttr('product'));
    item.setAttr('result', PurchaseStatus.commit);

    //向客户端下行购买成功通知
    pUser.notify({type: NotifyType.buyItem, info:{tradeNo: item.getAttr('trade_no'), product: item.getAttr('product')}});

    return {code: ReturnCode.Success};
}

module.exports.handle = handle;