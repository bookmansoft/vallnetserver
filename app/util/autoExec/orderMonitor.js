let facade = require('gamecloud')
let {EntityType, TableField, PurchaseStatus} = facade.const

/**
 * 网络连接监控任务对象
 * 在系统启动时，会创建一个唯一的网络连接监控对象，并持久保存在缓存列表中
 */
class orderMonitor
{
    constructor(){
        this.id = 'order.monitor';  //特殊任务编号
    }

    /**
     * 执行逻辑
     * @return
     *      true    ：状态失效，监控任务将被移出队列，不再接受检测
     *      false   ：状态有效，监控任务继续停留在队列中，接受后续检测
     */
    async execute(core) {
        console.log('订单状态定时检测');

        try {
            //1. 列表所有订单
            let muster = core.GetMapping(EntityType.BuyLog)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                //.where([['result', 'include', [PurchaseStatus.prepay, PurchaseStatus.cancel]]])
                .orderby('id', 'desc') //根据id字段倒叙排列
                .paginate(-1, 1)
                .records(TableField.BuyLog);

            //2. 依次调用接口，查询订单状态
            for(let item of muster) {
                switch(item.result) {
                    case PurchaseStatus.prepay: {
                        let timespan = Date.parse(new Date())/1000 - Date.parse(new Date(item.updatedAt))/1000;
                        if(timespan > 300) { //超时 5 分钟未处理，发起主动查询
                            let result = await core.service.wechat.orderQuery({inner: item.trade_no}); //  inner: ty_bgw_155702573788578497, outer: 4200000307201905050801142091
                            if(!!result) {
                                //触发事件，进行相应的后续处理
                                if(!result.out_trade_no) {
                                    result.out_trade_no = item.trade_no;
                                }
                                core.notifyEvent('wallet.payCash', {data: result});
                            }
                        }
                        break;
                    }

                    case PurchaseStatus.cancel: {
                        //移除失效订单
                        //@warning 此处并未从数据库真正删除，因此有可能会造成数据不断堆叠，需要进一步考量
                        core.GetMapping(EntityType.BuyLog).Delete(item.id, false);
                        break;
                    }
                }
            }
        } catch(e) {
            console.log('orderMonitor', e.message);
        }

        return false;
    }
}

module.exports = orderMonitor;