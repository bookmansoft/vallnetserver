/**
 */
let moment  = require('moment');
const remote = require('./util')

//一组单元测试流程
describe('众筹（cpFunding）', function() {
    it('cpfunding.listRecord 列表', async () => {
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
            let msg = await remote.fetching({func: "cpfunding.ListRecord",userinfo:{id:1}});
            console.log(msg);
        }
    });

    
    it('cpfunding.Retrieve 获取指定id的记录', async () => { 
            let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
            if(remote.isSuccess(msg)) {
                console.log(await remote.fetching({func: "cpfunding.Retrieve",userinfo:{id:1}, id: 1}));
            }
        }
    );
});
