let facade = require('gamecloud')
let {IndexType, EntityType} = facade.const;

/**
 * 钱包
 * Updated on 2018-11-19.
 */
class wallet extends facade.Control
{
    /**
     * 创建一个收款地址：address.create 不需要参数
     * 
     * @param {*} user 
     */
    async AddressCreate(user) {
        let ret = await this.core.service.gamegoldHelper.execute('address.create', [user.account]);
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
            user.account,
        ]); 
        return {code: 0, data: ret.result};
    }

    /**
     * 支付待支付订单
     * @param {*} user 
     * @param {*} params 
     */
    async NotifyOrderPay(user, params) {
        let mail = this.core.GetObject(EntityType.Mail, params.sn, IndexType.Domain);
        if(!mail || mail.dst != user.openid) {
            return {code: -2, msg: 'notify not exist'}; 
        }

        let content = JSON.parse(mail.content);
        if(content.type != 10002) {
            return {code: -2, msg: 'notify not exist'}; 
        }
        let order = JSON.parse(content.info.content.body.content);
        let ret = await this.core.service.gamegoldHelper.execute('order.pay', [
            order.cid,          //game_id
            user.account,       //user_id
            order.sn,           //order_sn订单编号
            order.price,        //order_sum订单金额
            user.account,       //指定结算的钱包账户，一般为微信用户的openid
        ]);

        if(ret.code == 0) {
          return {code: 0, data:ret.result}; 
        }  else {
          return {code: -1, msg: 'pay error'}; 
        }
    }
}

exports = module.exports = wallet;
