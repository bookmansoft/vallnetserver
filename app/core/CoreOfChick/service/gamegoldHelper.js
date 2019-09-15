let gh = require('../../../util/gamegoldHelper')
let facade = require('gamecloud')
let {TableField, EntityType, IndexType, NotifyType} = facade.const

class gamegoldHelper extends gh
{
    constructor(core) {
        super(core);
        this.remote.setup(facade.ini.servers["Chick"][1].node);
    }

    /**
     * 向用户发送系统通知邮件，当前主要包括账户变更、待支付订单通知
     * @param {*} user      收件人对象
     * @param {*} content   邮件内容
     * @param {*} type      邮件类型
     * @param {*} time      发生时间
     * @param {*} bonus     附加奖励
     */
    async sendSysNotify(user, content, type, time, bonus) {
        let data = {
            type: type || NotifyType.mail, 
            info: {
                content: content,
            }
        };
        if(!!bonus) {
            data.info.bonus = bonus;
        }

        if(!content.sn || !this.core.GetObject(EntityType.Mail, content.sn, IndexType.Domain)) { //确保非空sn的唯一性
            await this.core.GetMapping(EntityType.Mail).Create(
                user, 
                data, 
                "system", 
                user.openid,
                time,
                content.sn,
            );
        }
    }

    /**
     * 查询用户对应特定CP的认证报文
     * @param {*} user  用户对象
     * @param {*} cid   CP编码
     */
    async getUserToken(user, cid) {
        let addrObj = this.core.GetObject(EntityType.userwallet, `${cid}.${user.domainId}`, IndexType.Domain);
        if(!addrObj) {
            let ret = await this.execute('token.user', [
                cid,
                user.account,
                null,
                user.account,
            ]);
    
            if (!!ret && ret.code == 0) {
                let pack = Object.assign(ret.result.data, {sig: ret.result.sig});
                this.core.GetMapping(EntityType.userwallet).Create(pack);
                return pack;
            } else {
                return null;
            }
        } else {
            return TableField.record(addrObj, TableField.userwallet);
        }
    }
}

module.exports = gamegoldHelper;
