let facade = require('gamecloud')
let {TableType, TableField, IndexType} = facade.const;

/**
 * 游戏的控制器
 * Updated on 2018-11-19.
 */
class cp extends facade.Control
{
    /**
     * 查询CP列表
     * @param {*} user 
     * @param {*} params
     */
    async List(user, params) {
        let muster = this.core.GetMapping(TableType.blockgame).groupOf().paginate(10, params.page || 1);

        let $data = { 
            list: [], 
            page: muster.pageNum,
            cur: muster.pageCur,
        };

        for (let $value of muster.records(TableField.blockgame)) {
            $data.list.push($value);
        }

        return {code: 0, data: $data};
    }

    /**
     * 根据ID查询CP注册信息 cid CP编码
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async ById(user, params) {
        let cid = params.cid
        let ret = await this.core.service.gamegoldHelper.execute('cp.byId', [cid]);
        return {code: 0, data: ret.result};
    }

    /**
     * 根据名称查询CP注册信息 name CP名称
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async ByName(user, params) {
        let ret = await this.core.service.gamegoldHelper.execute('cp.ByName', params.items);
        return {code: 0, data: ret.result};
    }

    //申请令牌
    async UserToken(user, params) {
        let addr = await this.core.service.gamegoldHelper.getAddrFromUserIdAndCid(user, params.cid);
        return {code: 0, data: addr};
    }
}

exports = module.exports = cp;
