const facade = require('gamecloud')
const gamegoldHelp = require('./util/gamegoldHelp');
const redisHelp = require('./util/redisHelp');

//加载用户自定义模块
facade.addition = true;

let env = !!process.env.sys ? JSON.parse(process.env.sys) : {
    serverType: "IOS",      //待调测的服务器类型
    serverId: 1,            //待调测的服务器编号
    portal: true            //兼任门户（充当索引服务器），注意索引服务器只能有一台，因此该配置信息具有排他性
};  

if(env.constructor == String){
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

//启动gamegold 连接器
gamegoldWork()
redisWork()

facade.boot({
    env: env,
    //指示加载自定义数据库表
    loading: [
        101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123
    ],
    //设置静态资源映射
    static: [['/client/', './web/client']], 
});

async function gamegoldWork() {

    await gamegoldHelp.init()

    //通过监听收到消息
    gamegoldHelp.watch(msg => {
        console.log(msg);
    }, 'tx.client');

    /*
    //获得一个新的地址
    let ret = await gamegoldHelp.execute('address.create', []);
    let newaddr = ret.result.address;
    console.log(newaddr);

    //向该地址转账
    ret = await gamegoldHelp.execute('tx.send', [newaddr, 20000]);
    console.log(ret.result)

    ret = await gamegoldHelp.execute('balance.all', [])
    console.log(ret.result);
    */

}

async function redisWork() {
    await redisHelp.init()
}

// 定时查询红包接口
/*
facade.current.autoTaskMgr.addCommonMonitor(
    ()=> {
        let redpackList = facade.GetMapping(tableType.redpack).groupOf().records(tableField.redpack);
        console.log(redpackList)
    }, 1000
)
*/
