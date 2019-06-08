//引入远程连接器
let {connector} = require('./util');

describe('Restful', function() {
    it('注册并登录 - 自动负载均衡', /*单元测试的标题*/
        async () => { /*单元测试的函数体，书写测试流程*/
            let msg = await connector.login({openid: `${Math.random()*1000000000 | 0}`});
            if(connector.isSuccess(msg)) {
                console.log(await connector.fetching({func: "test.Retrieve", id: 2}));
            }
        }
    );
});
