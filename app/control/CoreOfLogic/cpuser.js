let facade = require('gamecloud');
let {TableType, TableField} = facade.const;
let randomHelp = require('../../util/randomHelp');

/**
 * 游戏用户
 * Create by gamegold Fuzhou on 2018-11-27
 */
class cpuser extends facade.Control
{
    //用户信息
    async CheckOpenId(user, params)  {
        let openid = params.openid;
        let cpUser = this.core.GetMapping(TableType.cpuser).groupOf().where([['openid', '==', openid]]).records(TableField.cpuser);
        var data = null;
        if(cpUser.length >0 ) {
            data = cpUser[0];
        } else {
            let random = new randomHelp();
            let nick = random.randomString(4) + "_" + random.randomNum(4);
            let created_at = new Date().getTime();
            let cpUserItem = {
                openid: openid,
                nick: nick,
                created_at: created_at
            };
            let newCpUser = await this.core.GetMapping(TableType.cpuser).Create(cpUserItem);
            data = TableField.record(newCpUser.orm, TableField.cpuser);
        }
        return {code: 0, data: data};
    };
}

exports = module.exports = cpuser;
