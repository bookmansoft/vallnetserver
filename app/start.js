const facade = require('gamecloud')
const {monitor} = require('./util/gamegoldHelp')

//加载用户自定义模块
facade.addition = true;

let env = !!process.env.sys ? JSON.parse(process.env.sys) : {
    serverType: "IOS",      //待调测的服务器类型
    serverId: 1,            //待调测的服务器编号
    portal: true            //兼任门户（充当索引服务器），注意索引服务器只能有一台，因此该配置信息具有排他性
};  

if(env.constructor == String) {
    env = JSON.parse(env);
}

//系统主引导流程，除了必须传递运行环境变量 env，也可以搭载任意变量，这些变量都将合并为核心类的options对象的属性，供运行时访问
if(env.portal) { //如果该服务器兼任门户，则启动索引服务
    facade.boot({
        env:{
            serverType: "Index",
            serverId: 1
        }
    });
}

facade.boot({
    env: env,
    //指示加载自定义数据库表
    loading: [
        101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 131, 132, 133, 134, 135, 136
    ],
    //设置静态资源映射
    static: [['/client/', './web/client']], 
});

//单独维护一个到公链的长连接，进行消息监控
monitor.setlongpoll(async (env) =>  {
    env.remote.watch(msg => {
        //收到新的道具，或者已有道具发生变更，抛出内部事件, 处理流程定义于 app/events/user/propReceive.js
        facade.current.notifyEvent('user.propReceive', {data:msg});
    }, 'prop/receive');

    env.remote.watch(msg => {
        //收到发布的道具被成功拍卖后的通知，抛出内部事件, 处理流程定义于 app/events/user/propAuction.js
        facade.current.notifyEvent('user.propAuction', {data:msg});
    }, 'prop/auction');

    env.remote.watch(msg => {
        //收到通告，抛出内部事件, 处理流程定义于 app/events/user/receiveNotify.js
        facade.current.notifyEvent('user.receiveNotify', {data:msg});
    }, 'notify/receive');

    env.remote.watch(msg => {
        //收到子账户余额变动通知，抛出内部事件, 处理流程定义于 app/events/user/balanceChange.js
        facade.current.notifyEvent('user.balanceChange', {data:msg});
    }, 'balance.account.client');

    env.remote.watch(msg => {
        //用户执行 order.pay 之后，CP特约节点发起到账通知消息，抛出内部事件, 处理流程定义于 app/events/user/orderPay.js
        facade.current.notifyEvent('user.orderPay', {data:msg});
    }, 'order.pay');
})

monitor.execute('block.tips', []).then( async (ret) => {
    await (async (time) => {return new Promise(resolve => {setTimeout(resolve, time);});})(500);
    //以数组方式，订阅多个类型的消息。注意 balance.account.client 这样的消息是默认发送的，不需要订阅
    monitor.execute('subscribe', [
        'prop/receive',         //收到新的道具
        'prop/auction',         //道具拍卖成交
        'notify/receive',       //收到通告
    ]).then(ret => {
        console.log(ret);
    });
});

// 定时查询红包接口
/*
facade.current.autoTaskMgr.addCommonMonitor(
    ()=> {
        let redpackList = facade.GetMapping(tableType.redpack).groupOf().records(tableField.redpack);
        console.log(redpackList)
    }, 1000
)
*/
