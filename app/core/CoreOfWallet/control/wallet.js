let facade = require('gamecloud')
let {SettleType, TableField, PurchaseStatus, IndexType, EntityType} = facade.const;
let uuid = require('uuid');
let fetch = require('node-fetch')

/**
 * 钱包
 * Updated on 2018-11-19.
 */
class wallet extends facade.Control
{
    get router() {
        return [
            ['/wxnotify', 'wxnotify'],
        ];
    }

    /**
     * 添加微信支付回调路由
     * @param {*} params 
     */
    async wxnotify(params) {
        try {
            //验证签名、解析字段
            let data = await this.service.wechat.verifyXml(params); 
            if(!data) {
                throw new Error('error sign code');
            }

            //触发 wallet.payCash 事件，执行订单确认、商品发放流程
            this.notifyEvent('wallet.payCash', {data: data});

            //给微信送回应答
            return `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`;
        } catch (e) {
            console.log('wxnotify', e.message);
        }
    }
    
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
            /** params {
                    sn          //订单编号
                    time        //订单生成时间戳
                    confirmed   //确认数，-1表示尚未被主网确认，而当确认数标定为0时，表示已被主网确认，只是没有上链而已
                    oid         //道具模板编码
                    fee_type    //订单支付类型
                }
            */

            params.time = Date.now()/1000;                      //订单生成时间戳
            params.confirmed = -1;                              //确认数，-1表示尚未被主网确认，而当确认数标定为0时，表示已被主网确认，只是没有上链而已
            params.sn = params.sn || uuid.v1();                 //订单编号
            params.fee_type = SettleType.Gamegold;              //订单支付类型

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
            if(!res || res.code != 0) {
                throw new Error('commit order error');
            }
   
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
                return {code: 0, data: ret.result};
            }
        } catch(e) {
            console.log(e);
        }
    }

    /**
     * 收到客户端订单申请请求，生成订单条目
     * @param {*} user 
     * @param {*} params
    */
    async prepay(user, params) {
        let price = 0;
        let product = null;
        let product_desc = '';

        //根据订单类型分别处理
        switch(params.order.type) {
            case 'crowd': { //凭证一级市场购买
                let stockList = this.core.GetMapping(EntityType.StockBase).groupOf()
                    .where([['cid', params.order.cid]])
                    .orderby('height', 'desc')
                    .records(TableField.StockBase);

                let stock = stockList[0]
                if(!stock) { 
                    return { code: -1 };
                }

                //从配置表取对应的众筹项目
                let item = this.core.fileMap['crowd'][params.order.id];    
                if(!item) { 
                    return { code: -1 };
                }

                let baseConfig = this.core.fileMap['base'];

                //填充订单信息
                if(item.stock == 0) {
                    price = params.order.num;
                } else {
                    price = parseFloat(
                        stock.price / baseConfig.kg     //atom化为KG
                        * item.stock                    //选项包含的凭证数量
                        * params.order.num              //选项数量
                        * baseConfig.kgprice            //KG单价
                    ).toFixed(2);
                }

                product = `crowd, ${stock.id}, ${item.stock*params.order.num}`;       //订单内容：一级市场凭证若干
                product_desc = item.desc;                                             //订单描述
        
                break;
            }

            case 'vip': {
                let vl = user.baseMgr.info.getAttr('vl') || 0;
                let vst = user.baseMgr.info.getAttr('vst');
                let vet = user.baseMgr.info.getAttr('vet');
                let cfg = this.core.fileMap['vip'];

                product = `vip,${params.order.id}`;                                         //订单内容：VIP升级
                product_desc = cfg[params.order.id].label;                                  //订单描述

                //如下是三种互斥的场景，分别计算各自价格。支付完成后，由 `RegisterResHandle('vip'...` 登记的句柄完成VIP属性的修改
                if(!vl) { 
                    //新开通，支付全额，新增有效期30天
                    price = cfg[params.order.id].price;                                     //订单金额
                } else if(params.order.id == vl) { 
                    //同级延期，支付全额，延展有效期30天
                    price = cfg[params.order.id].price;                                     //订单金额
                } else if(params.order.id > vl) { 
                    //升级，支付差额，有效期不变
                    let days = ((vet - vst) / (24 * 3600)) | 0;
                    price = (cfg[params.order.id].price - cfg[vl].price) / 30 * days;       //订单金额
                }
                break;
            }
        }

        if(!!price && !!product) {
            let tradeId = this.core.service.wechat.getTradeId('vallnet');

            //test only
            //let res = await this.core.service.wechat.unifiedOrder(user.openidOri, user.userip, price, product_desc, tradeId);
            let res = {};
            //end

            res.tradeId = tradeId;

            console.log('支付', `${user.domainId}`, tradeId, product, product_desc, price);

            await this.core.GetMapping(EntityType.BuyLog).Create(
                `${user.domainId}`, 
                tradeId, 
                product, 
                product_desc, 
                price,
                1,
            );

            return { code: 0, data: res };
        }

        return { code: -1 };
    }

    /**
     * 查询订单信息
     * @param {*} user 
     * @param {*} params 
     */
    async OrderStatus(user, params) {
        let userOrders = this.core.GetObject(EntityType.BuyLog, params.tradeId, IndexType.Domain);
        if(!!userOrders) {
            return {code: 0, data: TableField.record(userOrders.orm, TableField.BuyLog)};
        } else {
            return {code: -1, msg: 'order:error'};
        }
    }

    /**
     * 收到客户端支付完成请求, 修改订单状态
     * @param {*} user 
     * @param {*} params 
     */
    async OrderPayResult(user, params) {
        // const PurchaseStatus = {
        //     create: 0,          //订单已生成
        //     prepay: 1,          //订单已支付 - client
        //     commit: 2,          //订单已支付 - server
        //     cancel: 3,          //订单已取消
        // };

        let order = this.core.GetObject(EntityType.BuyLog, params.tradeId, IndexType.Domain);
        if(!!order && order.orm.domainid == user.domainId) { //必须验证订单所有者信息
            if(order.orm.result == PurchaseStatus.create) {
                order.setAttr('result', PurchaseStatus.prepay);
            }

            //此处并不处理订单，要等到微信回调，触发 wxnotify 才会真正处理订单内容，或者由定时程序反向问询微信

            //test only 此处为模拟测试流程，直接结算订单
            this.core.notifyEvent('wallet.payCash', {data: {
                return_code: 'SUCCESS',
                out_trade_no: params.tradeId,
                result_code: 'SUCCESS',
            }});
            //end

            return {code: 0};
        } else {
            return {code: -1, msg: 'no order'};
        }
    }
}

exports = module.exports = wallet;
