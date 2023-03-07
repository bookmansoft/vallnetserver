/**
 * Created by liub on 2017-05-26.
 */
let facade = require('gamecloud')
let {GetResType, NotifyType, UserStatus,em_Condition_Type} = facade.const

/**
 * 用户登录后，用来执行一些后续操作，例如获取腾讯会员信息、蓝钻特权等
 * @note 事件处理函数，this由外部注入，指向Facade
 * @param data
 */
async function handle(data){
    data.user.loginTime = facade.util.now(); //记录登录时间

    data.curTime = new Date();//记录当前时间，为后续流程提供统一的时间标尺
    switch(data.user.domainType){
        default: {
            break;
        }
    }
    let d1 = data.curTime.toDateString();
    let d2 = data.user.getRefreshDate(); //缓存用户最近登录日期, 因为checkDailyData会修改该数值，而该数值后续判断还需要使用
    //todo:判断是否开启七夕活动
    this.remoteService('dailyactivity.CheckButtonStatus',[data.user.domain, data.user.openid]);

    //如果跨天推送一条消息
    if(d1 != d2){
        data.user.notify({type:NotifyType.DailyEvent});
    }

    //检测用户跨天数据
    data.user.checkDailyData(d1);

    //记录用户登录行为
    if(data.user.getActionMgr().Execute(this.const.ActionExecuteType.AE_Login, 1, true)){
        //记录累计登录
        this.notifyEvent('user.task', {user:data.user, data:{type:em_Condition_Type.totalLogin, value:1}});
        if(Date.parse(data.curTime)/1000 - Date.parse(d2)/1000 < 3600*48){
            //记录连续登录
            this.notifyEvent('user.task', {user:data.user, data:{type:em_Condition_Type.loginContinue, value:1}});
        }
    }

    data.user.baseMgr.info.SetStatus(UserStatus.online, false);

    //刷新资源、体力值
    data.user.baseMgr.vip.checkActivityStatus();//检测并修复排名活动的相关信息
    data.user.baseMgr.item.AutoAddAP();//	刷新体力

    data.user.notify({type: NotifyType.actions, info: data.user.getActionMgr().getInfo()});
}

module.exports.handle = handle;