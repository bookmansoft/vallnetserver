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
let {NotifyType} = facade.const

/**
 * 动态参数输出
 * @param {*} core 
 */
function DynamicOptions(core) {
    return {
        loading: [],
        static: [], 
    };
}

/**
 * 启动后追加执行的任务
 * @param {*} core 
 */
async function startAfter(core) {
    console.log(`${core.options.serverType}.${core.options.serverId}'s startup start`);

    //Remoting 示例代码
    // setTimeout(()=>{
    //     core.remoteCall('userNotify', {
    //         domain: 'authwx.Wallet',
    //         openid: '021Pkmz4023vzD1111z40e6wz40Pkmzg',
    //         msg: { type: NotifyType.DailyActivityState, info: {} }
    //     }, null, {stype:'Wallet', sid:1});
    // }, 10000);

    console.log(`${core.options.serverType}.${core.options.serverId}'s startup finished!`);
}

exports.startAfter = startAfter;
exports.DynamicOptions = DynamicOptions;