let facade = require('gamecloud');
let {EntityType, IndexType, PurchaseStatus} = facade.const;

/**
 * Created by liub on 2019.06.05
 * 现金订单支付事件
 * @description 目前订单回调处理、主动查询都是以逻辑服为单位进行处理的，未来也可以考虑假设专有节点，集中处理所有订单
 */
function handle(data) { 
    let record = data.data;

    if(record.return_code != 'SUCCESS') { //通讯失败
        return;
    }

    let order = this.GetObject(EntityType.BuyLog, record.out_trade_no, IndexType.Domain);
    if(!!order) { //查找订单失败
        if(record.result_code != 'SUCCESS') { 
            //查询失败，对特定错误进行处理
            if(record.err_code == 'ORDERNOTEXIST') {
                order.setAttr('result', PurchaseStatus.cancel); //将订单设置为报废，不会再次查询该订单后续状态
            }
        } else { //查询成功
            //test only
            let user = this.GetObject(EntityType.User, order.getAttr('domainid'), IndexType.Domain);
            if(user) {
                user.getBonus(order.getAttr('product'), true);
            }
            //end

            if(record.trade_state == 'SUCCESS') {
                if(order.orm.result !== PurchaseStatus.commit) {
                    order.setAttr('result', PurchaseStatus.commit);
                    order.orm.save(); //强制保存到数据库，确保不会重复处理
        
                    //实际处理订单内容
                    let user = this.GetObject(EntityType.User, order.getAttr('domainid'), IndexType.Domain);
                    if(user) {
                        user.getBonus(order.getAttr('product'), true);
                    }
                }
            } else {
                order.setAttr('result', PurchaseStatus.cancel); //将订单设置为报废，不会再次查询该订单后续状态
           }
        }
    }
}

module.exports.handle = handle;