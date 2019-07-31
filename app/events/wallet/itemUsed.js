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
        //根据 event.data.type 进行分支判断，分别处理, 参数包括 event.user event.data{type, id, num}
        //...
    } catch(e) {
        return {code: -1, msg: e.message};
    }

    return {code: 0};
}

module.exports.handle = handle;
