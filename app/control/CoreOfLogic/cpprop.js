let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');
let remoteSetup = require('../../util/gamegold_cp');
//引入工具包
const toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
const remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch'))  
remote.setup(remoteSetup);

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
    async GetPropByOid(user, params) { 
        let oid = params.oid;
        let prop = facade.GetMapping(tableType.cpProp).groupOf().where([
            ['oid', '==', oid]
        ]).records(tableField.cpProp)[0];
        return {errcode: 'success', errmsg:'queryprops:ok', prop: !!prop ? prop : null};
    }

    //批量查询道具
    async GetPropByOids(user, params) { 
        let oids = params.oids;
        let props = facade.GetMapping(tableType.cpProp).groupOf().where([
            ['oid', 'include', oids]
        ]).records(tableField.cpProp);
        return {errcode: 'success', errmsg:'getpropbyoids:ok', props: !!props ? props : null};
    }

}

exports = module.exports = cpprop;
