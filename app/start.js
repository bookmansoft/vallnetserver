/**
 * 系统启动文件
 * @description facade.boot 为节点自启流程，可以搭载多种辅助变量，这些变量都将合并到节点的options对象中，供运行时访问
 *      env         运行环境变量
 *      loading     指示加载自定义数据库表
 *      static      额外的路由配置，也可以通过 core.addRouter 加载或写入控制器的 router 中
        
 * @description 请参照 gameconfig-backup 对 gameconfig 文件进行相应配置
 */

//引入门面对象，并立即设置为用户定制模式(必须紧跟在模块引入语句之后设置)
const facade = require('gamecloud')
facade.addition = true;

let {NotifyType} = facade.const

//#region 新增通告类型(大于10000)
NotifyType.balance = 10001;     //账户变更日志
NotifyType.notify = 10002;      //主网通告，例如用来通知一笔待支付订单
//#endregion

//#region 解析环境变量
let env = !!process.env.sys ? JSON.parse(process.env.sys) : {
    serverType: "Wallet",       //待调测的服务器类型
    serverId: 1,                //待调测的服务器编号
    portal: true                //指示该服务器兼任门户（索引服务器），注意索引服务器只能有一台，因此该配置信息具有排他性
};  
if(env.constructor == String) {
    env = JSON.parse(env);
}
//#endregion

(async () => {
    if(env.portal) {
        //开启反向代理。将反向代理和节点自身的路由配置相结合，可以实现灵活的路由策略
        facade.startProxy({
            router: {
                'h5.gamegold.xin': {target: 'http://localhost:9101'},
                'chick.gamegold.xin': {target: 'http://localhost:9201'},
                'monkey.gamegold.xin': {target: 'http://localhost:9202'},
                'crm.vallnet.cn': {target: 'http://localhost:9801'},
            },
            port: 80,
            protocol: 'http',
        });

        //开启索引服务
        await facade.boot({serverType: "Index", serverId: 1});

        //开启Auth服务
        await facade.boot({serverType: "Auth", serverId: 1});
    }

    //加载CRM管理节点
    await facade.boot({serverType: "CRM",serverId: 1});

    //加载 游戏-Chick 节点
    facade.boot({serverType: "Chick", serverId: 1});
    
    //加载 游戏-Monkey 节点
    facade.boot({serverType: "Monkey", serverId: 1});

    //加载钱包节点
    await facade.boot(env);
})();