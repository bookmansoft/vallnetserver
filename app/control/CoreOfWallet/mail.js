let facade = require('gamecloud')
let {TableField, EntityType, NotifyType, ReturnCode} = facade.const
let UserEntity = facade.entities.UserEntity

/**
 * 邮箱管理器
 * Updated by liub on 2017-07-26.
 */
class mail extends facade.Control
{
    /**
     * 读取邮件列表
     * @param {UserEntity} user 
     * @param {*} objData 
     */
    async getList(user, objData) {
        if(!objData.pageSize) {
            objData.pageSize = 10;
        }
        if(!objData.page){
            objData.page = 1;
        }

        let muster = this.core.GetMapping(EntityType.Mail)
            .groupOf(user.openid)
            .orderby('time', 'desc')
            .paginate(objData.pageSize, objData.page);

        let data = {
            total : muster.pageNum,
            page: muster.pageCur,
        }
        data.list = muster.records(TableField.Mail);

        return { code: ReturnCode.Success, data: data };
    }

    /**
     * 向指定用户发送一封文本邮件
     * @param {UserEntity} user 
     * @param {*} objData 
     */
    async send(user, objData) {
        this.core.GetMapping(EntityType.Mail).Create(user, objData.con, user.openid, objData.openid);
        return {code: ReturnCode.Success};
    }

    /**
     * 删除一篇邮件
     * @param {UserEntity} user 
     * @param {*} objData 
     */
    async del(user, objData)
    {
        let mail = this.core.GetObject(EntityType.Mail, objData.idx);
        if(!!mail && (mail.src == user.openid || mail.dst == user.openid)) {
            await this.core.GetMapping(EntityType.Mail).Delete(objData.idx);
            user.CheckMailboxState();
            return {code: ReturnCode.Success, data:{idx:objData.idx}};
        }
        return {code: -1};
    }

    /**
     * 阅读一篇邮件
     * @param {UserEntity} user 
     * @param {*} objData 
     */
    async read(user, objData)
    {
        let mail = this.core.GetObject(EntityType.Mail, objData.idx);
        if(!!mail && (mail.src == user.openid || mail.dst == user.openid)) {
            await mail.read(user);
            user.CheckMailboxState();
        }
        return {code: ReturnCode.Success, data: {idx:objData.idx}};
    }
}

exports = module.exports = mail;
