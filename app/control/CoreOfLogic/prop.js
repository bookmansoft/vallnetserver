let facade = require('gamecloud')
let tableType = require('../../util/tabletype');
const gamegoldHelp = require('../../util/gamegoldHelp');
const redisHelp = require('../../util/redisHelp');

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
        let ret = await gamegoldHelp.execute('prop.order', [
            cid, //游戏编号
            prop_ori_id, //道具原始
            prop_value, //道具含金量
            user_addr //游戏内玩家的有效地址
        ]);
        console.log(ret.result);
        return {errcode: 'success', errmsg: 'prop.order:ok', ret: ret.result};
    }

    //道具确权
    async QueryProps(user, params) {
        let cid = params.cid;
        let user_addr = params.user_addr;
        let ret = await gamegoldHelp.execute('queryProps', [
            cid, //游戏编号
            user_addr //游戏内玩家的有效地址
        ]);
        console.log(ret.result);
        return {errcode: 'success', errmsg: 'queryProps:ok', ret: ret.result};
    }

    //道具数量
    async PropCount(user, params) {
        let uid = params.uid;
        let ret = await gamegoldHelp.execute('prop.list', [1, uid]);
        let userProfiles = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
        if(userProfiles.length >0 ) {
            let userProfile = userProfiles[0];
            userProfile.setAttr('prop_count', userProfile.orm.current_prop_count);
            userProfile.orm.save();
        }
        return {errcode: 'success', errmsg: 'prop.count:ok', count: ret.result.count};
    }

    //我的道具
    async PropList(user, params) {
        let page = params.page;
        let uid = params.uid;
        let ret = await gamegoldHelp.execute('prop.list', [
            page, //游戏编号
            uid //openid
        ]);
        console.log(ret.result);
        let props = Array()
        for(let i=0; i<ret.result.list.length; i++) {
            let element = ret.result.list[i]
            let cp = await redisHelp.hget("hashkeycp", element.cid)
            element.cp = JSON.parse(cp)
            props.push(element)
        }
        return {errcode: 'success', errmsg: 'prop.list:ok', props: props};
    }

    //道具熔铸
    async PropFound(user, params) {
        let pid = params.pid;
        let ret = await gamegoldHelp.execute('prop.found', [
            pid, //生产者编码
        ]);
        console.log(ret.result);
        return {errcode: 'success', errmsg: 'prop.found:ok', ret: ret.result};
    }

    //道具捐赠
    //prop.donate hash index [openid]
    async PropDonate(user, params) {
        let txid = gamegoldHelp.revHex(params.txid);
        let index = params.index;
        let uid = params.uid;
        let ret = await gamegoldHelp.execute('prop.donate', [
            txid,
            index,
            uid
        ]);
        console.log(ret.result);
        return {errcode: 'success', errmsg: 'prop.donate:ok', ret: ret.result};
    }

    //道具接收
    //prop.receive raw [openid]
    async PropReceive(user, params) {
        let raw = params.raw;
        let uid = params.uid;
        let ret = await gamegoldHelp.execute('prop.receive', [
            raw, 
            uid,
        ]);    
        console.log(ret.result);
        return {errcode: 'success', errmsg: 'prop.receive:ok', ret: ret.result};
    }  

    //道具转移
    //prop.send addr hash index [openid]
    async PropSend(user, params) {
        let addr = params.addr;
        let pid = params.pid;
        let uid = params.uid;
        let ret = await gamegoldHelp.execute('prop.send', [
            addr, 
            pid,
            uid
        ]); 
        console.log(ret.result);
        return {errcode: 'success', errmsg: 'prop.send:ok', ret: ret.result};
    }     

    //道具出售
    //prop.sale hash index fixedPrice [openid]
    async PropSale(user, params) {
        let pid = params.pid;
        let fixedPrice = params.fixedPrice;
        let uid = params.uid;
        let ret = await gamegoldHelp.execute('prop.sale', [
            pid,
            fixedPrice,
            uid
        ]);
        console.log(ret.result);
        return {errcode: 'success', errmsg: 'prop.sale:ok', ret: ret.result};
    }

    //道具市场
    async PropListMarket(user, params) {
        let ret = await gamegoldHelp.execute('prop.remoteQuery', [[['pst', 2]]]);
        console.log(ret.result);
        return {errcode: 'success', errmsg: 'prop.list.market:ok', ret: ret.result.list};
    }

    //道具购买
    //prop.buy pid, price, openid
    async PropBuy(user, params) {
        let pid = params.pid;
        let price = params.price;
        let uid = params.uid;
        let ret = await gamegoldHelp.execute('prop.buy', [
            pid,
            price,
            uid
        ]);     
        console.log(ret.result);
        if(!!ret && ret.code == 0) {
            return {errcode: 'success', errmsg: 'prop.buy:ok', ret: ret.result}; 
        } else {
            return {errcode: 'fail', errmsg: 'prop.buy:ok'}; 
        }
        
    }
}

exports = module.exports = prop;
