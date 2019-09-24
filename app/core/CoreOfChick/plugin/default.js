/**
 * plugin: 存放对核心类进行扩充的函数集
 * default.js中的函数将直接挂接于CoreOfBase
 * {name}.js中的函数将挂接于CoreOfBase.{name}
 * 函数的第一个参数env由系统自动注入，指向核心对象
 * 例如，default.js 有一个函数 urlToCdn(env, url)，当前核心对象为 fo，则可以通过 fo.urlToCdn(url) 来调用该函数，其中 env 指向 fo
 * @note 之所以不采用this指针指向核心对象的方式，而是单独注入env参数，是因为前者很难借助词法分析器的帮助来降低函数书写的难度。
 * @note 扩展函数的作者，需要在熟悉核心类内部构造的基础上，自行规避命名冲突问题
 */

let orderMonitor = require('../../../util/autoExec/orderMonitor');

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

    //订单执行前需要达到的确认数
    core.confirmNum = 0;

    //添加订单状态定时检测器，具体查询工作由 orderMonitor.execute 承载
    core.autoTaskMgr.addMonitor(new orderMonitor(), 10*1000);

    //兑换游戏金接口
    core.RegisterResHandle('GG', async (user, bonus) => {
        console.log('exchange gamegold', bonus);
        let ret = await core.service.gamegoldHelper.execute('tx.send', [user.baseMgr.info.getAttr('acaddr'), bonus.num]);
        return ret;
    });

    //上链道具
    core.RegisterResHandle('NET', async (user, bonus) => {
        console.log('equipment record on net', bonus);

        //查询道具配置表
        let bi = core.fileMap.itemdata[bonus.id];
        if(!!bi) {
            let prop_price = bi.prop_price;
            let rank = parseInt(bi.prop_rank);
            if (rank == 1) {
                rank = 0.05;
            } else if (rank == 2) {
                rank = 0.1;
            } else if (rank == 3) {
                rank = 0.2;
            } else if (rank == 4) {
                rank = 0.5;
            } else if (rank == 5) {
                rank = 0.8;
            } else {
                rank = 1;
            }
            prop_price = (prop_price*rank) | 0;

            //将道具上链
            await core.service.gamegoldHelper.execute('prop.order', [
                core.service.gamegoldHelper.cid, 
                bonus.id,
                prop_price,
                user.baseMgr.info.getAttr('acaddr')
            ]);
        }
    });

    console.log(`${core.options.serverType}.${core.options.serverId}'s startup finished!`);
}

exports.startAfter = startAfter;
exports.DynamicOptions = DynamicOptions;