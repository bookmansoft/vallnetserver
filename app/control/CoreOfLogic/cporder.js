let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');
let randomHelp = require('../../util/randomHelp');

/**
 * 游戏用户
 * Create by gamegold Fuzhou on 2018-11-27
 */
class cporder extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    //用户信息
    async PropBuy(user, params)  {
        let prop_id = params.prop_id;
        let uid = params.uid;
        let addr = params.addr;
        let openid = params.openid;
        let cpprops = facade.GetMapping(tableType.cpProp).groupOf().where([['id','==',prop_id]]).records(tableField.cpProp);
        let cpusers = facade.GetMapping(tableType.cpUser).groupOf().where([['id','==',uid]]).records(tableField.cpUser);
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
            facade.GetMapping(tableType.cpOrder).Create(cpOrderItem);
        }
        return {errcode: 'success', errmsg:'propbuy:ok'};
    };
    
    //用户订单
    async OrderList(user, params)  {
        let uid = params.uid;
        let orders = facade.GetMapping(tableType.cpOrder).groupOf().where([['uid','==',uid]]).orderby('create_time', 'desc').records(tableField.cpOrder);
        return {errcode: 'success', errmsg:'orderlist:ok', orders: orders};
    };

    //支付订单
    async OrderNotify(user, params)  {
        let sn = params.sn;
        let status = params.status;
        let msg = params.msg;
        let cpOrders = facade.GetMapping(tableType.cpOrder).groupOf().where([['order_sn','==',sn]]).records();
        if(cpOrders.length >0 ) {
            let cporder = cpOrders[0];
            cporder.setAttr('pay_status', status);                    //修改所得记录的pay_status字段，下次查询时将得到新值，同时会自动存入数据库
            //发送道具
            /*
            let cid = 'd756ea10-e3ea-11e8-96d3-37610724598b';
            let prop_oid = cporder.prop_oid;
            let prop_value = cporder.order_num;
            let user_addr = cporder.addr;
            //npm run cli rpc prop.order {game_id} {prop_ori_id} {prop_value} {user_addr}
            remote.execute('prop.order', [
                cid, //游戏编号
                prop_oid, //道具原始
                prop_value, //道具含金量
                user_addr //游戏内玩家的有效地址
            ]);
            */
        }
        return {errcode: 'success', errmsg:'ordernotify:ok'};
    }    
}

exports = module.exports = cporder;
