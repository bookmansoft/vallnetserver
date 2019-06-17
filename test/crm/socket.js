//引入远程连接器
let {gameconn} = require('gamerpc');

//创建连接器对象
let remote = new gameconn(
    gameconn.CommMode.ws,             //使用短连接 get / post
    {
        "UrlHead": "http",              //协议选择: http/https
        "webserver": {
            "host": "127.0.0.1",        //远程主机地址
            "port": 9901                //远程主机端口
        },
        "auth": {
            "openid": "18681223392",    //用户标识
            "openkey": "18681223392",   //和用户标识关联的用户令牌
            "domain": "tx.IOS",         //用户所在的域，tx是提供登录验证服务的厂商类别，IOS是该厂商下的服务器组别
        }
    }
)
.setFetch(require('node-fetch'));      //设置node服务端环境下兼容的fetch函数，**注意只能在node服务端环境中执行，浏览器环境中系统自带 fetch 函数**

remote.NotifyType = gameconn.NotifyType;

describe('socket', function() {
    it('测试Socket中继时请求应答匹配问题', async () => {
            let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
            if(remote.isSuccess(msg)) {
                for(let i = 0; i < 10; i++) {
                    remote.fetching({func: "test.testRelay1"}).then(msg=>{
                        console.log("test.testRelay1", msg);
                    }).catch(e=>{
                        console.log(e);
                    });
                    remote.fetching({func: "test.testRelay2"}).then(msg=>{
                        console.log("test.testRelay2", msg);
                    }).catch(e=>{
                        console.log(e);
                    });
                }

                await (async function(time){ return new Promise(resolve =>{ setTimeout(resolve, time);});})(150000);
            }
        }
    );
});
