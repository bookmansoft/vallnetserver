/**
 * 单元测试：注册登录、简单应答、推送
 * Creted by liub 2017.3.24
 */
let moment  = require('moment');
const remote = require('./util')

//一组单元测试流程
describe('游戏（cp）', function() {
    it('cp.list', async () => {
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
        //所有的控制器都拥有echo方法
            msg = await remote.fetching({func: "cp.List",userinfo:{id:1},items:[]});
            remote.isSuccess(msg, true);
        }
    });
    
    it('cp.listRecord 列表', async () => {
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
            let msg = await remote.fetching({func: "cp.ListRecord",userinfo:{id:1}});
        }
    });

    it('cp.ListCpType 列表', async () => {
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
            let msg = await remote.fetching({func: "cp.ListCpType",userinfo:{id:1}});
            console.log(msg);
        }
    });

    it('cp.create', async () => {
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
            //所有的控制器都拥有echo方法
            console.log(encodeURIComponent("守望先锋"));
            msg = await remote.fetching({func: "cp.Create",userinfo:{id:5},items:["newcp31","http://localhost:9101/client/cp1.json","tb1qy8zre9qdrt83rfysmwhyes8qmp2zfu6v9pe49q","RPG"]});
            remote.isSuccess(msg, true);
        }
    });
    
    it('cp.Retrieve 获取指定id的记录', async () => { 
            let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
            if(remote.isSuccess(msg)) {
                console.log(await remote.fetching({func: "cp.Retrieve",userinfo:{id:1}, id: 2}));
            }
        }
    );

    it('cp创建表记录', async () => {
        await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        let msg = await remote.fetching({func: "cp.CreateRecord",
            cp_id: '06b29ea0-ecc2-11e8-914e-9765abd9da46',
            cp_name: 'ABCDEF',
            cp_text: '游戏中文名啦',
            cp_url: 'theurl',
            wallet_addr: 'addr',
            cp_type:'type2',
            develop_name:'dev',
            cp_desc:'desc',
            cp_version:'version',
            picture_url:'theUrl',
            cp_state:1,
            publish_time:2,
            audit_time:3,
            online_time:4,
            offline_time:5,
        });
    });

    it('获取外部数据记录', async () => { 
        let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
        if(remote.isSuccess(msg)) {
            let ret=(await remote.fetching({func: "cp.getGameFromUrl",userinfo:{id:1}, cp_url: 'http://localhost:9101/client/cp1.json'}));
            console.log(ret.data);
        }
      }
    );
});
