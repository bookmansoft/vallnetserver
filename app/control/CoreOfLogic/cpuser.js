let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');
let randomHelp = require('../../util/randomHelp');

/**
 * 游戏用户
 * Create by gamegold Fuzhou on 2018-11-27
 */
class cpuser extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    //用户信息
    async CheckOpenId(user, params)  {
        let openid = params.openid;
        let cpUser = facade.GetMapping(tableType.cpUser).groupOf().where([['openid', '==', openid]]).records(tableField.cpUser);
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
            let newCpUser = await facade.GetMapping(tableType.cpUser).Create(cpUserItem);
            data = newCpUser.orm;
        }
        return {errcode: 'success', errmsg:'checkopenid:ok', data: data};
    };

}

exports = module.exports = cpuser;
