/**
 * 操作员
 */
let moment  = require('moment');
const remote = require('./util')

//一组单元测试流程
describe('红包活动', function() {
    
    it('redpacket.listRecord 列表', async () => {
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
            let msg = await remote.fetching({func: "redpacket.ListRecord",userinfo:{id:1}});
            console.log(msg);
        }
    });

    
    it('redpacket.Retrieve 获取指定id的记录', async () => { 
            let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
            if(remote.isSuccess(msg)) {
                console.log(22);
                let obj=(await remote.fetching({func: "redpacket.Retrieve",userinfo:{id:1}, id: 2}));
                console.log(obj);
            }
        }
    );

    it('redpacket创建表记录', async () => {
        await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        let msg = await remote.fetching({func: "redpacket.CreateRecord",userinfo:{id:1},
                act_name:'act_name',
                act_sequence:'act_sequence',
                total_gamegold:5,
                each_gamegold:6,
                total_num:7,
                each_num:8,
                act_desc:'act_desc',
                act_start_at:37,
                act_end_at:48,
        });
    });


});
