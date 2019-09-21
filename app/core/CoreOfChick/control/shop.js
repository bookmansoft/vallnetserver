let facade = require('gamecloud')
let {SettleType, EntityType, ResType, ReturnCode} = facade.const
let BonusObject = facade.Util.BonusObject
let uuid = require('uuid');

class shop extends facade.Control
{
    /**
     * 处理外购订单
     * @param user
     * @param params
     * @returns {{code: number, data: {tradeNo: string}}}
     */
    async BuyItem(user, params) {
        let acaddr = user.baseMgr.info.getAttr('acaddr');
        if(!acaddr) {
            //尚未完成钱包认证流程
            return { code: -1 };
        }

        let item = this.core.fileMap.shopOuter[params.itemid];
        if(!item) {
            return {code:ReturnCode.illegalData};
        }

        params.fee_type = params.fee_type || SettleType.Gamegold; //由客户端决定支付类型
        params.sn = uuid.v1();

        //以 sys.notify 模式发起订单
        let data = {
            cid: this.core.service.gamegoldHelper.cid,  //CP编码
            oid: '',                                    //道具原始编码
            price: item.price,                          //价格，单位尘
            url: '',                                    //道具图标URL
            props_name: '',                             //道具名称
            sn: params.sn,                              //订单编号
            addr: acaddr,                               //用户地址
            confirmed: -1,                              //确认数，-1表示尚未被主网确认，而当确认数标定为0时，表示已被主网确认，只是没有上链而已
            time: Date.now()/1000,
        };
        
        //向主网发送消息
        let ret = await this.core.service.gamegoldHelper.execute('sys.notify', [
            data.addr,
            JSON.stringify(data),
        ]);
        if(!!ret && ret.code == 0) {
            //生成并保存订单
            this.core.GetMapping(EntityType.BuyLog).Create(
                `${user.domainId}`,                                //domainid      用户标识
                data.sn,                                           //trade_no      订单号，是否可以考虑使用某种标准化格式，如'201901018888'
                JSON.stringify(BonusObject.convert(item.bonus)),   //product       订单内容
                params.itemid,                                     //product_desc  订单文字描述
                item.price,                                        //total_fee     订单总价
                params.fee_type,                                   //fee_type      支付类型(支付宝、微信、游戏金等)，注意不是货币类型，当前设定中，每种支付类型下只使用其默认货币类型，如支付宝/人民币
            );

            return { code: ReturnCode.Success, data: {bonus:item.bonus}};
        }
        return { code: -1 };
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
