/**
 * Created by liub on 2019-07-18.
 */
let facade = require('gamecloud')
let {NotifyType} = facade.const

/**
 * 用户登录后，用来执行一些后续操作，例如获取腾讯会员信息、蓝钻特权等
 * @note 事件处理函数，this由外部注入，指向Facade
 * @param data
 */
async function handle(data){
    //查询操作员账户余额
    let rt = await this.service.gamegoldHelper.execute('balance.all', [data.user.domainId]);
    if(!!rt && rt.code == 0) {
        data.user.baseMgr.info.setAttr('confirmed', rt.result.confirmed);
        data.user.baseMgr.info.setAttr('unconfirmed', rt.result.unconfirmed);
    } else {
        data.user.baseMgr.info.setAttr('confirmed', 0);
        data.user.baseMgr.info.setAttr('unconfirmed', 0);
    }
}

module.exports.handle = handle;