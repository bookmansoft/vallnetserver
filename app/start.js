const facade = require('gamecloud')
//加载用户自定义模块 - 这句必须紧跟在模块引入语句之后
facade.addition = true;

let {IndexType} = facade.const
let tableType = require('./util/tabletype');

//新增一种索引类型，需要在 UserEntity.prototype.IndexOf 函数中增加字段映射
IndexType.Phone = 1001;

let env = !!process.env.sys ? JSON.parse(process.env.sys) : {
    serverType: "IOS",      //待调测的服务器类型
    serverId: 1,            //待调测的服务器编号
    portal: true            //兼任门户（充当索引服务器），注意索引服务器只能有一台，因此该配置信息具有排他性
};  

if(env.constructor == String) {
    env = JSON.parse(env);
}

// //新增Auth服务器，请参照 gameconfig-backup 对 gameconfig 文件进行相应配置
// facade.boot({
//     env:{
//         serverType: "Auth",
//         serverId: 1
//     }
// });

//系统主引导流程，除了必须传递运行环境变量 env，也可以搭载任意变量，这些变量都将合并为核心类的options对象的属性，供运行时访问
if(env.portal) { //如果该服务器兼任门户，则启动索引服务
    facade.boot({
        env:{
            serverType: "Index",
            serverId: 1
        }
    });
}

//加载资源管理节点
facade.boot({
    env:{
        serverType: "Resource",
        serverId: 1
    },
    //设置静态资源映射
    static: [
        ['/image', './web/image']
    ], 
});

//加载CRM管理节点
facade.boot({
    env: {
        serverType: "CRM",
        serverId: 1
    },
    //指示加载自定义数据库表
    loading: [
        tableType.test, 
        tableType.cp,
        tableType.propEntity,
        tableType.cpType,
        tableType.RedpacketEntity,
        tableType.PrizeEntity,
        tableType.cpfunding,
        tableType.CpStockEntity,
        tableType.CpStockBaseEntity,         
    ],
    //设置静态资源映射
    static: [
        ['/', './web/dist']
    ], 
}, core => {
    //单独维护一个到公链的长连接，进行消息监控
    core.service.monitor.setlongpoll().execute('block.tips', []).then( async (ret) => {
        await (async (time) => {return new Promise(resolve => {setTimeout(resolve, time);});})(500);

        core.service.monitor.remote.watch(msg => {
            //收到通告，抛出内部事件, 处理流程定义于 app/events/user/receiveNotify.js
            core.notifyEvent('user.receiveNotify', {data:msg});
        }, 'notify/receive').execute('subscribe', 'notify/receive');
    });
});

// //加载游戏管理节点
// facade.boot({
//     env: {
//         serverType: "Chick",
//         serverId: 1
//     },
//     //设置静态资源映射
//     static: [['/chick/', './web/game/chick']], 
// });

//加载Wallet管理节点
facade.boot({
    env: env,
    //指示加载自定义数据库表
    loading: [
        tableType.test, 
        tableType.userWallet, 
        tableType.blockGameCate,
        tableType.blockGame, 
        tableType.blockGameProp, 
        tableType.blockGameProvider, 
        tableType.cpUser, 
        tableType.cpProp, 
        tableType.cpOrder, 
        tableType.userGame, 
        tableType.userProp, 
        tableType.order, 
        tableType.vipdraw, 
        tableType.vip, 
        tableType.blockNotify, 
        tableType.redpack, 
        tableType.redpackAct, 
        tableType.userRedPack, 
        tableType.userRedPackAct, 
        tableType.blockGameComment, 
        tableType.manySend, 
        tableType.manyReceive, 
        tableType.mobileVerify, 
        tableType.stock, 
        tableType.userStock, 
        tableType.userStockLog,
        tableType.stockbulletin, 
        tableType.stockBase,
    ],
    //设置静态资源映射
    static: [['/client/', './web/client']], 
}, core => {
    //单独维护一个到公链的长连接，进行消息监控
    core.service.monitor.setlongpoll().execute('block.tips', []).then( async (ret) => {
        await (async (time) => {return new Promise(resolve => {setTimeout(resolve, time);});})(500);

        //订阅消息并登记消息处理句柄
        core.service.monitor.remote.watch(msg => {
            //收到新的道具，或者已有道具发生变更，抛出内部事件, 处理流程定义于 app/events/user/propReceive.js
            core.notifyEvent('user.propReceive', {data:msg});
        }, 'prop/receive').execute('subscribe', 'prop/receive');

        core.service.monitor.remote.watch(msg => {
            //收到发布的道具被成功拍卖后的通知，抛出内部事件, 处理流程定义于 app/events/user/propAuction.js
            core.notifyEvent('user.propAuction', {data:msg});
        }, 'prop/auction').execute('subscribe', 'prop/auction');

        core.service.monitor.remote.watch(msg => {
            //收到通告，抛出内部事件, 处理流程定义于 app/events/user/receiveNotify.js
            core.notifyEvent('user.receiveNotify', {data:msg});
        }, 'notify/receive').execute('subscribe', 'notify/receive');

        //直接登记消息处理句柄，因为类似 balance.account.client/order.pay 这样的消息是默认发送的，不需要订阅
        core.service.monitor.remote.watch(msg => {
            //收到子账户余额变动通知，抛出内部事件, 处理流程定义于 app/events/user/balanceChange.js
            core.notifyEvent('user.balanceChange', {data:msg});
        }, 'balance.account.client');

        core.service.monitor.remote.watch(msg => {
            //用户执行 order.pay 之后，CP特约节点发起到账通知消息，抛出内部事件, 处理流程定义于 app/events/user/orderPay.js
            core.notifyEvent('user.orderPay', {data:msg});
        }, 'order.pay');
    });
});
