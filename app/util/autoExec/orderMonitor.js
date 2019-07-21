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
    execute(core) {
        console.log('订单状态定时检测');

        //todo 1. 从数据库查询所有未确认订单
        //todo 2. 依次调用接口，查询订单状态
        //let ret = await core.service.wechat.orderQuery('4200000307201905050801142091');
        //todo 3. 根据接口返回修订订单状态，并进行相应的后续处理
    
        return false;
    }
}

module.exports = orderMonitor;