let facade = require('gamecloud');
let {TableType, TableField} = facade.const;

/**
 * 游戏用户
 * Create by gamegold Fuzhou on 2018-11-27
 */
class cpprop extends facade.Control
{
    async PropList(user, params)  {
        let props = this.core.GetMapping(TableType.cpprop).groupOf().records(TableField.cpprop);
        return {code: 0, data: {props: props}};
    };

    //道具确权
    async QueryProps(user, params) {
        let cid = params.cid;
        let user_addr = params.user_addr;
        let ret = await this.core.service.gamegoldHelper.execute('queryProps', [
            cid, //游戏编号
            user_addr //游戏内玩家的有效地址
        ]);
        var queryprops = [];
        await ret.result.forEach(element => {
            let prop = this.core.GetMapping(TableType.cpprop).groupOf().where([
                ['oid', '==', element.oid]
            ]).records(TableField.cpprop)[0];
            if(!!prop) {
                queryprops.push(prop);
            }
        });
        return {code: 0, data: {queryprops: queryprops}};
    }

    //道具详情查询
    async GetPropByOid(user, params) { 
        let oid = params.oid;
        let prop = this.core.GetMapping(TableType.cpprop).groupOf().where([
            ['oid', '==', oid]
        ]).records(TableField.cpprop)[0];
        return {code: 0, data: {prop: !!prop ? prop : null}};
    }

    //批量查询道具
    async GetPropByOids(user, params) { 
        let oids = params.oids;
        let props = this.core.GetMapping(TableType.cpprop).groupOf().where([
            ['oid', 'include', oids]
        ]).records(TableField.cpprop);

        return {code: 0, data: {props: !!props ? props : null}};
    }

}

exports = module.exports = cpprop;
