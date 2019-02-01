let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');

/**
 * 管理后台
 */
class manage extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    //活动列表
    async RedPackActList(user, params) {
        let redpackActList = facade.GetMapping(tableType.redpackAct).groupOf().records(tableField.redpackAct)
        return {errcode: 'success', length:redpackActList.length, data:redpackActList}
    }

    //创建活动
    async RedPackActCreate(user, params) {
        let data = params.data
        facade.GetMapping(tableType.redpackAct).Create(data)
        return {errcode: 'success'}
    }

    //更新活动
    async RedPackActUpdate(user, params) {
        let data = params.data
        let act = facade.GetObject(tableType.redpackAct, data.id)  //根据上行id查找表中记录
        if(!!act) {
            for (let key in tableField.redpackAct) {
                let value = tableField.redpackAct[key]
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
        let redpackList = facade.GetMapping(tableType.redpack).groupOf().where([['uid', '==', uid]]).records(tableField.redpack)
        return {errcode: 'success', length:redpackList.length, data:redpackList}
    };

    //用户参与红包活动列表
    async UserRedPackActList(user, params)  {
        let paramsData = params.data
        //res.json({errcode: 'success', length: rows.length, data: rows});
        let data = facade.GetMapping(tableType.userRedPack).groupOf().records(tableField.userRedpack)
        return {errcode: 'success', length:data.length, data:data}
    };


    //用户抽奖红包列表
    async UserRedPackList(user, params)  {
        //res.json({errcode: 'success', length: rows.length, data: rows});
        let paramsData = params.data
        let data = facade.GetMapping(tableType.userRedPackAct).groupOf().records(tableField.userRedpackAct)
        return {errcode: 'success', length:data.length, data:data}
    };

}

exports = module.exports = manage;
