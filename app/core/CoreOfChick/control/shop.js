let facade = require('gamecloud')
let {EntityType, ResType, ReturnCode, em_Condition_Type} = facade.const
let BonusObject = facade.Util.BonusObject
let uuid = require('uuid');

class shop extends facade.Control
{
    /**
     * 处理外购订单
     * @param pUser
     * @param objData
     * @returns {{code: number, data: {tradeNo: string}}}
     */
    async BuyItem(pUser, objData){
        let item = this.core.fileMap.shopOuter[objData.itemid];
        if(!item){
            return {code:ReturnCode.illegalData};
        }

        //针对不同平台，进行分支处理：
        switch(pUser.domainType) {
            default: {
                try {
                    let result = await this.core.GetMapping(EntityType.BuyLog).Create(
                        `${pUser.domainId}`,                                //domainid      用户标识
                        uuid.v4(),                                          //trade_no      订单号，是否可以考虑使用某种标准化格式，如'201901018888'
                        JSON.stringify(BonusObject.convert(item.bonus)),    //product       订单内容
                        '',                                                 //product_desc  订单文字描述
                        item.price,                                         //total_fee     订单总价
                        1,                                                  //fee_type      支付类型(支付宝、微信、游戏金等)，注意不是货币类型，当前设定中，每种支付类型下只使用其默认货币类型，如支付宝/人民币
                    );

                    //test only 这里采用了测试流程：不等待第三方支付回调，而是直接确认了订单
                    let ret = await this.core.notifyEvent('user.orderPay', {data:{trade_no: result.getAttr('trade_no'), price: item.price}});
                    if(ret.code == ReturnCode.Success){
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

                        return {code:ReturnCode.Success, data: {bonus:item.bonus}};
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
     * 处理内购订单
     * @param {UserEntity} user
     * @param objData
     * @returns {Promise.<*>}
     */
    async BuyShopItem(user, objData){
        objData.num = Math.max(0, Math.min(200, !!objData.num ? objData.num : 1));

        let bi = this.core.fileMap.shopdata[objData.id];
        if(!!bi){
            let tm = bi.price * objData.num;
            //判断折扣
            let tm1 = bi.times.split(",");
            let now = Date.parse(new Date())/1000;
            if(now >= parseInt(tm1[0]) && now <= parseInt(tm1[1])){
                tm = Math.ceil(tm * bi.discount);
            }
            //判断是否有足够的购买金
            if(user.baseMgr.item.GetRes(bi.costtype) >= tm) {
                let cbs = BonusObject.convert(bi.bonus);
                for(let cb of cbs) {
                    if(bi.stack == 1 || !user.getPocket().GetRes(cb.type, cb.id)) {
                        //进行可用性分析
                        let canExec = (!user.baseMgr.item.relation(cb, ResType.Action) || !user.baseMgr.item.isMaxRes(ResType.Action));
                        if(canExec) {
                            user.getBonus({type:bi.costtype, num:-tm});
                            cb.num = cb.num * objData.num;
                            user.getBonus(cb);
                        }
                    } else {
                        return {code:ReturnCode.itemHasOne};
                    }
                }

                return {code:ReturnCode.Success, data:user.baseMgr.item.getList()};
            } else {
                let rt = null;
                switch(bi.costtype){
                    case ResType.Diamond:
                        rt = ReturnCode.DiamondNotEnough;
                        break;
        
                    case ResType.Action:
                        rt = ReturnCode.ActionNotEnough;
                        break;
                        
                    case ResType.Coin:
                        rt = ReturnCode.MoneyNotEnough;
                        break;
        
                    default:
                        rt = ReturnCode.Error;
                }
        
                return {code: rt};
            }
        } else {
            return {code:ReturnCode.itemNotExist};
        }
    }
}

exports = module.exports = shop;
