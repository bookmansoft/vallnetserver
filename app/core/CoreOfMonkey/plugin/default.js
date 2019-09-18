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
        static: [['/', './web/game/monkey']],
    };
}

async function startAfter(core) {
    console.log(`${core.options.serverType}.${core.options.serverId}'s startup start`);

    //do anything as you wish
    //关卡探险随机事件触发
    core.autoTaskMgr.addCommonMonitor(() => {
        for(let s of Object.values(core.service.server.connected)) {
            if(!!s.user){
                //触发随机事件
                s.user.getEventMgr().RandomEvent(s.user);
            }
        }
    }, 60000);

    console.log(`${core.options.serverType}.${core.options.serverId}'s startup finished!`);
}

exports.startAfter = startAfter;
exports.DynamicOptions = DynamicOptions;