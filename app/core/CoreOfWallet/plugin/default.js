/**
 * plugin: 存放对核心类进行扩充的函数集
 * default.js中的函数将直接挂接于CoreOfBase
 * {name}.js中的函数将挂接于CoreOfBase.{name}
 * 函数的第一个参数env由系统自动注入，指向核心对象
 * 例如，default.js 有一个函数 urlToCdn(env, url)，当前核心对象为 fo，则可以通过 fo.urlToCdn(url) 来调用该函数，其中 env 指向 fo
 * @note 之所以不采用this指针指向核心对象的方式，而是单独注入env参数，是因为前者很难借助词法分析器的帮助来降低函数书写的难度。
 * @note 扩展函数的作者，需要在熟悉核心类内部构造的基础上，自行规避命名冲突问题
 */

let facade = require('gamecloud')
let CoreOfBase = facade.CoreOfBase
let orderMonitor = require('../../../util/autoExec/orderMonitor');
let {EntityType, NotifyType} = facade.const

//#region 新增自定义数据表类型(大于100)
EntityType = Object.assign(EntityType, {
    "userwallet": 104,
    "blockgame": 107,
    'redpack': 119,
    'redpackact': 120,
    'userredpack': 121,
    'userredpackact': 122,
    'blockgamecomment': 123,
    'sharedredpack':131,
    'sharedredpack_receive':132,
    'StockBulletin': 302,
    'StockBase': 303,
});
//#endregion

/**
 * 动态参数输出
 * @param {*} core 
 */
function DynamicOptions(core) {
    return {
        //当前节点的附加载入数据表
        loading: [
            EntityType.userwallet, 
            EntityType.blockgame, 
            EntityType.redpack, 
            EntityType.redpackact, 
            EntityType.userredpack, 
            EntityType.userredpackact, 
            EntityType.blockgamecomment, 
            EntityType.sharedredpack, 
            EntityType.sharedredpack_receive, 
            EntityType.StockBulletin, 
            EntityType.StockBase,
        ],
        //当前节点的附加路由，和反向代理结合使用
        static: [
            ['/', './web/wallet'],
        ], 
    };
}

async function startAfter(core) {
    console.log(`${core.options.serverType}.${core.options.serverId}'s startup start`);

    while(true) {
        //单独维护一个到公链的长连接，进行消息监控
        core.chain = {height: 0};
        let ret = await core.service.monitor.setlongpoll(async msg => {
            //先退订，避免造成重复订阅
            await core.service.monitor.remote.execute('unsubscribe', [
                'block/tips',
                'cp/register', 
                'cp/change',
                'cp/stock',
                'cp/stockPurchase',
                'prop/receive',
                'prop/auction',
                'notify/receive',
                'balance.account.client',
                'cp/orderPay',
            ]);

            //订阅 block/tips 消息，更新最新块高度
            core.service.monitor.remote.watch(msg => {
                core.chain.height = msg.height;
            }, 'block/tips').execute('subscribe', 'block/tips');

            //订阅CP注册消息，登记处理句柄
            core.service.monitor.remote.watch(msg => {
                core.notifyEvent('cp.register', {msg:msg});
            }, 'cp/register').execute('subscribe', 'cp/register');

            //订阅 cp/change 消息，登记处理句柄
            core.service.monitor.remote.watch(msg => {
                core.notifyEvent('cp.register', {msg:msg});
            }, 'cp/change').execute('subscribe', 'cp/change');

            //订阅CP众筹消息，登记处理句柄
            core.service.monitor.remote.watch(msg => {
                core.notifyEvent('cp.register', {msg:msg});
            }, 'cp/stock').execute('subscribe', 'cp/stock');

            //订阅CP众筹购买消息，登记处理句柄
            core.service.monitor.remote.watch(msg => {
                core.notifyEvent('cp.stockPurchase', {msg:msg});
            }, 'cp/stockPurchase').execute('subscribe', 'cp/stockPurchase');

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
                //用户执行 order.pay 之后，CP特约节点抛出到账通知消息, 处理流程定义于 app/events/user/orderPay.js
                //注意：特约节点在向钱包抛出该通知后，还会主动调用游戏服务端回调接口
                core.notifyEvent('user.orderPay', {data:msg});
            }, 'cp/orderPay').execute('subscribe', 'cp/orderPay');
        }).execute('block.count', []);

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
        let stock = core.GetObject(EntityType.StockBase, parseInt(bonus.id));
        if(!!stock && bonus.num > 0 && stock.getAttr('sum_left') >= bonus.num) {
            //由于订单已经支付，此处由系统为用户代购, 义务捐赠模式下 bonus.num 为零，不需处理
            ret = await core.service.gamegoldHelper.execute('stock.purchaseTo', [stock.getAttr('cid'), bonus.num, user.account]);
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
            await core.notifyEvent('user.receiveNotify', {data: it});
        }
    }

    //#region 远程调用相关的示例代码

    //调用索引服上的服务接口
    //await core.remoteService(`dailyactivity.getList`, ['authwx.Wallet', 'alice']);

    //向用户发送一封邮件, 注意该调用没有指定目标逻辑节点，而是提供了 domain/openid 信息，由索引服进行适配
    // await core.remoteCall('routeCommand', {
    //     func: 'userNotify',
    //     domain: 'authwx.Wallet',
    //     openid: '021Pkmz4023vzD1111z40e6wz40Pkmzg',
    //     msg: {
    //         type: NotifyType.DailyActivityInstantBonus,
    //         info: {}
    //     }
    // });

    //#endregion

    console.log(`${core.options.serverType}.${core.options.serverId}'s startup finished!`);
}

exports.startAfter = startAfter;
exports.DynamicOptions = DynamicOptions;