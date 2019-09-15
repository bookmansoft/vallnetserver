/**
 * plugin: 存放对核心类进行扩充的函数集
 * default.js中的函数将直接挂接于CoreOfBase
 * {name}.js中的函数将挂接于CoreOfBase.{name}
 * 函数的第一个参数env由系统自动注入，指向核心对象
 * 例如，default.js 有一个函数 urlToCdn(env, url)，当前核心对象为 fo，则可以通过 fo.urlToCdn(url) 来调用该函数，其中 env 指向 fo
 * @note 之所以不采用this指针指向核心对象的方式，而是单独注入env参数，是因为前者很难借助词法分析器的帮助来降低函数书写的难度。
 * @note 扩展函数的作者，需要在熟悉核心类内部构造的基础上，自行规避命名冲突问题
 */

function DynamicOptions(core) {
    return {
        //当前节点的附加路由，和反向代理结合使用
        static: [
            ['/', './web/game/chick'],
            ['/image', './web/image'],
        ],
    };
}

async function startAfter(core) {
    console.log(`${core.options.serverType}.${core.options.serverId}'s startup start`);

    core.cpToken = new Map();   //CP签名密钥缓存
    core.userMap = new Map();   //用户身份认证信息缓存
    core.orderMap = new Map();  //订单缓存

    //订单执行前需要达到的确认数
    core.confirmNum = 0;

    //定时流程 - 订单检测
    core.autoTaskMgr.addCommonMonitor(() => {
        return CheckOrder(core);
    }, 5000);

    console.log(`${core.options.serverType}.${core.options.serverId}'s startup finished!`);
}

/**
 * 对订单进行检测，已确认订单进行处理后删除，未确认订单如超时则主动查询状态
 * @param {CoreOfBase} env
 */
async function CheckOrder(env) {
    for(let [sn, data] of env.orderMap) {
        if(data.finish) {
            continue;
        }

        if(data.confirm >= env.confirmNum) {
            //执行订单内容, 订单包含一个商品清单，可能包括上链道具和普通道具

            //1. 构造数据结构
            let paramArray = [
                data.cid,
                data.oid,
                parseInt(data.sum * 0.5),//统一当成含金量50%处理
                data.addr,
            ];
            //2. 调用 prop.order 订购该道具: 创建道具并发送到指定地址
            let ret = await env.service.gamegoldHelper.execute('prop.order', paramArray);
            if(ret.code == 0) {
                //3. 标记为已处理
                data.finish = true;
            }
        } else {
            if(Date.now()/1000 - data.time > 10) {
                let ret = await env.service.gamegoldHelper.execute('order.query', [data.cid, sn]);
                /*
                    {
                        "oper": "pay",
                        "cid": "0be0f210-c367-11e9-88a0-976cfe77cf12",
                        "uid": "u001",
                        "sn": "s00100000000000000000000000000000000",
                        "sum": 50000,
                        "addr": "tb1q6x8tcusuhyd4f48edzvsngzfs9gc2x204gmdvy",
                        "gaddr": null,
                        "publish": 112,
                        "height": 113,
                        "hash": "85829a262e627788e018e6fe369f9cfd30da9d63085078cf87d2f886d6975cbf",
                        "confirm": 2
                    }                        
                */                        
                if(ret.code == 0 && !!ret.result) {
                    Object.keys(ret.result).map(key=>{
                        data[key] = ret.result[key];
                    });
                }
            }
        }
    }
}

exports.startAfter = startAfter;
exports.DynamicOptions = DynamicOptions;