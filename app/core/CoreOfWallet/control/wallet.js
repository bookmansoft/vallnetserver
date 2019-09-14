let facade = require('gamecloud')
let {IndexType, EntityType} = facade.const;
let uuid = require('uuid');
let fetch = require('node-fetch')

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
        if(content.type != 10002) { //必须是订单支付类消息才会在此处理
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

    /**
     * 使用游戏金支付订单
     * @param {*} user 
     * @param {*} params
     * @description 分为如下两种情形：
     * 1. sn 置空：直接从钱包发起交易并完成支付，此时CP方尚未形成订单
     * 2. sn 已填：CP方形成订单后，传递订单到钱包、完成支付
     */
    async OrderPay(user, params) {
        try {
            params.time = Date.now()/1000;                      //时间戳
            params.confirmed = -1;                              //确认数，-1表示尚未被主网确认，而当确认数标定为0时，表示已被主网确认，只是没有上链而已
            params.addr = user.baseMgr.info.getAttr('acaddr');  //用户地址

            params.sn = params.sn || uuid.v1(); 

            //查询CP信息
            let cpObj = this.core.GetObject(EntityType.blockgame, params.cid, IndexType.Domain);
            if(!cpObj) { 
                throw new Error('cp not exist');
            }

            //查询当前用户对应该CP的身份信息
            let pack = await this.core.service.gamegoldHelper.getUserToken(user, params.cid);
            if(!pack) {
                throw new Error('user not exist');
            }

            //同时提交身份认证和订单信息
            const newOptions = { json: true, method: 'POST', mode: 'cors', body: JSON.stringify({
                auth: pack,
                ...params,
            })};
            newOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            };
    
            let res = await fetch(`${cpObj.orm.cpurl}/${this.core.service.gamegoldHelper.network}/order/add`, newOptions);
            res = await res.json();
   
            if(res.code == 0) {
                //广播订单支付信息
                let ret = await this.core.service.gamegoldHelper.execute('order.pay', [
                    params.cid,     //CP编码
                    user.account,   //用户ID
                    params.sn,      //订单编号
                    params.price,   //订单金额, 单位尘
                    user.account,   //指定结算的钱包账户，本系统中和用户ID一致
                ]);
        
                if(ret.code != 0) {
                    return {code: ret.code, msg: ret.error.message};
                } else {
                    /** params {
                            sn          //订单编号
                            time        //订单生成时间戳
                            confirmed   //确认数，-1表示尚未被主网确认，而当确认数标定为0时，表示已被主网确认，只是没有上链而已
                            addr        //用户地址
                            oid         //道具模板编码
                        }
                    */
                    return {code: 0, data: ret.result};
                }
            }
        } catch(e) {
            console.log(e);
        }
    }
}

exports = module.exports = wallet;
