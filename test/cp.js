/**
 * 单元测试：注册登录、简单应答、推送
 * Creted by liub 2017.3.24
 */

const remote = require('./util')

//一组单元测试流程
describe('游戏（cp）', function() {
    it('cp.list', async () => {
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
            //所有的控制器都拥有echo方法
            msg = await remote.fetching({func: "cp.List",items:[]});
            remote.isSuccess(msg, true);
        }
    });

    it('cp.create', async () => {
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
            //所有的控制器都拥有echo方法
            msg = await remote.fetching({func: "cp.Create",items:["testfellowX","http://920.cc"]});
            remote.isSuccess(msg, true);
        }
    });
});
