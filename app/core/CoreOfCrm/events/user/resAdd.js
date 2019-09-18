let facade = require('gamecloud')
let {NotifyType, ResType, ActivityType,em_Condition_Type,em_Condition_Checkmode} = facade.const
let EventData = facade.Util.EventData
let LargeNumberCalculator = facade.Util.LargeNumberCalculator

/**
 * 添加资源消息句柄
 * @param {EventData} event 
 */
function handle(event){ //用户资源发生变化
    switch(event.data.type){ //后续处理
        case ResType.Coin:
            //任务检测
            this.notifyEvent('user.task', {user:event.user, data:{type:em_Condition_Type.totalSpendMoney, value:event.data.value}})
            //累计分段积分
            this.service.activity.addScore(event.user.id, ActivityType.Money, event.data.value);
            break;

        case ResType.Diamond:
            if(event.data.value < 0){ //消费了钻石
                //任务检测
                this.notifyEvent('user.task', {user:event.user, data:{type:em_Condition_Type.totalSpendDiamond, value:-event.data.value}});
                //累计分段积分
                this.service.activity.addScore(event.user.id, ActivityType.Diamond, -event.data.value);
            }

            //将当前钻石数量同步到单独的字段上以便于统计分析
            event.user.diamond = event.user.getPocket().GetRes(ResType.Diamond);
            
            break;

        case ResType.Action:
            event.user.baseMgr.item.AutoAddAP(); //检测体力自动恢复
            if(event.data.value < 0){
                //任务检测
                this.notifyEvent('user.task', {user:event.user, data:{type:em_Condition_Type.useAction, value:-event.data.value}});
                //累计分段积分
                this.service.activity.addScore(event.user.id, ActivityType.Action, -event.data.value);
            }
            break;
    }

    event.user.notify({type: NotifyType.action, info: event.user.getPocket().getActionData()});
}

module.exports.handle = handle;
