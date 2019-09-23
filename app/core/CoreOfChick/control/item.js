let facade = require('gamecloud')
let {ReturnCode} = facade.const

/**
 * 道具功能相关的控制器
 * Created by liub on 2017-04-08.
 */
class item extends facade.Control 
{
    /**
     * 使用指定道具
     * @param {UserEntity} pUser 
     * @param {*} info 
     */
    useItem(pUser, info){
        if(typeof info.num == 'string') {
            info.num = parseInt(info.num);
        }

        if(pUser.getPocket().GetRes(info.id) >= info.num) {
            pUser.getPocket().AddRes(-info.num, true, info.id);
            //触发了特殊道具被使用事件
            this.core.notifyEvent('user.itemUsed', {user:pUser, data:{type:info.id, value:info.num}});
            return {code: ReturnCode.Success, data: pUser.getPocket().getList()};
        }
        else{
            return {code: ReturnCode.itemNotExist};
        }
    }

    /**
     * 获取道具列表
     * @param {UserEntity} pUser 
     */
    list(pUser) {
        return {code: facade.const.ReturnCode.Success, data:pUser.getPocket().getList()};
    }
}

exports = module.exports = item;
