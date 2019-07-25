let facade = require('gamecloud');
let {EntityType, IndexType, PurchaseStatus} = facade.const;

/**
 * Created by liub on 2019.06.05
 * 现金订单支付事件
 */
function handle(data) { 
    if(data.data.return_code != 'SUCCESS') { //通讯失败
        return;
    }

    let order = this.GetObject(EntityType.BuyLog, data.data.out_trade_no, IndexType.Domain);
    if(!!order) { //查找订单失败
        if(data.data.result_code != 'SUCCESS') { 
            //查询失败，对特定错误进行处理
            if(data.data.err_code == 'ORDERNOTEXIST') {
                order.setAttr('result', PurchaseStatus.cancel); //将订单设置为报废，不会再次查询该订单后续状态
            }
        } else { //查询成功
            if(data.data.trade_state == 'SUCCESS') {
                if(order.orm.result !== PurchaseStatus.commit) {
                    order.setAttr('result', PurchaseStatus.commit);
                    order.orm.save();
        
                    //实际处理订单内容，此处处理过后，订单不会被再次处理
                }
            } else {
                order.setAttr('result', PurchaseStatus.cancel); //将订单设置为报废，不会再次查询该订单后续状态
           }
        }
    }
}

module.exports.handle = handle;