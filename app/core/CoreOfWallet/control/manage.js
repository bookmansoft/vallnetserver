let facade = require('gamecloud');
let {EntityType, TableField} = facade.const;

/**
 * 管理后台
 */
class manage extends facade.Control
{
    //活动列表
    async RedPackActList(user, params) {
        let redpackActList = this.core.GetMapping(EntityType.redpackact).groupOf().records(TableField.redpackact)
        return {code: 0, data: {length:redpackActList.length, data:redpackActList}};
    }

    //创建活动
    async RedPackActCreate(user, params) {
        let data = params.data
        this.core.GetMapping(EntityType.redpackact).Create(data);
        return {code: 0};
    }

    //更新活动
    async RedPackActUpdate(user, params) {
        let data = params.data
        let act = this.core.GetObject(EntityType.redpackact, data.id)  //根据上行id查找表中记录
        if(!!act) {
            for (let key in TableField.redpackact) {
                let value = TableField.redpackact[key]
                if(data.hasOwnProperty(value)) {
                    act.setAttr(value, data[value])
                }
            }
            return {code: 0};
        }
        return {code: -1};
    }

    //红包订单列表
    async RedPackOrderList(user, params)  {
        let redpackList = this.core.GetMapping(EntityType.redpack).groupOf().where([['uid', '==', uid]]).records(TableField.redpack)
        return {code: 0, data: {length:redpackList.length, data:redpackList}};
    };

    //用户参与红包活动列表
    async UserRedPackActList(user, params)  {
        let paramsData = params.data
        let data = this.core.GetMapping(EntityType.userredpack).groupOf().records(TableField.userredpack);
        return {code: 0, data: {length:data.length, data:data}};
    };


    //用户抽奖红包列表
    async UserRedPackList(user, params)  {
        let paramsData = params.data
        let data = this.core.GetMapping(EntityType.userredpackact).groupOf().records(TableField.userredpackact)
        return {code: 0, data: {length:data.length, data:data}};
    };

}

exports = module.exports = manage;
