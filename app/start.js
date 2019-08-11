const facade = require('gamecloud')
//加载用户自定义模块 - 这句必须紧跟在模块引入语句之后
facade.addition = true;

let {NotifyType, IndexType, TableType, ResType} = facade.const

let orderMonitor = require('./util/autoExec/orderMonitor');

//#region 新增索引类型，需要在 UserEntity.prototype.IndexOf 函数中增加字段映射
IndexType.Phone = 1001;
IndexType.Terminal = 1002;
//#endregion

//#region 新增通告类型，大于10000的值都可以使用
NotifyType.balance = 10001;     //账户变更日志
NotifyType.notify = 10002;      //主网通告，例如用来通知一笔待支付订单
//#endregion

let env = !!process.env.sys ? JSON.parse(process.env.sys) : {
    serverType: "IOS",      //待调测的服务器类型
    serverId: 1,            //待调测的服务器编号
    portal: true            //兼任门户（充当索引服务器），注意索引服务器只能有一台，因此该配置信息具有排他性
};  

if(env.constructor == String) {
    env = JSON.parse(env);
}

(async ()=>{
    // //添加静态网站，开启反向代理
    // facade.startProxy({
    //     router: {
    //         'test.gamegold.xin': {target: 'http://localhost:9801'},
    //         'wallet.vallnet.cn': {target: 'http://localhost:9101'},
    //         'crm.vallnet.cn': {target: 'http://localhost:9801'},
    //     },
    //     port: 80,
    //     protocol: 'http',
    // });

    //新增Auth服务器，请参照 gameconfig-backup 对 gameconfig 文件进行相应配置
    await facade.boot({
        env:{
            serverType: "Auth",
            serverId: 1
        }
    });

    //系统主引导流程，除了必须传递运行环境变量 env，也可以搭载任意变量，这些变量都将合并为核心类的options对象的属性，供运行时访问
    if(env.portal) { //如果该服务器兼任门户，则启动索引服务
        await facade.boot({
            env:{
                serverType: "Index",
                serverId: 1
            },
            loading: [
                TableType.sharedredpack, 
                TableType.sharedredpack_receive, 
            ],
        });
    }

    //加载资源管理节点
    await facade.boot({
        env:{
            serverType: "Resource",
            serverId: 1
        },
        //设置静态资源映射
        static: [
            ['/image', './web/image'],
            ['/echart', './web/echart'],
            ['/test/', './web/game/test'],
        ], 
    });

    //加载CRM管理节点
    await facade.boot({
        env: {
            serverType: "CRM",
            serverId: 1
        },
        //指示加载自定义数据库表
        loading: [
            TableType.Test, 
            TableType.Cp,
            TableType.Prop,
            TableType.RedPacket,
            TableType.Prize,
            TableType.CpFunding,
            TableType.CpStock,
        ],
        static: [
            ['/', './web/dist'],
        ], 
    }, async core => {
        while(true) {
            //单独维护一个到公链的长连接，进行消息监控
            core.chain = {height: 0};
            let ret = await core.service.monitor.setlongpoll().execute('block.count', []);
            if(ret && ret.code == 0) {
                core.chain.height = ret.result;
                break;
            } else {
                await (async (time) => {return new Promise(resolve => {setTimeout(resolve, time);});})(3000);
            }
        }

        //订阅 notify/receive 消息，登记处理句柄
        core.service.monitor.remote.watch(msg => {
            core.notifyEvent('user.receiveNotify', {data:msg});
        }, 'notify/receive').execute('subscribe', 'notify/receive');

        //订阅 block/tips 消息，更新最新块高度
        core.service.monitor.remote.watch(msg => {
            core.chain.height = msg.height;
        }, 'block/tips').execute('subscribe', 'block/tips');

        //订阅 cp/register 消息，登记处理句柄
        core.service.monitor.remote.watch(msg => {
            core.notifyEvent('cp.register', {msg:msg});
        }, 'cp/register').execute('subscribe', 'cp/register');

        //直接登记消息处理句柄，因为 tx.client/balance.account.client/order.pay 这样的消息是默认发送的，不需要订阅
        core.service.monitor.remote.watch(msg => {
            //收到子账户余额变动通知，抛出内部事件, 处理流程定义于 app/events/user/balanceChange.js
            core.notifyEvent('balance.change', {data:msg});
        }, 'balance.account.client');
        core.service.monitor.remote.watch(msg => {
        }, 'tx.client');
    });

    //加载游戏管理节点
    // facade.boot({
    //     env: {
    //         serverType: "Chick",
    //         serverId: 1
    //     },
    //     //设置静态资源映射
    //     static: [
    //         ['/chick/', './web/game/chick'],
    //     ], 
    // });

    //加载Wallet管理节点
    await facade.boot({
        env: env,
        //指示加载自定义数据库表
        loading: [
            TableType.blockgame, 
            TableType.blockgamecomment, 
            TableType.userwallet, 
            TableType.userredpack, 
            TableType.userredpackact, 
            TableType.redpack, 
            TableType.redpackact, 
            TableType.sharedredpack, 
            TableType.sharedredpack_receive, 
            TableType.StockBulletin, 
            TableType.StockBase,
            TableType.Test, 
        ],
        //额外的路由配置，也可以写在启动回调函数中( core.addRouter('/', './web/client') )，也可以配置于任意控制器的 router 中
        static: [
            ['/', './web/client'],
        ], 
    }, async core => {
        console.log(`${core.options.serverType}.${core.options.serverId}'s startup start`);

        while(true) {
            //单独维护一个到公链的长连接，进行消息监控
            core.chain = {height: 0};
            let ret = await core.service.monitor.setlongpoll().execute('block.count', []);
            if(ret && ret.code == 0) {
                core.chain.height = ret.result;
                break;
            } else {
                await (async (time) => {return new Promise(resolve => {setTimeout(resolve, time);});})(3000);
            }
        }

        //从主网查询全部CP信息
        let pageTotal = 1, pageCur = 0, ret = null; //设定总页数、当前页数的初始值
        while(pageCur < pageTotal) {
            ret = await core.service.gamegoldHelper.execute('cp.remoteQuery', [[['size', 100], ['page', ++pageCur]]]);
            if(!!ret && ret.code == 0) {
                pageTotal = ret.page;
                pageCur = ret.cur;

                for(let item of ret.result.list) {
                    //调整协议字段，满足创建CP接口的需要
                    item.address = item.current.address; 

                    //完成CP信息的入库和更新，同时也包括对凭证和道具信息的入库
                    await core.notifyEvent('cp.register', {msg: item});
                }
            } else {
                console.log('failed to connect to vallnet.');
            }
        }

        //订阅 block/tips 消息，更新最新块高度
        core.service.monitor.remote.watch(msg => {
            core.chain.height = msg.height;
        }, 'block/tips').execute('subscribe', 'block/tips');

        //订阅CP注册消息，登记处理句柄
        core.service.monitor.remote.watch(msg => {
            core.notifyEvent('cp.register', {msg:msg});
        }, 'cp/register').execute('subscribe', 'cp/register');
        //订阅CP众筹消息，登记处理句柄
        core.service.monitor.remote.watch(msg => {
            core.notifyEvent('cp.register', {msg:msg});
        }, 'cp/stock').execute('subscribe', 'cp/stock');

        //订阅消息并登记消息处理句柄
        core.service.monitor.remote.watch(msg => {
            //收到新的道具，或者已有道具发生变更，抛出内部事件, 处理流程定义于 app/events/user/propReceive.js
            core.notifyEvent('wallet.propReceive', {data:msg});
        }, 'prop/receive').execute('subscribe', 'prop/receive');

        core.service.monitor.remote.watch(msg => {
            //收到发布的道具被成功拍卖后的通知，抛出内部事件, 处理流程定义于 app/events/wallet/propAuction.js
            core.notifyEvent('wallet.propAuction', {data:msg});
        }, 'prop/auction').execute('subscribe', 'prop/auction');

        core.service.monitor.remote.watch(msg => {
            //收到通告，抛出内部事件, 处理流程定义于 app/events/wallet/receiveNotify.js
            core.notifyEvent('user.receiveNotify', {data:msg});
        }, 'notify/receive').execute('subscribe', 'notify/receive');

        core.service.monitor.remote.watch(msg => {
            //收到子账户余额变动通知，抛出内部事件, 处理流程定义于 app/events/wallet/balanceChange.js
            core.notifyEvent('wallet.balanceChange', {data:msg});
        }, 'balance.account.client');

        core.service.monitor.remote.watch(msg => {
            //用户执行 order.pay 之后，CP特约节点发起到账通知消息，抛出内部事件, 处理流程定义于 app/events/user/orderPay.js
            core.notifyEvent('wallet.orderPay', {data:msg});
        }, 'order.pay');

        //#region 订单处理相关流程
        
        //1. 添加微信支付回调路由(也可以选择配置于 facade.boot/static 数组或者 control/router 中，集中置于此处是为了提高代码聚合度)
        core.addRouter('/wxnotify', async params => {
            try {
                //验证签名、解析字段
                let data = await this.service.wechat.verifyXml(params); 
                if(!data) {
                    throw new Error('error sign code');
                }

                //触发 wallet.payCash 事件，执行订单确认、商品发放流程
                this.notifyEvent('wallet.payCash', {data: data});
    
                //给微信送回应答
                return `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`;
            } catch (e) {
                console.log('wxnotify', e.message);
            }
        });

        //2. 添加订单状态定时检测器(每5分钟检测一轮)，具体查询工作由 orderMonitor.execute 承载

        // test only 调测阶段，暂时封闭
        //core.autoTaskMgr.addMonitor(new orderMonitor(), 10*1000);
        //

        //3. 添加商品发放流程，配合 wallet.payCash 的工作流程。商品参数保存于 buylogs.product 字段中，格式为复合格式字符串 "type, id, num[;type, id, num]"
        //@warning 对于异步发放、可能最终发放失败的商品，需要先放入背包，然后由用户从背包中选兑，以降低事务处理的复杂性

        //3.1 参与众筹
        core.RegisterResHandle('crowd', async (user, bonus) => {
            let stock = core.GetObject(TableType.StockBase, parseInt(bonus.id));
            if(!!stock && bonus.num > 0) {
                //由于订单已经支付，此处由系统为用户代购, 义务捐赠模式下 bonus.num 为零，不需处理
                ret = await core.service.gamegoldHelper.execute('stock.purchaseTo', [stock.getAttr('cid'), bonus.num, user.domainId]);
                return ret;
            }
            return {code:0};
        });

        //3.2 购买VIP服务
        core.RegisterResHandle('vip', async (user, bonus) => {
            let vip_level =  bonus.num;
            let month_time =  3600 * 24 * 30;

            let current_time = Date.parse(new Date())/1000;
            let is_expired = !user.baseMgr.info.getAttr('vet') || (user.baseMgr.info.getAttr('vet') < current_time);
            if(is_expired) { //非VIP/VIP已过期，重新开卡
                user.baseMgr.info.setAttr('vst', current_time);                 //VIP开始时间
                user.baseMgr.info.setAttr('vlg', current_time);                 //VIP提取收益时间
                user.baseMgr.info.setAttr('vet', current_time + month_time);    //VIP结束时间
                user.baseMgr.info.setAttr('vl', vip_level);                     //VIP当前级别
            } else if(user.baseMgr.info.getAttr('vl') == vip_level) {           //续费
                user.baseMgr.info.setAttr('vet', user.baseMgr.info.getAttr('vet') + month_time);
            } else if(user.baseMgr.info.getAttr('vl') < vip_level) {            //升级
                user.baseMgr.info.setAttr('vl', vip_level);
            }
            user.notify({type: 911002, info: JSON.parse(user.baseMgr.info.getData())});
        });

        //#endregion

        //查询通告
        let qryNotify = await core.service.gamegoldHelper.execute('sys.listNotify', [[['page', 1], ['size', -1]],]);
        if(qryNotify.code == 0) {
            for(let it of qryNotify.result.list) {
                core.notifyEvent('user.receiveNotify', {data: it});
            }
        }

        console.log(`${core.options.serverType}.${core.options.serverId}'s startup finished!`);
    });
})();
