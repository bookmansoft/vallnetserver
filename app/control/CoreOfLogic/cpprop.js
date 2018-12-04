let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');
//引入工具包
const toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
const remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch'))  
function remoteSetup() {
    remote.setup({
        type:   'testnet',
        ip:     '114.116.19.125',     //远程服务器地址
        head:   'http',               //远程服务器通讯协议，分为 http 和 https
        id:     'primary',            //默认访问的钱包编号
        apiKey: 'bookmansoft',        //远程服务器基本校验密码
        cid:    'xxxxxxxx-game-gold-root-xxxxxxxxxxxx', //授权节点编号，用于访问远程钱包时的认证
        token:  '03aee0ed00c6ad4819641c7201f4f44289564ac4e816918828703eecf49e382d08', //授权节点令牌固定量，用于访问远程钱包时的认证
    });
}
/**
 * 游戏用户
 * Create by gamegold Fuzhou on 2018-11-27
 */
class cpprop extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        console.log('cpprop middleware');
        return ['parseParams', 'commonHandle'];
    }

    //用户信息
    async PropList(user, params)  {
        let props = facade.GetMapping(tableType.cpProp).groupOf().records(tableField.cpProp);
        return {errcode: 'success', errmsg:'proplist:ok', props: props};
    };

    //道具确权
    async QueryProps(user, params) {
        remoteSetup();
        let cid = params.cid;
        let user_addr = params.user_addr;
        let ret = await remote.execute('queryProps', [
            cid, //游戏编号
            user_addr //游戏内玩家的有效地址
        ]);
        var queryprops = [];
        await ret.forEach(element => {
            let prop = facade.GetMapping(tableType.cpProp).groupOf().where([
                ['oid', '==', element.oid]
            ]).records(tableField.cpProp)[0];
            if(!!prop) {
                queryprops.push(prop);
            }
        });
        return {errcode: 'success', errmsg:'queryprops:ok', queryprops: queryprops};    
    }

    //道具详情查询
    async PropInfo(user, params) { 
        let oid = params.oid;
        let prop = facade.GetMapping(tableType.cpProp).groupOf().where([
            ['oid', '==', oid]
        ]).records(tableField.cpProp)[0];
        return {errcode: 'success', errmsg:'queryprops:ok', prop: !!prop ? prop : null};
    }
}

exports = module.exports = cpprop;
