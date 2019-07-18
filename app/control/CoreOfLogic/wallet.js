let facade = require('gamecloud')
let {TableType} = facade.const;
const assert = require('assert')
let tableField = require('../../util/tablefield');

/**
 * 钱包
 * Updated by thomasFuzhou on 2018-11-19.
 */
class wallet extends facade.Control
{
    /**
     * 创建一个收款地址：address.create 不需要参数
     * 
     * @param {*} user 
     */
    async AddressCreate(user) {
        let ret = await this.core.service.gamegoldHelper.execute('address.create', [user.domainId]);
        if(ret.code == 0) {
            return {code: 0, data: ret.result.address};
        } else {
            return {code: -1};
        }
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
        let ret = await this.core.service.gamegoldHelper.execute('tx.send', [
            addr,
            amount,
            user.openid,
        ]); 
        return {code: 0, data: ret.result};
    }

    /**
     * 查询交易记录
     * tx.list openid [number]
     * @param {*} user        
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async TxLogs(user, params) {                      
        let ret = await this.core.service.gamegoldHelper.execute('tx.list', [use.openid,]);    
        assert(ret.result[0].account);
        return {code: 0, data: {list: ret.result}};
    }

    /**
     * 系统通知
     * @param {*} user 
     * @param {*} params 
     */
    async GetNotify(user, params) {
        let uid = user.id;
        let ret = await this.core.service.gamegoldHelper.execute('sys.listNotify', [1]);
        if(!!ret && ret.result.length > 0) {
            ret.result.forEach(element => {
                let blockNotifys = this.core.GetMapping(TableType.blockNotify).groupOf().where([['sn', '==', element.sn]]).records();
                if(blockNotifys.length==0) {
                    let current_time = parseInt(new Date().getTime() / 1000)
                    let notifyUid = ''
                    try {
                        let obj = JSON.parse(element.body.content);
                        if(!!obj && obj.hasOwnProperty('address')) {
                            let addr = obj.address
                            let userWallets = this.core.GetMapping(TableType.userwallet).groupOf().where([['addr', '==', addr]]).records();
                            if(userWallets.length >0) {
                                notifyUid = userWallets[0].orm.uid
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
                        uid: notifyUid,
                        create_time: current_time,
                        update_time: 0
                    }
                    this.core.GetMapping(TableType.blockNotify).Create(notifyItem);
                }
            });
        }
        let blockNotifys = this.core.GetMapping(TableType.blockNotify).groupOf().where([
            ['uid', '==', uid],
            ['status', '==', 1]
        ]).records();

        return {code : 0, data: {count: blockNotifys.length}};
    }

    /**
     * 消息列表
     * @param {*} user 
     * @param {*} params 
     */
    async NotifyList(user, params) {
        let openid = params.openid
        let blockNotifys = this.core.GetMapping(TableType.blockNotify).groupOf().where([
            ['openid', '==', openid]
        ]).records();
        let data = new Array()
        if(blockNotifys.length >0 ) {
            blockNotifys.forEach(element => {
                if(element.orm.status == 1) {
                    element.setAttr('status', 2);
                }
                data.push(tableField.record(element.orm, tableField.blockNotify))
            });
        }
        return {code: 0, msg: 'notify.list:ok', data: data}; 
    }

    /**
     * 消息列表
     * @param {*} user 
     * @param {*} params 
     */
    async NotifyOrderPay(user, params) {
        let openid = params.openid
        let sn = params.sn
        let blockNotifys = this.core.GetMapping(TableType.blockNotify).groupOf().where([
            ['openid', '==', openid],
            ['sn', '==', sn]
        ]).records();
        if(blockNotifys.length > 0) {
            let blockNotify = blockNotifys[0];
            let obj = JSON.parse(blockNotify.orm.content);
            if(!!obj && obj.hasOwnProperty('cid') && obj.hasOwnProperty('price') && obj.hasOwnProperty('sn')) { 
                let cid = obj.cid;
                let uid = openid;
                let sn = obj.sn;
                let price = obj.price;
                let ret = await this.core.service.gamegoldHelper.execute('order.pay', [
                    cid, //game_id
                    uid, //user_id
                    sn, //order_sn订单编号
                    price, //order_sum订单金额
                    openid  //指定结算的钱包账户，一般为微信用户的openid
                ]);

                if(ret != null) {
                  blockNotify.setAttr('status', 3);
                  return {code: 0, data:ret.result}; 
                }  else {
                  return {code: -1, msg: 'pay error'}; 
                }
            } else {
                return {code: -1, msg: 'invalid order'}; 
            }
        } else {
            return {code: -2, msg: 'notify not exist'}; 
        }
    }

}

exports = module.exports = wallet;
