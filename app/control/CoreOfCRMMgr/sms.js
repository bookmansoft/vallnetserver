let facade = require('gamecloud')
let {ReturnCode, NotifyType} = facade.const

/**
 * 部分测试流程
 * Updated by liub on 2017-05-05.
 */
class sms extends facade.Control
{
    get middleware(){
        return ['parseParams', 'commonHandle'];
    }

    async sendmail(user, objData) {
        try {
            let ret = await this.core.service.mail.send(objData);
            console.log(ret);
        } catch(e) {
            console.error(e);
        }
        return {code: ReturnCode.Success};
    }

    async sendsms(user, objData) {
        try {
            let ret = await this.core.service.sms.send(objData);
            console.log(ret);
        } catch(e) {
            console.error(e);
        }
        return {code: ReturnCode.Success};
    }
}

exports = module.exports = sms;
