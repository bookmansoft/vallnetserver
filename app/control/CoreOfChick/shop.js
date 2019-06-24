let facade = require('gamecloud')
let {EntityType, IndexType, UserStatus, CommMode, NotifyType, ResType, ReturnCode, PurchaseStatus, em_Condition_Type} = facade.const
let BonusObject = facade.Util.BonusObject

class shop extends facade.Control
{
    /**
     * 游戏大厅购物流程：客户端购买指定商品，按TX现有流程，将返回客户端一些准备参数，之后客户端提交到TX，TX反向调用服务端，服务端校验通过后，调用 CommitTrade 函数向用户发放商品，并下行通知
     * @param pUser
     * @param objData
     * @returns {{code: number, data: {tradeNo: string}}}
     */
    async BuyItem(pUser, objData){
        // 商城内商品的数据结构：
        // "id"			        : 1,
        // "type"			    : "A",
        // "itemId"		        : 0,
        // "pic"			    : "ui/shop/tilitubiao01",
        // "desc"			    : "10点体力",
        // "num"			    : 10,
        // "price"			    : 6,
        // "isSelling"		    : false,
        // "isCostEffective"    : false,
        // "isShowInShop"	    : true,
        // "itemTag"		    : "com.bigbulluniverse.crazy.diamond1"
        // End

        let item = this.core.fileMap.shopOuter[objData.itemid];
        if(!item){
            return {code:ReturnCode.illegalData};
        }

        //针对不同平台，进行分支处理：
        switch(pUser.domainType) {
            default: {
                try{
                    let result = await this.core.GetMapping(EntityType.BuyLog).Create(`${pUser.domain}`, pUser.openid, JSON.stringify(BonusObject.convert(item.bonus)), item.price, (new Date()).valueOf(), "", 1);
                    let pay_data = {
                        'game_key': "",
                        'game_name': this.core.options["game_name"],
                        'plat_user_id': pUser.openid,
                        'amount': item.price,
                        'product_name': item.desc,
                        'notify_url': `${this.core.options.UrlHead}://${this.core.options.webserver.host}:${this.core.options.webserver.port}/txpay.html`,
                        'order_id': result.orm.trade_no,
                        'timestamp': result.orm.notify_time,
                    };
                    let sign = this.core.options["game_secret"];
                    pay_data['sign'] = sign;

                    let ret = this.CommitTrade(pUser.openid, result.orm.trade_no, item.price);
                    if(ret == ReturnCode.Success){
                        this.core.notifyEvent('user.task', {user:pUser, data:{type:em_Condition_Type.totalPurchase, value:item.price/10}});
                        this.core.notifyEvent('user.afterPurchase', {user:pUser, amount:item.price});
                        let now = Date.parse(new Date())/1000;
                        let tm1 = item.times.split(",");
                        if(now >= parseInt(tm1[0]) && now <= parseInt(tm1[1])){
                            if(!!item.extra){
                                let extra = BonusObject.convert(item.extra);
                                pUser.getBonus(extra);
                            }
                        }

                        return {code:ReturnCode.Success, data: {total:pUser.baseMgr.item.GetRes(ResType.Coin), bonus:item.bonus}};
                    } else {
                        return {code:ReturnCode.illegalData};
                    }
                } catch(e) {
                    console.log(e);
                }
            }
        }
        return {code:ReturnCode.Error};
    }

    /**
     * 游戏大厅购物流程：第三方平台回调时，我方平台确认交易完成
     * @param uuid             用户UUID(不带域名)
     * @param tradeNo			订单流水号
     * @param total_fee		总金额
     * @returns {*}
     */
    CommitTrade(uuid, tradeNo, total_fee) {
        let item = this.core.GetObject(EntityType.BuyLog, tradeNo, IndexType.Domain);
        if (!item || item.orm.uuid != uuid || item.orm.trade_no != tradeNo || item.orm.total_fee != total_fee || item.orm.result == PurchaseStatus.cancel) {
            console.log('[trade not exist]');
            return ReturnCode.illegalData;
        }

        if(item.orm.result == PurchaseStatus.commit){ //已经处理完毕的重复订单, 直接返回
            return ReturnCode.Success;
        }

        let pUser = this.core.GetObject(EntityType.User, `${item.orm.domain}.${uuid}`, IndexType.Domain);
        if(!pUser){
            return ReturnCode.userIllegal;
        }

        //设置首充标记,单笔金额必须大于等于60
        if(total_fee >= 60){
            if(!pUser.baseMgr.info.CheckStatus(UserStatus.isFirstPurchase)){
                pUser.baseMgr.info.SetStatus(UserStatus.isFirstPurchase);
                pUser.baseMgr.info.UnsetStatus(UserStatus.isFirstPurchaseBonus);
            }
        }

        //给 user 道具
        pUser.getBonus(item.orm.product_id);
        item.orm.result = PurchaseStatus.commit;
        item.orm.save();

        //向客户端下行购买成功通知
        pUser.notify({type: NotifyType.buyItem, info:{tradeNo:item.orm.trade_no, product_id: item.orm.product_id}});

        return ReturnCode.Success;
    }
}
exports = module.exports = shop;
