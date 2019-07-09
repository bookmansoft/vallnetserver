let facade = require('gamecloud');
let {TableType} = facade.const;
let tableField = require('../../util/tablefield');
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
        let cpUser = this.core.GetMapping(TableType.CpUser).groupOf().where([['openid', '==', openid]]).records(tableField.CpUser);
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
            let newCpUser = await this.core.GetMapping(TableType.CpUser).Create(cpUserItem);
            data = newCpUser.orm;
        }
        return {errcode: 'success', errmsg:'checkopenid:ok', data: data};
    };

    //用户登录授权
    async UserTokenNotify(user, params) {
        //let cid = params.cid;
        let uid = user.id;
        let token = params.token;
        let cpusers = this.core.GetMapping(TableType.CpUser).groupOf().where([['id','==',uid]]).records();
        if(cpusers.length >0 ) {
            let cpuser = cpusers[0];
            cpuser.setAttr('addr', token.data.addr);     //修改所得记录的item字段，下次查询时将得到新值，同时会自动存入数据库
            cpuser.orm.save();
            return {errcode: 'success', errmsg:'usertokennotify:ok', token: token};
        }
        return {errcode: 'faile', errmsg:'usertokennotify:err', token: token};
    }
}

exports = module.exports = cpuser;
