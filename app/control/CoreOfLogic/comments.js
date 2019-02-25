let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');

/**
 * 游戏接口
 * Create by gamegold Fuzhou on 2018-11-27
 */
class comments extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    //评论列表
    async GameCommentList(user, params)  {
        return {errcode: 'success'};
    };

    //添加评论
    async GameCommentAdd(user, params)  {
        return {errcode: 'success'};
    }

}

exports = module.exports = comments;
