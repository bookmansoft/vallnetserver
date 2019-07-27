let facade = require('gamecloud')
let {ReturnCode} = facade.const
let UserEntity = facade.entities.UserEntity

/**
 * 道具功能相关的控制器
 * Created by liub on 2017-04-08.
 */
class item extends facade.Control 
{
    /**
     * 使用一定数量的道具
     * @param {UserEntity} pUser 
     * @param {*} info 
     */
    async useItem(pUser, info){
        if(typeof info.num == 'string') {
            info.num = parseInt(info.num);
        }

        if(pUser.getPocket().GetRes(info.id) >= info.num) {
            //触发特殊道具消耗事件
            let rt = await this.core.notifyEvent('wallet.itemUsed', {user:pUser, data:{type:info.id, value:info.num}});
            if(!!rt && rt.code == 0) {
                //执行成功，扣减道具数量
                pUser.getPocket().AddRes(-info.num, true, info.id);
                return {code: ReturnCode.Success, data: pUser.getPocket().getList()};
            }
        } else {
            return {code: ReturnCode.itemNotExist};
        }
        return {code: ReturnCode.Error};
    }

    /**
     * 列表所有道具
     * @param {UserEntity} pUser 
     */
    async list(pUser) {
        let obj = pUser.getPocket().getList();
        let data = {};
        data.page = 1;
        data.total = Object.keys(data).length;
        data.list = Object.keys(obj).map(key => {
            return {id: key, num: obj[key].num};
        });

        return {code: ReturnCode.Success, data:data};
    }
}

exports = module.exports = item;
