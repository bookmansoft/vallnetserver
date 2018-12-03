let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');

/**
 * 游戏用户
 * Create by gamegold Fuzhou on 2018-11-27
 */
class cpprop extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    //用户信息
    async PropList(user, params)  {
        let props = facade.GetMapping(tableType.cpProp).groupOf().records(tableField.cpProp);
        return {errcode: 'success', errmsg:'proplist:ok', props: props};
    };
}

exports = module.exports = cpprop;
