/**
 * 单元测试：CURD
 * Creted by liub 2017.3.24
 */

const remote = require('./util')

describe('TEST', function() {
    this.beforeEach(async () => {
        await remote.login({openid: `${Math.random()*1000000000 | 0}`});
    });

    it.only('wechat.GetRedPackInfo', async () => {
        let msg = await remote.fetching({func: "wechat.GetRecPackInfo", mch_billno: '152078250120191303727247540', uid:17});
        console.log(msg);
    });

});
