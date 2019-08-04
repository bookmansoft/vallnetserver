let facade = require('gamecloud')
let {TableType, TableField, IndexType} = facade.const;
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

        let cpObj = this.core.GetObject(TableType.blockgame, objData.cid, IndexType.Domain);
        if(!!cpObj) { 
            let res = await fetch(`${cpObj.orm.cpurl}`, { mode: 'cors' });
            res = await res.json();
            proplist = res.proplist;
        }
        return {code:0, data: proplist};
    }
}

exports = module.exports = cp;
