/**
 * 关卡操作类型
 */
const OperEnum = {
    Require: 0,         //查询
    Start: 1,           //开始
    PassTollgate: 2,    //提交结果
    Sweep: 3,           //扫荡
    SweepBonus: 4,      //领取扫荡奖励
    StartCatch: 5,      //抓捕开始
    Catch:6,            //抓捕结束
    StartEscape: 7,     //起义开始
    Escape:8,           //起义结束
};

/**
 * 受限行为类型
 */
const ActionExecuteType = {
    AE_Login: 1,              //每日可累计登录次数
    AE_SocialOfFail: 2,       //每日可以进行失败分享的次数
    AE_SocialOfAction: 3,     //每日可以赠送体力分享的次数
    AE_SocialOfSuper: 4,      //每日可以进行胜利超越分享的次数
    AE_SlaveCatch:5,          //每日可以进行抓捕奴隶的次数
    AE_SlaveEscape:6,         //每日可以进行起义的次数
    slaveFood: 7,             //奴隶：给奴隶加餐
    slaveAvenge: 8,           //奴隶：报复
    slaveFlattery: 9,         //奴隶：谄媚
    slaveCommend: 10,         //奴隶：表扬
    slaveLash: 12,            //奴隶：鞭挞 - 随机奖励
    vipDaily: 21,             //VIP：领取每日奖励
};

exports = module.exports = {
    OperEnum: OperEnum,
    ActionExecuteType: ActionExecuteType,
};
