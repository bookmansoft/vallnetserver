let facade = require('gamecloud')
let {EntityType, TableField} = facade.const

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
     * 执行逻辑。
     * @return
     *      true    ：状态失效，监控任务将被移出队列，不再接受检测
     *      false   ：状态有效，监控任务继续停留在队列中，接受后续检测
     */
    async execute(core) {
        console.log('订单状态定时检测');

        //1. 从数据库查询所有未确认订单
        let muster = core.GetMapping(EntityType.BuyLog)
            .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
            .where([['result', ['1']]])
            .orderby('id', 'desc') //根据id字段倒叙排列
            .paginate(-1, 1)
            .records(TableField.BuyLog);

        //2. 依次调用接口，查询订单状态
        for(let item of muster) {
            let result = await core.service.wechat.orderQuery({inner: item.trade_no}); //  ty_bgw_155702573788578497 4200000307201905050801142091
            if(!!result) {
                //触发事件，进行相应的后续处理
                if(!result.out_trade_no) {
                    result.out_trade_no = item.trade_no;
                }
                core.notifyEvent('wallet.payCash', {data: result});
            }
        }

        return false;
    }
}

module.exports = orderMonitor;