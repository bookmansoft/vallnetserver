/**
 * 单元测试：注册登录、简单应答、推送
 * Creted by liub 2017.3.24
 */

const remote = require('./util')

describe('wechat.GetOpenId', function() {
    this.beforeEach(async () => {
        await remote.login({openid: `${Math.random()*1000000000 | 0}`});
    });

    it.only('game.Info', async () => {
        let msg = await remote.fetching({func: 'profile.Mine', openid: 'oHvae4rF-nfnTQVxuCw6PS9Y8vw0'});
        console.log(msg);
    });
    
});