/**
 * 操作员
 */
let moment = require('moment');
const remote = require('./util')

//一组单元测试流程
describe('多人红包发送', function () {

    it('manysend.listRecord 列表', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            let msg = await remote.fetching({ func: "manysend.ListRecord", userinfo: { id: 1 } });
            console.log(msg);
        }
    });


    it('manysend.Retrieve 获取指定id的记录', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            console.log(22);
            let obj = (await remote.fetching({ func: "manysend.Retrieve", userinfo: { id: 1 }, id: 1 }));
            console.log(obj);
        }
    });

    it('manysend创建表记录', async () => {
        console.log(30);
        await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        console.log(32);
        let msg = await remote.fetching({
            func: "manysend.Send", userinfo: { id: 1 },
            total_amount: 1002400,
            actual_amount: 500000,
            total_num: 3,
            id: 10015,
            send_nickname: 'thomas',
            send_headimg: 'http://sdsds',
            wishing: '祝福',
            modify_date: 242424242,
            state_id: 1
        });
        console.log(43);
    });

    


});
