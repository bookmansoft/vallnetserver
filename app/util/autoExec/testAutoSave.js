let facade = require('gamecloud')

/**
 * VIP监控任务对象
 * 在系统启动时，会为所有VIP用户创建监控对象，然后定期监控用户VIP有效性，失效时返回true，此后该监控任务将被从列表中移除
 */
class testAutoSave
{
    /**
     * 构造函数
     * @param {*}  监控对象ID
     */
    constructor($id){
        this.id = `test.${$id}`;    //设置任务ID
        this.aid = $id;             //设置记录ID
    }

    /**
     * 执行逻辑。
     * @return {Boolean} 
     *      true    ：状态失效，监控任务将被移出队列，不再接受检测
     *      false   ：状态有效，监控任务继续停留在队列中，接受后续检测
     */
    execute(fo){
        let ao = facade.GetObject(101, this.aid);   //根据记录ID查询对应的记录
        if (!!ao) {
            if(ao.dirty) { //脏数据检测
                ao.Save();
            }
            return false;
        }
        return true;
    }
}

exports = module.exports = testAutoSave;
