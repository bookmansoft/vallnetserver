let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');
let randomHelp = require('../../util/randomHelp');
//引入工具包
var toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
var remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch')) 
remote.setup({
        type:   'testnet',
        ip:     '114.116.12.248',     //远程服务器地址
        head:   'http',               //远程服务器通讯协议，分为 http 和 https
        id:     'primary',            //默认访问的钱包编号
        apiKey: 'bookmansoft',        //远程服务器基本校验密码
        cid:    'xxxxxxxx-game-gold-root-xxxxxxxxxxxx', //授权节点编号，用于访问远程钱包时的认证
        token:  '03aee0ed00c6ad4819641c7201f4f44289564ac4e816918828703eecf49e382d08', //授权节点令牌固定量，用于访问远程钱包时的认证
});
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
        let cid = params.cid;
        let status = params.status;
        //let msg = params.msg;
        let cpOrders = facade.GetMapping(tableType.cpOrder).groupOf().where([['order_sn','==',sn]]).records();
        if(cpOrders.length >0 ) {
            let cporder = cpOrders[0];
            cporder.setAttr('pay_status', status);                    //修改所得记录的pay_status字段，下次查询时将得到新值，同时会自动存入数据库
            cporder.orm.save();
            let cporder_orm = cporder.orm;
            if(status==1) {
                let user_addr = cporder_orm.user_addr;
                let prop_oid = cporder_orm.prop_oid;
                let prop_value = cporder_orm.prop_value;
                //发送道具
                //npm run cli rpc prop.order {game_id} {prop_ori_id} {prop_value} {user_addr}
                let ret = await remote.execute('prop.order', [
                    cid,        //游戏编号
                    prop_oid,   //道具原始
                    prop_value, //道具含金量
                    user_addr   //游戏内玩家的有效地址
                ]);
                console.log(ret);
                return {errcode: 'success', errmsg:'ordernotify:ok', cid: cid, user_addr: user_addr, ret: ret};
            }
        }
        return {errcode: 'success', errmsg:'ordernotify:ok'};
    }    
}

exports = module.exports = cporder;
