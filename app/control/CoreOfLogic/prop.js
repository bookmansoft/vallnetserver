let facade = require('gamecloud')
let {TableType} = facade.const;

/**
 * 节点控制器--道具
 * Updated on 2018-11-19.
 */
class prop extends facade.Control
{
    //道具发送
    async PropOrder(user, params)  {
        let cid = params.cid;
        let prop_ori_id = params.prop_ori_id;
        let prop_value = params.prop_value;
        let user_addr = params.user_addr;
        let ret = await this.core.service.gamegoldHelper.execute('prop.order', [
            cid, //游戏编号
            prop_ori_id, //道具原始
            prop_value, //道具含金量
            user_addr //游戏内玩家的有效地址
        ]);
        return {code: 0, data: ret.result};
    }

    //道具确权
    async QueryProps(user, params) {
        let cid = params.cid;
        let user_addr = params.user_addr;
        let ret = await this.core.service.gamegoldHelper.execute('queryProps', [
            cid, //游戏编号
            user_addr //游戏内玩家的有效地址
        ]);
        return {code: 0, data: ret.result};
    }

    //道具数量
    async PropCount(user, params) {
        let ret = await this.core.service.gamegoldHelper.execute('prop.list', [1, user.openid]);
        user.baseMgr.info.setAttr('prop_count', ret.result.count);
        return {code: 0, data: {count: ret.result.count}};
    }

    //我的道具
    async PropList(user, params) {
        let page = params.page;
        let ret = await this.core.service.gamegoldHelper.execute('prop.list', [
            page, //游戏编号
            user.openid
        ]);
        let props = Array()
        for(let i=0; i<ret.result.list.length; i++) {
            let element = ret.result.list[i]
            //#region 从索引服务器取数
            element.cp = await this.core.remoteCall("kv", {k:element.cid}, msg=>{return JSON.parse(msg);});
            //#endregion
            props.push(element);
        }
        return {code: 0, data : {props: props, count: ret.result.count}};
    }

    //道具熔铸
    async PropFound(user, params) {
        let pid = params.pid;
        let ret = await this.core.service.gamegoldHelper.execute('prop.found', [
            pid, //生产者编码
        ]);
        return {code: 0, msg: 'prop.found:ok', data: ret.result};
    }

    /**
     * 道具捐赠 prop.donate hash index [openid]
     * @param {*} user 
     * @param {*} params 
     */
    async PropDonate(user, params) {
        let txid = this.core.service.gamegoldHelper.revHex(params.txid);
        let pid = params.pid;
        let index = params.index;
       let ret = await this.core.service.gamegoldHelper.execute('prop.donate', [
            pid,
            user.openid
        ]);

        if(!!!ret || ret.code != 0) {
            return {code: -1, msg: 'fail'};
        } else {
            return {code: 0, data: ret.result};
        }
    }

    //道具接收
    //prop.receive raw [openid]
    async PropReceive(user, params) {
        let raw = params.raw;
        let ret = await this.core.service.gamegoldHelper.execute('prop.receive', [
            raw, 
            user.openid,
        ]);    
        return {code: 0, msg: 'prop.receive:ok', data: ret.result};
    }  

    //道具转移
    async PropSend(user, params) {
        let addr = params.addr;
        let pid = params.pid;
        let ret = await this.core.service.gamegoldHelper.execute('prop.send', [
            addr, 
            pid,
            user.openid
        ]); 
        return {code: 0, data: ret.result};
    }     

    //道具出售
    //prop.sale hash index fixedPrice [openid]
    async PropSale(user, params) {
        let pid = params.pid;
        let fixedPrice = params.fixedPrice;
        let ret = await this.core.service.gamegoldHelper.execute('prop.sale', [
            pid,
            fixedPrice,
            user.openid
        ]);
        return {code: 0, data: ret.result};
    }

    //道具市场
    async PropListMarket(user, params) {
        let ret = await this.core.service.gamegoldHelper.execute('prop.remoteQuery', [[['pst', 2]]]);
        return {code: 0, data: ret.result.list};
    }

    //道具购买
    //prop.buy pid, price, openid
    async PropBuy(user, params) {
        let pid = params.pid;
        let price = params.price;
        let ret = await this.core.service.gamegoldHelper.execute('prop.buy', [
            pid,
            price,
            user.openid
        ]);     

        if(!!ret && ret.code == 0) {
            return {code: 0, data: ret.result}; 
        } else {
            return {code: -1, msg: 'prop.buy:ok'};
        }
    }
}

exports = module.exports = prop;
