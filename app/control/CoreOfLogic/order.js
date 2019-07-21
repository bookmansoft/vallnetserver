let facade = require('gamecloud')
let {TableType, TableField, IndexType} = facade.const;

/**
 * 节点控制器--订单
 * Updated on 2018-11-19.
 */
class order extends facade.Control
{
    /**
     * 订单支付
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async OrderPay(user, params) {
        let cid = params.cid;
        let user_id = params.user_id;
        let account = params.account;
        let sn = params.sn;
        let price = params.price;
        console.log(params);
        let ret = await this.core.service.gamegoldHelper.execute('order.pay', [
            cid, //game_id
            user_id, //user_id
            sn, //order_sn订单编号
            price, //order_sum订单金额
            account  //指定结算的钱包账户，一般为微信用户的openid
        ]);

        if(ret.result == null) {
            return {code: -1, msg: 'pay error'};
        } else {
            return {code: 0, data: ret.result};
        }
    }

    /**
     * 凭证一级市场购买
     * @param {*} user 
     * @param {*} params 
     */
    async CrowdPurchase(user, params) {
        // `uid` INT(8) UNSIGNED NOT NULL DEFAULT '0' COMMENT '用户编号',
        // `order_sn` VARCHAR(128) NOT NULL COMMENT '订单编号',
        // `order_num` INT(8) UNSIGNED NULL DEFAULT '0' COMMENT '支付金额',
        // `product_id` INT(8) UNSIGNED NULL DEFAULT '0' COMMENT '产品编号',
        // `product_info` VARCHAR(32) NULL DEFAULT NULL COMMENT '产品名称',
        // `order_status` INT(1) UNSIGNED NULL DEFAULT '0' COMMENT '订单状态',
        // `pay_status` INT(1) UNSIGNED NULL DEFAULT '0' COMMENT '支付状态',
        // `create_time` INT(8) UNSIGNED NULL DEFAULT '0' COMMENT '创建时间',
        // `update_time` INT(8) UNSIGNED NULL DEFAULT '0' COMMENT '更新时间',
        // `quantity` INT(4) NULL DEFAULT '1' COMMENT '数量',
        // `attach` VARCHAR(128) NULL DEFAULT NULL COMMENT '附件',
    
        let type = params.type;                         //众筹项目编号，索引到配置表'crowd'中的项目，类似商品编号
        let item = this.core.fileMap['crowd'][type];    //从配置表取对应的众筹项目
        let order_num = item.price * params.quantity;
        let current_time = parseInt(new Date().getTime() / 1000);
        let tradeId = this.core.service.wechat.getTradeId('vallnet');

        let cpObj = this.core.GetObject(TableType.blockgame, params.cid, IndexType.Foreign);
        if(cpObj) { 
            let orderItem = {
                uid: user.id,                                   //此处存疑，使用单服内用户编号，无法跨服识别
                order_sn: tradeId,                              //订单编号
                order_num: order_num,                           //订单支付总额
                product_id: item.pid,                           //产品编号，原始的的定义是：小于等于10的时候，代表VIP等级，大于10的时候，代表 our_block_stock 的主键
                product_info: item.desc,                        //产品描述
                attach: params.cid,                             //附加信息 - 此处填写凭证编号，即CP编号
                quantity: item.stock,                           //附加信息 - 此处填写凭证数量
                order_status: 0,
                pay_status: 0,
                create_time: current_time,
                update_time: 0,
            };
            await this.core.GetMapping(TableType.order).Create(orderItem);
            return {code: 0, data: {tradeId: tradeId, order:orderItem}};
        }
        
        return {code: -1};
    }

    /**
     * 普通订单下单
     */
    async CommonOrderRepay(user, params) {
        let current_time = parseInt(new Date().getTime() / 1000)
        let tradeId = this.core.service.wechat.getTradeId('vallnet')
        let orderItem = {
            uid: use.id,
            order_sn: tradeId,
            order_num: params.price,
            product_id: params.productId,
            product_info: params.productIntro,
            attach: params.attach,
            quantity: params.quantity,
            order_status: 0,
            pay_status: 0,
            create_time: current_time,
            update_time: 0,
        };
        await this.core.GetMapping(TableType.order).Create(orderItem);
        return {code: 0, data: {tradeId: tradeId, order:orderItem}};
    }

    async OrderStatus(user, params) {
        let tradeId = params.tradeId
        let userOrders = this.core.GetMapping(TableType.order).groupOf().where([['order_sn', '==', tradeId]]).records(TableField.order);
        if(userOrders.length >0 ) {
            let order = userOrders[0];
            return {code: 0, data: order};
        } else {
            return {code: -1, msg: 'order:error'};
        }
    }

    /**
     * 收到支付完成请求
     * @param {*} user 
     * @param {*} params 
     */
    async OrderPayResult(user, params) {
        let tradeId = params.tradeId
        let status = params.status

        let userOrders = this.core.GetMapping(TableType.order).groupOf().where([['order_sn', '==', tradeId]]).records();
        if(userOrders.length >0 ) {
            let order = userOrders[0]
            let current_time = parseInt(new Date().getTime() / 1000)
            order.setAttr('pay_status', status)
            order.setAttr('update_time', current_time)
            if(status==1) { //支付成功 
                if (order.orm.product_id < 10) {
                    let vip_level =  order.orm.product_id;
                    let current_time = parseInt(new Date().getTime() / 1000)
                    let month_time =  3600 * 24 * 30;

                    // `vip_level` INT(4) 'VIP等级',
                    // `vip_start_time` INT(8) 'VIP开始时间',
                    // `vip_end_time` INT(8) 'VIP结束时间',
                    // `vip_last_get_time` INT(8) 'VIP获取福利时间',
                    // `is_expired` INT(1) '是否过期',
                    // `vip_last_get_count` INT(8) 'VIP获取数量',
                    // `vip_usable_count` INT(8) 'VIP可用游戏金',
            
                    if(user.baseMgr.info.getAttr('is_expired') == 1) {   //过期，重新开卡
                        user.baseMgr.info.setAttr('vip_start_time', current_time);
                        user.baseMgr.info.setAttr('vip_end_time', current_time + month_time);
                        user.baseMgr.info.setAttr('vip_last_get_time', current_time);
                        user.baseMgr.info.setAttr('vip_last_get_count', 0);
                        user.baseMgr.info.setAttr('vip_level', vip_level);
                        user.baseMgr.info.setAttr('is_expired', 0);
                    } else if(user.baseMgr.info.getAttr('vip_level') == vip_level) {     //续费
                        user.baseMgr.info.setAttr('vip_end_time', user.baseMgr.info.getAttr('vip_end_time' + month_time));
                    } else if(user.baseMgr.info.getAttr('vip_level') < vip_level) {      //升级
                        user.baseMgr.info.setAttr('vip_level', vip_level);
                    }
                } else if (!!order.orm.attach) {
                    let cid = order.orm.attach;
                    let quantity = order.orm.quantity;
                    let addr = await this.core.service.userhelp.getAddrFromUserIdAndCid(user, cid);
                    await this.core.service.gamegoldHelper.execute('stock.send', [cid, quantity, addr, 'alice']);

                    //此时的 order.orm.product_id 是 our_block_stock 记录的主键，目前 our_block_stock 已经与 our_stock_base 整合，该字段包含信息已失去价值
                    //原流程中，此处会实时将凭证购买情况记录入库，但只能记录到本网站用户的购买记录
                    //目前已经调整为根据系统启动时查询主网，或者收到主网通知消息时入库
                }
            }
            return {code: 0}; 
        } else {
            return {code: -1, msg: 'no order'};
        }
    }
}

exports = module.exports = order;
