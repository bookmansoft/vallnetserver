/**
 * 单元测试：CURD
 * Creted by liub 2017.3.24
 */

const remote = require('./util')

describe('TEST', function() {
    this.beforeEach(async () => {
        await remote.login({openid: 1000});
    });

    it('test.TestA', async () => {
        let msg = await remote.fetching({func: "test.TestA", mch_billno: '152078250120191251387982305', uid:17});
        console.log(msg);
    });

});
