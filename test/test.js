/**
 * 单元测试：CURD
 * Creted by liub 2017.3.24
 */

const {connector} = require('./util')

describe('TEST', function() {
    this.beforeEach(async () => {
        await connector.login({openid: 1000});
    });

    it('test.TestA', async () => {
        let msg = await connector.fetching({func: "test.TestA", mch_billno: '152078250120191251387982305', uid:17});
        console.log(msg);
    });

});
