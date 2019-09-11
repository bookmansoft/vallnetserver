let facade = require('gamecloud')
let {IndexType, ReturnCode, EntityType, PurchaseStatus} = facade.const

/**
 * 路由消息控制器
 * Updated by liub on 2017-05-05.
 */
class remote extends facade.Control
{
    /**
     * 中间件设定
     */
    get middleware(){
        return ['parseParams', 'commonHandle'];
    }

    cpStatus(svr, params) {
        let cp = this.core.GetObject(EntityType.blockgame, params.msg.cp_id, IndexType.Domain);
        if(cp) {
            cp.setAttr('store_status', params.msg.cp_st);
        }
        return {code: 0};
    }
}

exports = module.exports = remote;
