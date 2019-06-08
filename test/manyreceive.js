/**
 * 操作员
 */
const {connector} = require('./util')

//一组单元测试流程
describe('多人红包发送', function () {
    it('manyreceive.listRecord 列表', async () => {
        let msg = await connector.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (connector.isSuccess(msg)) {
            let msg = await connector.fetching({ func: "manyreceive.ListRecord", userinfo: { id: 1 } });
            console.log(msg);
        }
    });


    it('manyreceive.Retrieve 获取指定id的记录', async () => {
        let msg = await connector.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (connector.isSuccess(msg)) {
            console.log(22);
            let obj = (await connector.fetching({ func: "manyreceive.Retrieve", userinfo: { id: 1 }, id: 1 }));
            console.log(obj);
        }
    });

    it('manyreceive创建表记录', async () => {
        console.log(30);
        await connector.login({ openid: `${Math.random() * 1000000000 | 0}` });
        console.log(32);
        let msg = await connector.fetching({
            func: "manyreceive.CreateRecord", userinfo: { id: 1 },
            send_id: 1,
            receive_amount: 500000,
            send_uid: parseInt(Math.random() * 5) +10015,
            send_nickname: 'david',
            send_headimg: 'http://aa',
            receive_uid: parseInt(Math.random() * 5)  +10015,
            receive_nickname: 'thomas',
            receive_headimg: 'http://sdsds',
            modify_date: 242424242,
        });
        console.log(43);
    });
});
