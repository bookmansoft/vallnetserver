const assert = require('assert')

let {gameconn} = require('gamerpc');
let remote = new gameconn({
    "UrlHead": "http",              //协议选择: http/https
    "webserver": { 
        //注意：如果需要负载均衡，这里一般指定负载均衡服务器地址，否则直接填写业务主机地址
        "host": "127.0.0.1",        //远程主机地址
        "port": 9801                //远程主机端口
    },
}).setFetch(require('node-fetch')); //设置node环境下兼容的fetch函数

describe('验证信息发送测试', () => {
    it.only('发送短信', async () => {
        let msg = await remote.fetching({func: "sms.sendsms", addr:'+86139********', template:'test', tp: '["369751"]'});
        assert(msg.code == 0);
    });

    it('发送邮件', async () => {
        let msg = await remote.fetching({func: "sms.sendmail", addr: '********@qq.com', subject:'hello', content:'hello', html:'<b>hello</b>'});
        assert(msg.code == 0);
    });
});
