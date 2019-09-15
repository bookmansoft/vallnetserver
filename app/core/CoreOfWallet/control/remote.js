let facade = require('gamecloud')
let {IndexType, ReturnCode, EntityType, PurchaseStatus} = facade.const

/**
 * 路由消息控制器
 * Updated by liub on 2017-05-05.
 */
class remote extends facade.RemoteLogicCtrl
{
    /**
     * 中间件设定
     */
    get middleware(){
        return ['parseParams', 'authRemote', 'commonHandle'];
    }

    /**
     * 修改游戏部分属性
     * @param {*} svr       来访服务器信息
     * @param {*} params    参数对象
     */
    cpStatus(svr, params) {
        let cp = this.core.GetObject(EntityType.blockgame, params.msg.cp_id, IndexType.Domain);
        if(cp) {
            if(params.msg.cp_st != null) {
                cp.setAttr('store_status', params.msg.cp_st);
            }
            if(params.msg.ranking != null) {
                cp.setAttr('ranking', params.msg.ranking);
            }
        }
        return {code: 0};
    }
}

exports = module.exports = remote;
