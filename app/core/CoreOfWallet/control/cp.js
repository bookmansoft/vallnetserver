let facade = require('gamecloud')
let {EntityType, TableField, IndexType} = facade.const;
let fetch = require("node-fetch");

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
        let query = [];
        if(!!params.category) {
            query.push(['category_id', params.category]);
        }
        let muster = this.core.GetMapping(EntityType.blockgame).groupOf().where(query).paginate(10, params.page || 1);

        let $data = { 
            list: [], 
            total: muster.pageNum,
            page: muster.pageCur,
        };

        for (let $value of muster.records(TableField.blockgame)) {
            $data.list.push($value);
        }

        return {code: 0, data: $data};
    }

    /**
     * 查询我的游戏列表
     * todo 功能待实现，建议在辅助对象中添加玩过的游戏ID列表，然后查询 blockgame 获得详细信息
     * @param {*} user 
     * @param {*} params
     */
    async Mine(user, params) {
        let query = [];
        if(!!params.category) {
            query.push(['category_id', params.category]);
        }
        let muster = this.core.GetMapping(EntityType.blockgame).groupOf().where(query).paginate(10, params.page || 1);

        let $data = { 
            list: [], 
            total: muster.pageNum,
            page: muster.pageCur,
        };

        for (let $value of muster.records(TableField.blockgame)) {
            $data.list.push($value);
        }

        return {code: 0, data: $data};
    }

    /**
     * 根据ID查询CP注册信息
     * @param {*} user 
     * @param {*} params.cid CP编码
     */
    async ById(user, params) {
        let ret = await this.core.service.gamegoldHelper.execute('cp.byId', [params.cid]);
        return {code: 0, data: ret.result};
    }

    /**
     * 根据名称查询CP注册信息 name 
     * @param {*} user 
     * @param {*} params.cname CP名称
     */
    async ByName(user, params) {
        let ret = await this.core.service.gamegoldHelper.execute('cp.ByName', [params.cname]);
        return {code: 0, data: ret.result};
    }

    /**
     * 获取当前用户针对指定游戏的映射地址
     * @param {*} user 
     * @param {*} params 
     */
    async UserToken(user, params) {
        let addr = await this.core.service.gamegoldHelper.getAddrFromUserIdAndCid(user, params.cid);
        return {code: 0, data: addr};
    }

    /**
     * 根据游戏cp地址获取道具列表
     * @param {*} user
     * @param {*} objData
     * @returns
     * @memberof prop
     */
    async getProps(user, objData) {
        let proplist = [];

        let cpObj = this.core.GetObject(EntityType.blockgame, objData.cid, IndexType.Domain);
        if(!!cpObj) { 
            let res = await fetch(`${cpObj.orm.cpurl}`, { mode: 'cors' });
            res = await res.json();
            proplist = res.proplist;
        }
        return {code:0, data: proplist};
    }
}

exports = module.exports = cp;
