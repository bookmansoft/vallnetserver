let facade = require('gamecloud');

/**
 * 个人中心
 * Create by gamegold Fuzhou on 2018-11-27
 */
class profile extends facade.Control
{
    /**
     * 提取VIP福利
     * @param {*} user 
     * @param {*} params 
     * 
     * @todo 可以将提取日志写入邮件系统，记录诸如TXID等信息备查
     */
    async VipDraw(user, params)  {
        let draw_count = params.draw_count;
        if( draw_count < 10 * 100000) {
            return {code: -1, msg: 'draw is not enouth'};
        }

        user.baseMgr.info.getData(true); //强制刷新下
        let vip_usable_count = user.baseMgr.info.getAttr('vcur');

        if(draw_count > vip_usable_count) {
            return {code: -2, msg: 'draw beyond'};
        }

        //以管理员账户为指定用户转账，这需要管理员账户上余额充足，未来还需要考虑一定的风控机制
        let ret = await this.core.service.gamegoldHelper.execute('tx.send', [
            user.baseMgr.info.getAttr('acaddr'),
            draw_count,
        ]);   

        if(!ret) {
            return {code: -3, msg: 'txsend fail'};
        } else {
            user.baseMgr.info.subVipCur(draw_count);
            return {code: 0};
        }
    }
}

exports = module.exports = profile;
