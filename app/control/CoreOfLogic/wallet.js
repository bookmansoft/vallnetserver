const assert = require('assert')
let facade = require('gamecloud')
let {TableType, TableField} = facade.const;

/**
 * 钱包
 * Updated on 2018-11-19.
 */
class wallet extends facade.Control
{
    /**
     * 查询交易记录
     * tx.list openid [number]
     * @param {*} user        
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async TxLogs(user, params) {
        let ret = await this.core.service.gamegoldHelper.execute('tx.list', [user.domainId]);
        if(ret.code == 0) {
            return {code: 0, data: {list: ret.result}};
        } else {
            return {code: ret.code};
        }
    }

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
            user.domainId,
        ]); 
        return {code: 0, data: ret.result};
    }

    /**
     * 消息列表
     * @param {*} user 
     * @param {*} params 
     */
    async NotifyOrderPay(user, params) {
        let ret = await this.core.service.gamegoldHelper.execute('sys.listNotify', [[['sn', params.sn]]]);
        if(ret.code == 0 && ret.result.list.length > 0) {
            let blockNotify = ret.result.list[0];
            if(blockNotify.account == user.domainId) {
                let obj = (typeof blockNotify.body.content == 'string') ? JSON.parse(blockNotify.body.content) : blockNotify.body.content;
                if(!!obj && obj.hasOwnProperty('cid') && obj.hasOwnProperty('price') && obj.hasOwnProperty('sn')) { 
                    let ret = await this.core.service.gamegoldHelper.execute('order.pay', [
                        obj.cid,        //game_id
                        user.domainId,  //user_id
                        obj.sn,         //order_sn订单编号
                        obj.price,      //order_sum订单金额
                        user.domainId,  //指定结算的钱包账户，一般为微信用户的openid
                    ]);
    
                    if(ret.code == 0) {
                      return {code: 0, data:ret.result}; 
                    }  else {
                      return {code: -1, msg: 'pay error'}; 
                    }
                } else {
                    return {code: -1, msg: 'invalid order'}; 
                }
            }
        }
        return {code: -2, msg: 'notify not exist'}; 
    }
}

exports = module.exports = wallet;
