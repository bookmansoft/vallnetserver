/**
 * 单元测试：CURD
 * Creted by liub 2017.3.24
 */

const remote = require('./util')

describe('TEST', function() {
    this.beforeEach(async () => {
        await remote.login({openid: `${Math.random()*1000000000 | 0}`});
    });

    it.only('wechat.redpack', async () => {
        let msg = await remote.fetching({func: "wechat.SendRecPack", openid: 'oHvae4rF-nfnTQVxuCw6PS9Y8vw0', uid:17});
        console.log(msg);
    });

});
