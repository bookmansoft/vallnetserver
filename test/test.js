/**
 * 单元测试：CURD
 * Creted by liub 2017.3.24
 */

const remote = require('./util')

describe('TEST', function() {
    this.beforeEach(async () => {
        await remote.login({openid: `${Math.random()*1000000000 | 0}`});
    });

    it.only('manage.RedPackList', async () => {
        let msg = await remote.fetching({func: "manage.RedPackList", openid: 'oqR1e1ads_cDhYGvjS9sftXEHlx4', uid:17});
        console.log(msg);
    });

});
