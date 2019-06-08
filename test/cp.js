/**
 * 单元测试：注册登录、简单应答、推送
 * Creted by liub 2017.3.24
 */

const {connector} = require('./util')

//一组单元测试流程
describe('游戏（cp）', function() {
    it('cp.list', async () => {
        let msg = await connector.login({openid: `${Math.random()*1000000000 | 0}`});
        if(connector.isSuccess(msg)) {
            //所有的控制器都拥有echo方法
            msg = await connector.fetching({func: "cp.List",items:[]});
            connector.isSuccess(msg, true);
        }
    });

    it('cp.create', async () => {
        let msg = await connector.login({openid: `${Math.random()*1000000000 | 0}`});
        if(connector.isSuccess(msg)) {
            //所有的控制器都拥有echo方法
            msg = await connector.fetching({func: "cp.Create",items:["testfellowX","http://920.cc"]});
            connector.isSuccess(msg, true);
        }
    });
});
