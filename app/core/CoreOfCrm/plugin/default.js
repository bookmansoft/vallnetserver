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
let remoteSetup = facade.ini.servers["CoreOfIndex"][1].node; //全节点配置信息
let {EntityType, TableField} = facade.const

//#region 新增自定义数据表类型(大于100)
EntityType = Object.assign(EntityType, {
    "Test": 101,
    'Cp': 202,
    'RedPacket': 207,
    'Prize': 208,
    'CpFunding': 209,
    'CpStock': 210,
});
//#endregion

function DynamicOptions(core) {
    return {
        //当前节点的附加载入数据表
        loading: [
            EntityType.Test, 
            EntityType.Cp,
            EntityType.RedPacket,
            EntityType.Prize,
            EntityType.CpFunding,
            EntityType.CpStock,
        ],
        //当前节点的附加路由，和反向代理结合使用
        static: [
            ['/', './web/crm'],
            ['/echart', './web/echart'],
        ], 
    };
}

/**
 * 对订单进行检测，已确认订单进行处理后删除，未确认订单如超时则主动查询状态
 * @param {CoreOfBase} env
 */
async function startAfter(core) {
    while(true) {
        //单独维护一个到公链的长连接，进行消息监控
        core.chain = {height: 0};
        let ret = await core.service.monitor.setlongpoll(async msg=>{
            //先退订，避免造成重复订阅
            await core.service.monitor.remote.execute('unsubscribe', [
                'notify/receive',
                'block/tips',
                'cp/register', 
                'cp/change',
                'cp/stock',
            ]);

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

            //订阅 cp/change 消息，登记处理句柄
            core.service.monitor.remote.watch(msg => {
                core.notifyEvent('cp.register', {msg:msg});
            }, 'cp/change').execute('subscribe', 'cp/change');

            //订阅CP众筹消息，登记处理句柄
            core.service.monitor.remote.watch(msg => {
                core.notifyEvent('stock.funding', {msg:msg});
            }, 'cp/stock').execute('subscribe', 'cp/stock');
        }).execute('block.count', []);
        if(ret && ret.code == 0) {
            core.chain.height = ret.result;
            break;
        } else {
            await (async (time) => {return new Promise(resolve => {setTimeout(resolve, time);});})(3000);
        }
    }

    //自检特约商户设定
    let cids = core.GetMapping(EntityType.Cp).groupOf().records(TableField.Cp).reduce((sofar,cur)=>{sofar += `${cur.cp_id},`; return sofar;}, '');
    await core.service.RemoteNode.conn(remoteSetup.cid).execute('sys.changeSpecialCp', [1, cids]);

    //直接登记消息处理句柄，因为 tx.client/balance.account.client 这样的消息是默认发送的，不需要订阅
    core.service.monitor.remote.watch(msg => {
        //收到子账户余额变动通知，抛出内部事件, 处理流程定义于 app/events/user/balanceChange.js
        core.notifyEvent('balance.change', {data:msg});
    }, 'balance.account.client');
    core.service.monitor.remote.watch(msg => {
    }, 'tx.client');

    //追加检测凭证发行状态
    let ret = await core.service.RemoteNode.conn(remoteSetup.cid).execute('stock.offer.list', [
        [
            ['page', 1],
            ['size', -1],
        ]
    ]);

    if(ret.code == 0) {
        for(let it of ret.result.list) {
            core.notifyEvent('stock.funding', {msg:it});
        }
    }

    //todo 定期刷新凭证信息, 形成历史快照
    // core.autoTaskMgr.addCommonMonitor(() => {
    //     core.notifyEvent('stock.refresh', {msg:{}});
    //     return false;
    // }, 60000);
}

exports.startAfter = startAfter;
exports.DynamicOptions = DynamicOptions;