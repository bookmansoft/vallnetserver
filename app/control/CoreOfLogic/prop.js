let facade = require('gamecloud')
let {TableType} = facade.const;

/**
 * 节点控制器--道具
 * Updated by thomasFuzhou on 2018-11-19.
 */
class prop extends facade.Control
{
    //道具发送
    async PropOrder(user, params)  {
        let cid = params.cid;
        let prop_ori_id = params.prop_ori_id;
        let prop_value = params.prop_value;
        let user_addr = params.user_addr;
        //npm run cli rpc prop.order {game_id} {prop_ori_id} {prop_value} {user_addr}
        let ret = await this.core.service.gamegoldHelper.execute('prop.order', [
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
        let ret = await this.core.service.gamegoldHelper.execute('queryProps', [
            cid, //游戏编号
            user_addr //游戏内玩家的有效地址
        ]);
        console.log(ret.result);
        return {errcode: 'success', errmsg: 'queryProps:ok', ret: ret.result};
    }

    //道具数量
    async PropCount(user, params) {
        let uid = user.id;
        let ret = await this.core.service.gamegoldHelper.execute('prop.list', [1, uid]);
        user.baseMgr.info.setAttr('prop_count', ret.result.count);
        return {errcode: 'success', errmsg: 'prop.count:ok', count: ret.result.count};
    }

    //我的道具
    async PropList(user, params) {
        let page = params.page;
        let uid = user.id;
        let ret = await this.core.service.gamegoldHelper.execute('prop.list', [
            page, //游戏编号
            uid //openid
        ]);
        console.log(ret.result);
        let props = Array()
        for(let i=0; i<ret.result.list.length; i++) {
            let element = ret.result.list[i]
            //#region 从索引服务器取数
            //element.cp = await this.core.remoteCall("kv", {k:element.cid}, msg=>{return JSON.parse(msg);});
            //目前先暂时从本地服务器取数，未来视情形切换
            let cp = await this.core.callFunc("remotecall", "kv", user, {k:element.cid});
            if(!!cp) {
                element.cp = JSON.parse(cp);
            }
            //#endregion
            props.push(element);
        }
        return {errcode: 'success', errmsg: 'prop.list:ok', props: props, count: ret.result.count};
    }

    //道具熔铸
    async PropFound(user, params) {
        let pid = params.pid;
        let ret = await this.core.service.gamegoldHelper.execute('prop.found', [
            pid, //生产者编码
        ]);
        console.log(ret.result);
        return {errcode: 'success', errmsg: 'prop.found:ok', ret: ret.result};
    }

    //道具捐赠
    //prop.donate hash index [openid]
    async PropDonate(user, params) {
        let txid = this.core.service.gamegoldHelper.revHex(params.txid);
        let pid = params.pid;
        let index = params.index;
        let uid = user.id;
        /*
        let ret = await this.core.service.gamegoldHelper.execute('prop.donate', [
            txid,
            index,
            uid
        ]);
        */
       let ret = await this.core.service.gamegoldHelper.execute('prop.donate', [
            pid,
            uid
        ]);
        console.log(ret);
        if(!!!ret || ret.code != 0) {
            return {errcode: 'fail', errmsg: 'fail'};
        } else {
            return {errcode: 'success', errmsg: 'prop.donate:ok', ret: ret.result};
        }
    }

    //道具接收
    //prop.receive raw [openid]
    async PropReceive(user, params) {
        let raw = params.raw;
        let uid = user.id;
        let ret = await this.core.service.gamegoldHelper.execute('prop.receive', [
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
        let uid = user.id;
        let ret = await this.core.service.gamegoldHelper.execute('prop.send', [
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
        let uid = user.id;
        let ret = await this.core.service.gamegoldHelper.execute('prop.sale', [
            pid,
            fixedPrice,
            uid
        ]);
        console.log(ret.result);
        return {errcode: 'success', errmsg: 'prop.sale:ok', ret: ret.result};
    }

    //道具市场
    async PropListMarket(user, params) {
        let ret = await this.core.service.gamegoldHelper.execute('prop.remoteQuery', [[['pst', 2]]]);
        console.log(ret.result);
        return {errcode: 'success', errmsg: 'prop.list.market:ok', ret: ret.result.list};
    }

    //道具购买
    //prop.buy pid, price, openid
    async PropBuy(user, params) {
        let pid = params.pid;
        let price = params.price;
        let uid = user.id;
        let ret = await this.core.service.gamegoldHelper.execute('prop.buy', [
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
