/**
 * 单元测试：注册登录、简单应答、推送
 * Creted by liub 2017.3.24
 */

const remote = require('./util')

//一组单元测试流程
describe('地址', function() {
    it('创建新地址', async () => {
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
        //所有的控制器都拥有echo方法
            msg = await remote.fetching({func: "address.List",userinfo:{id:1},items:[]});
            remote.isSuccess(msg, true);
        }
    });

    it('显示最新收款地址', async () => {
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
        //所有的控制器都拥有echo方法
            msg = await remote.fetching({func: "address.Receive",userinfo:{id:1},items:[]});
            remote.isSuccess(msg, true);
        }
    });

    it('查询所有用户定制-即地址过滤', async () => {
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
        //所有的控制器都拥有echo方法
            msg = await remote.fetching({func: "address.Filter",userinfo:{id:5},
                items:[null,null,null,1,10],
            });
            remote.isSuccess(msg, true);
            //console.log(msg);
        }
    });

});
