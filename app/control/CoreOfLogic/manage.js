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

    //红包列表
    async RedPackList(user, params)  {
        //res.json({errcode: 'success', length: rows.length, data: rows});
        let redpackList = facade.GetMapping(tableType.redpack).groupOf().records(tableField.redpack);
        return {errcode: 'success', length:redpackList.length, data:redpackList};
    };

}

exports = module.exports = manage;
