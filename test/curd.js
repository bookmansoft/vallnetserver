/**
 * 单元测试：CURD
 * Creted by liub 2017.3.24
 */

const remote = require('./util')

describe('CURD', function() {
    this.beforeEach(async () => {
        await remote.login({openid: `${Math.random()*1000000000 | 0}`});
    });

    it('创建', async () => {
        let msg = await remote.fetching({func: "test.Create"});
        console.log(msg);
    });

    it('删除', async () => {
        let msg = await remote.fetching({func: "test.Delete", id:1});
        console.log(msg);
    });

    it('查询', async () => {
        let msg = await remote.fetching({func: "test.Retrieve", id: 2});
        console.log(msg);
    });

    it('更新', async () => {
        let msg = await remote.fetching({func: "test.Update", id: 2});
        console.log(msg);
    });

    it('列表', async () => {
        let msg = await remote.fetching({func: "test.List"});
        console.log(msg);
    });
});
