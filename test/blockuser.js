/**
 * 单元测试：注册登录、简单应答、推送
 * Creted by liub 2017.3.24
 */

const {connector} = require('./util')

describe('wechat.GetOpenId', function() {
    beforeEach(async () => {
        await connector.login({openid: `${Math.random()*1000000000 | 0}`});
    });

    it('prop.UserGame', async () => {
        let msg = await connector.fetching({func: 'profile.UserGame'});
        console.log(msg);
    });
    
});