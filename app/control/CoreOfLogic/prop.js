let facade = require('gamecloud')
let {ReturnCode, NotifyType} = facade.const
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');
let remoteSetup = require('../../util/gamegold');
//引入工具包
const toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
const remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch'))  
remote.setup(remoteSetup);

/**
 * 节点控制器--道具
 * Updated by thomasFuzhou on 2018-11-19.
 */
class prop extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    //道具发送
    async PropOrder(user, params)  {
        let cid = params.cid;
        let prop_ori_id = params.prop_ori_id;
        let prop_value = params.prop_value;
        let user_addr = params.user_addr;
        //npm run cli rpc prop.order {game_id} {prop_ori_id} {prop_value} {user_addr}
        let ret = await remote.execute('prop.order', [
            cid, //游戏编号
            prop_ori_id, //道具原始
            prop_value, //道具含金量
            user_addr //游戏内玩家的有效地址
        ]);
        console.log(ret);
        return {errcode: 'success', errmsg: 'prop.order:ok', ret: ret};
    }

    //道具确权
    async QueryProps(user, params) {
        let cid = params.cid;
        let user_addr = params.user_addr;
        let ret = await remote.execute('queryProps', [
            cid, //游戏编号
            user_addr //游戏内玩家的有效地址
        ]);
        console.log(ret);
        return {errcode: 'success', errmsg: 'queryProps:ok', ret: ret};
    }

    //道具数量
    async PropCount(user, params) {
        let uid = params.uid;
        let openid = params.openid;
        let ret = await remote.execute('prop.count', [
            openid //openid
        ]);
        let userProfiles = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
        if(userProfiles.length >0 ) {
            let userProfile = userProfiles[0];
            userProfile.setAttr('prop_count', userProfile.orm.current_prop_count);
            userProfile.orm.save();
        }
        return {errcode: 'success', errmsg: 'prop.count:ok', count: ret};
    }

        
    //我的道具
    async PropList(user, params) {
        let page = params.page;
        let openid = params.openid;
        let ret = await remote.execute('prop.list', [
            page, //游戏编号
            openid //openid
        ]);
        console.log(ret);
        return {errcode: 'success', errmsg: 'prop.list:ok', props: ret};
    }

    //道具熔铸
    async PropFound(user, params) {
        let txid = params.txid;
        let ret = await remote.execute('prop.found', [
            txid, //生产者编码
        ]);
        console.log(ret);
        return {errcode: 'success', errmsg: 'prop.found:ok', ret: ret};
    }

    //道具捐赠
    //prop.donate hash index [openid]
    async PropDonate(user, params) {
        let txid = params.txid;
        let index = params.index;
        let openid = params.openid;
        let ret = await remote.execute('prop.donate', [
            txid,
            index,
            openid
        ]);
        console.log(ret);
        return {errcode: 'success', errmsg: 'prop.donate:ok', ret: ret};
    }

    //道具接收
    //prop.receive raw [openid]
    async PropReceive(user, params) {
        let raw = params.raw;
        let openid = params.openid;
        let ret = await remote.execute('prop.receive', [
            raw, 
            openid,
        ]);    
        console.log(ret);
        return {errcode: 'success', errmsg: 'prop.receive:ok', ret: ret};
    }  

    //道具转移
    //prop.send addr hash index [openid]
    async PropSend(user, params) {
        let addr = params.addr;
        let txid = params.txid;
        let index = params.index;
        let openid = params.openid;
        let ret = await remote.execute('prop.send', [
            addr, 
            txid,
            index,
            openid
        ]); 
        console.log(ret);
        return {errcode: 'success', errmsg: 'prop.send:ok', ret: ret};
    }     

    //道具出售
    //prop.sale hash index fixedPrice [openid]
    async PropSale(user, params) {
        let txid = params.txid;
        let index = params.index;
        let fixedPrice = params.fixedPrice;
        let openid = params.openid;
        let ret = await remote.execute('prop.sale', [
            txid,
            index,
            fixedPrice,
            openid
        ]);
        console.log(ret);
        return {errcode: 'success', errmsg: 'prop.sale:ok', ret: ret};
    }

    //道具市场
    async PropListMarket(user, params) {
        let ret = await remote.execute('prop.list.market', []);
        console.log(ret);
        return {errcode: 'success', errmsg: 'prop.list.market:ok', ret: ret};
    }

    //道具购买
    //prop.buy pid, price, openid
    async PropBuy(user, params) {
        let pid = params.pid;
        let price = params.price;
        let openid = params.openid;
        let ret = await remote.execute('prop.buy', [
            pid,
            price,
            openid
        ]);     
        console.log(ret);
        return {errcode: 'success', errmsg: 'prop.buy:ok', ret: ret}; 
    }
}

exports = module.exports = prop;
