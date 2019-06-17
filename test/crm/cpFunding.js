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

    it('cpfunding 创建表记录', async () => {
        await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        let msg = await remote.fetching({func: "cpfunding.CreateRecord",userinfo:{id:1},
            cpid:2,
            stock_num:100,
            total_amount:100,
            stock_amount:100,
            stock_rmb:1000,
            audit_state_id:1,
            audit_text:'正常',
            modify_date:2000000,
            cp_name: 'cp_name',
            cp_text: 'cp_text',
            cp_type: 1,
            cp_url: 'cp_url',
            develop_name: 'develop_name',
            develop_text: 'develop_text',
            user_id: 1,

        });
    });


});
