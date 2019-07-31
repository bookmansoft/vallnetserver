let facade = require('gamecloud')
let {TableType, TableField, IndexType, PurchaseStatus, EntityType} = facade.const;

/**
 * 节点控制器--订单
 * Updated on 2018-11-19.
 */
class order extends facade.Control
{
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
                let stockList = this.core.GetMapping(TableType.StockBase).groupOf()
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

                //填充订单信息
                price = item.price * params.order.num;                                  //订单金额
                product = `crowd, ${stock.id}, ${item.stock*params.order.num}`;       //订单内容：一级市场凭证若干
                product_desc = item.desc;                                               //订单描述
        
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
    
            await this.core.GetMapping(EntityType.BuyLog).Create(`${user.domainId}`, tradeId, product, product_desc, price);

            return { code: 0, data: res };
        }

        return { code: -1 };
    }
    /**
     * 使用游戏金支付订单
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async OrderPay(user, params) {
        let cid = params.cid;       //CPID
        let sn = params.sn;         //item.id + '-new-' + this.randomString(16);
        let price = params.price;

        let ret = await this.core.service.gamegoldHelper.execute('order.pay', [
            cid,            //CPID
            user.domainId,  //用户ID
            sn,             //order_sn订单编号
            price,          //order_sum订单金额
            user.domainId,  //指定结算的钱包账户，本系统中和用户ID一致
        ]);

        if(ret.result == null) {
            return {code: -1, msg: 'pay error'};
        } else {
            return {code: 0, data: ret.result};
        }
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

            //此处并不处理订单，要等到微信回调，触发 config.wxnotify 才会真正处理订单内容，或者由定时程序反向问询微信

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

exports = module.exports = order;
