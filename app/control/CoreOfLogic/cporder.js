let facade = require('gamecloud');
let {TableType} = facade.const;
let tableField = require('../../util/tablefield');
let randomHelp = require('../../util/randomHelp');

/**
 * 游戏用户
 * Create by gamegold Fuzhou on 2018-11-27
 */
class cporder extends facade.Control
{
    //用户信息
    async PropBuy(user, params)  {
        let prop_id = params.prop_id;
        let uid = user.id;
        let addr = params.addr;
        let openid = params.openid;
        let cpprops = this.core.GetMapping(TableType.cpprop).groupOf().where([['id','==',prop_id]]).records(tableField.cpprop);
        let cpusers = this.core.GetMapping(TableType.cpuser).groupOf().where([['id','==',uid]]).records(tableField.cpuser);
        if(cpprops.length> 0 && cpusers.length > 0 ) {
            let cpprop = cpprops[0];
            let created_at = new Date().getTime();
            let random = new randomHelp();
            let cpOrderItem = {
                uid: uid,
                openid: openid,
                user_addr: addr,
                order_sn: random.randomString(6) + "-" + random.randomNum(6),
                order_num: cpprop.price,
                prop_id: cpprop.id,
                prop_name: cpprop.prop_name,
                prop_oid: cpprop.oid,
                prop_value: cpprop.gold,
                prop_icon: cpprop.prop_icon,
                order_status: 0,
                prop_status: 0,
                pay_status: 0,
                create_time: created_at,
                update_time: 0
            }
            this.core.GetMapping(TableType.cporder).Create(cpOrderItem);
        }
        return {code: 0};
    };
    
    //用户订单
    async OrderList(user, params)  {
        let uid = user.id;
        let orders = this.core.GetMapping(TableType.cporder).groupOf().where([['uid','==',uid]]).orderby('create_time', 'desc').records(tableField.cporder);
        return {code: 0, data: {orders: orders}};
    };

    //支付订单
    async OrderNotify(user, params)  {
        let sn = params.sn;
        let cid = params.cid;
        let status = params.status;
        //let msg = params.msg;
        let cpOrders = this.core.GetMapping(TableType.cporder).groupOf().where([['order_sn','==',sn]]).records();
        if(cpOrders.length >0 ) {
            let cporder = cpOrders[0];
            cporder.setAttr('pay_status', status);                    //修改所得记录的pay_status字段，下次查询时将得到新值，同时会自动存入数据库
            let cporder_orm = cporder.orm;
            if(status==1) {
                let user_addr = cporder_orm.user_addr;
                let prop_oid = cporder_orm.prop_oid;
                let prop_value = cporder_orm.prop_value;
                //发送道具
                //npm run cli rpc prop.order {game_id} {prop_ori_id} {prop_value} {user_addr}
                let ret = await this.core.service.gamegoldHelper.execute('prop.order', [
                    cid,        //游戏编号
                    prop_oid,   //道具原始
                    prop_value, //道具含金量
                    user_addr   //游戏内玩家的有效地址
                ]);
                return {code: 0, data: {cid: cid, user_addr: user_addr, ret: ret.result}};
            }
        }
        return {code: 0};
    }    
}

exports = module.exports = cporder;
