let facade = require('gamecloud')
let {TableType, GetResType, NotifyType, ResType, ActivityType, em_Condition_Type, em_Condition_Checkmode} = facade.const
let EventData = facade.Util.EventData

/**
 * 使用了特殊道具卡
 * @param {EventData} event 
 * 
 * @description 示例：使用特殊道具后，为用户补充体力
 *      event.user.getBonus({type:ResType.Action, num:event.data.value});
 */
async function handle(event) { 
    try {
        let resType = GetResType(event.data.type);
        if(resType == ResType['stock']) {
            let stockId = event.data.type - resType;
            let stock = this.GetObject(TableType.StockBase, stockId);
            if(!!stock) {
                let ret = await this.service.gamegoldHelper.execute('stock.purchase', [stock.getAttr('cid'), event.data.value, event.user.domainId]);
                return ret;
            }
        } else {
    
        }
    } catch(e) {
        return {code: -1, msg: e.message};
    }

    return {code: 0};
}

module.exports.handle = handle;
