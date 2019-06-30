/**
 */
let moment  = require('moment');
const remote = require('./util')

//一组单元测试流程
describe('众筹（cpStock）', function() {
    it('cpstock.listRecord 列表', async () => {
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
            let msg = await remote.fetching({func: "cpstock.ListRecord",userinfo:{id:1}});
            console.log(msg);
        }
    });

    
    it('cpstock.Retrieve 获取指定id的记录', async () => { 
            let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
            if(remote.isSuccess(msg)) {
                console.log(await remote.fetching({func: "cpstock.Retrieve",userinfo:{id:1}, id: 1}));
            }
        }
    );

    it('cpstock 创建表记录', async () => {
        await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        let msg = await remote.fetching({func: "cpstock.CreateRecord",userinfo:{id:1},
            cid:'0c7bc530-6b04-11e9-a2c7-2de59be1407f',
            stock_day:'2019-05-07',
            stock_open:80,
            stock_close:100,
            stock_high:110,
            stock_low:70,
            total_num:1100021,
            total_amount:2000000,

        });
    });


});
