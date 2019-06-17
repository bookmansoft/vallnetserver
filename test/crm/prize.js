/**
 * 操作员
 */
let moment  = require('moment');
const remote = require('./util')

//一组单元测试流程
describe('奖品（红包发送记录）', function() {
    
    it('prize.listRecord 列表', async () => {
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
            let msg = await remote.fetching({func: "prize.ListRecord",userinfo:{id:1}});
            console.log(msg);
        }
    });

    
    it('prize.Retrieve 获取指定id的记录', async () => { 
            let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
            if(remote.isSuccess(msg)) {
                console.log(22);
                let obj=(await remote.fetching({func: "prize.Retrieve",userinfo:{id:1}, id: 2}));
                console.log(obj);
            }
        }
    );




});
