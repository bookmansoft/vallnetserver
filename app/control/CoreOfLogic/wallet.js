let facade = require('gamecloud')
let remoteSetup = require('../../util/gamegold');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');
//引入工具包
const toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
const remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch'));  
remote.setup(remoteSetup);

/**
 * 钱包
 * Updated by thomasFuzhou on 2018-11-19.
 */
class wallet extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        console.log('wallet middleware');
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 创建一个收款地址：address.create 不需要参数
     * 
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async AddressCreate(user, paramGold) {
        console.log(paramGold.items);
        let ret = await remote.execute('address.create', paramGold.items);
        console.log(ret);
        return {errcode: 'success', errmsg: 'address.create:ok', ret: ret};
    }

    /**
     * 根据输入的金额和地址，创建、签署、发送一笔P2PKH类转账交易：
     * 【钱包-转出功能使用】
     * tx.send addr value [openid]
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async TxSend(user, params) {
        let addr = params.addr;
        let amount = params.amount;
        let openid = params.openid;
        let ret = await remote.execute('tx.send', [
            addr, 
            amount,
            openid
        ]);      
        console.log(ret);
        return {errcode: 'success', errmsg: 'tx.send:ok', ret: ret}; 
    }

    /**
     * 查询账户余额
     * balance.all [openid]
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
     async BalanceAll(user, params) {
        let openid = params.openid;
        let ret = await remote.execute('balance.all', [
            openid //openid
        ]);    
        console.log(ret);
        return {errcode: 'success', errmsg: 'balance.all:ok', balance: ret}; 
    }

    /**
     * 查询交易记录
     * tx.list openid [number]
     * @param {*} user        
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async TxLogs(user, params) {                      
        let openid = params.openid;
        let number = 10000;                          
        let ret = await remote.execute('tx.list', [
            openid, 
            number
        ]);    
        console.log(ret);
        return {errcode: 'success', errmsg: 'tx.list:ok', list: ret};           
    }

    /**
     * 系统通知
     * @param {*} user 
     * @param {*} params 
     */
    async GetNotify(user, params) {
        let openid = params.openid
        let ret = await remote.execute('sys.listNotify', [
            1 
        ]);
        if(!!ret && ret.length > 0) {
            ret.forEach(element => {
                let blockNotifys = facade.GetMapping(tableType.blockNotify).groupOf().where([['sn', '==', element.sn]]).records();
                if(blockNotifys.length==0) {
                    let current_time = parseInt(new Date().getTime() / 1000)
                    let notifyOpenid = ''
                    try {
                        let obj = eval('(' + (element.body.content) + ')')
                        if(!!obj && obj.hasOwnProperty('address')) {
                            let addr = obj.address
                            let userWallets = facade.GetMapping(tableType.userWallet).groupOf().where([['addr', '==', addr]]).records();
                            if(userWallets.length >0) {
                                notifyOpenid = userWallets[0].orm.openid
                            }
                        }
                    } catch(e) {

                    }
                    let notifyItem = {
                        sn: element.sn,
                        h: element.h,
                        status: element.status,
                        content: element.body.content,
                        type: element.body.type,
                        openid: notifyOpenid,
                        create_time: current_time,
                        update_time: 0
                    }
                    facade.GetMapping(tableType.blockNotify).Create(notifyItem);
                }
            });
        }
        let blockNotifys = facade.GetMapping(tableType.blockNotify).groupOf().where([
            ['openid', '==', openid],
            ['status', '==', 1]
        ]).records();
        return {errcode: 'success', errmsg: 'notify.list:ok', count: blockNotifys.length}; 
    }

    /**
     * 消息列表
     * @param {*} user 
     * @param {*} params 
     */
    async NotifyList(user, params) {
        let openid = params.openid
        let blockNotifys = facade.GetMapping(tableType.blockNotify).groupOf().where([
            ['openid', '==', openid]
        ]).records();
        let data = new Array()
        if(blockNotifys.length >0 ) {
            blockNotifys.forEach(element => {
                if(element.orm.status == 1) {
                    element.setAttr('status', 2);
                    element.orm.save()
                }
                data.push(element.orm)
            });
        }
        return {errcode: 'success', errmsg: 'notify.list:ok', notifys: data}; 
    }

    /**
     * 消息列表
     * @param {*} user 
     * @param {*} params 
     */
    async NotifyOrderPay(user, params) {
        let openid = params.openid
        let sn = params.sn
        let blockNotifys = facade.GetMapping(tableType.blockNotify).groupOf().where([
            ['openid', '==', openid],
            ['sn', '==', sn]
        ]).records();
        if(blockNotifys.length > 0) {
            let blockNotify = blockNotifys[0]
            let obj = eval('(' + (blockNotify.orm.content) + ')')
            if(!!obj && obj.hasOwnProperty('cid') && obj.hasOwnProperty('price') && obj.hasOwnProperty('sn')) { 
                let cid = obj.cid;
                let uid = openid;
                let sn = obj.sn;
                let price = obj.price;
                let ret = await remote.execute('order.pay', [
                    cid, //game_id
                    uid, //user_id
                    sn, //order_sn订单编号
                    price, //order_sum订单金额
                    openid  //指定结算的钱包账户，一般为微信用户的openid
                ]);
               if(ret != null) {
                  blockNotify.setAttr('status', 3);
                  blockNotify.orm.save()
                  return {errcode: 'success', errmsg: 'notify.orderpay:ok', ret:ret}; 
               }  else {
                  return {errcode: 'fail', errmsg: 'pay error', ret: null}; 
               }
            } else {
                return {errcode: 'fail', errmsg: 'invalid order'}; 
            }
        } else {
            return {errcode: 'fail', errmsg: 'notify not exist'}; 
        }
    }

}

exports = module.exports = wallet;
