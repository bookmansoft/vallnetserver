let facade = require('gamecloud');
let {TableType} = facade.const;
let tableField = require('../../util/tablefield');

/**
 * 管理后台
 */
class manage extends facade.Control
{
    //活动列表
    async RedPackActList(user, params) {
        let redpackActList = this.core.GetMapping(TableType.RedPackAct).groupOf().records(tableField.RedPackAct)
        return {errcode: 'success', length:redpackActList.length, data:redpackActList}
    }

    //创建活动
    async RedPackActCreate(user, params) {
        let data = params.data
        this.core.GetMapping(TableType.RedPackAct).Create(data)
        return {errcode: 'success'}
    }

    //更新活动
    async RedPackActUpdate(user, params) {
        let data = params.data
        let act = this.core.GetObject(TableType.RedPackAct, data.id)  //根据上行id查找表中记录
        if(!!act) {
            for (let key in tableField.RedPackAct) {
                let value = tableField.RedPackAct[key]
                if(data.hasOwnProperty(value)) {
                    act.setAttr(value, data[value])
                }
            }
            act.orm.save()
            return {errcode: 'success'}
        }
        return {errcode: -1}
    }

    //红包订单列表
    async RedPackOrderList(user, params)  {
        //res.json({errcode: 'success', length: rows.length, data: rows});
        let redpackList = this.core.GetMapping(TableType.RedPack).groupOf().where([['uid', '==', uid]]).records(tableField.RedPack)
        return {errcode: 'success', length:redpackList.length, data:redpackList}
    };

    //用户参与红包活动列表
    async UserRedPackActList(user, params)  {
        let paramsData = params.data
        //res.json({errcode: 'success', length: rows.length, data: rows});
        let data = this.core.GetMapping(TableType.UserRedPack).groupOf().records(tableField.UserRedPack)
        return {errcode: 'success', length:data.length, data:data}
    };


    //用户抽奖红包列表
    async UserRedPackList(user, params)  {
        //res.json({errcode: 'success', length: rows.length, data: rows});
        let paramsData = params.data
        let data = this.core.GetMapping(TableType.UserRedPackAct).groupOf().records(tableField.UserRedPackAct)
        return {errcode: 'success', length:data.length, data:data}
    };

}

exports = module.exports = manage;
