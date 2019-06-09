#!/usr/bin/env node

/**
 * 控制台应用程序, 调用示例：node cli --name=chick
 * Added by Liub 2017.8.13
 */

//引入远程连接器
let {gameconn} = require('gamerpc');

//创建连接器对象
let remote = new gameconn({
        "UrlHead": "http",              //协议选择: http/https
        "webserver": {
            "host": "127.0.0.1",        //远程主机地址
            "port": 9901                //远程主机端口
        },
    }
)
.setFetch(require('node-fetch'));      //设置node服务端环境下兼容的fetch函数，**注意只能在node服务端环境中执行，浏览器环境中系统自带 fetch 函数**

remote.CommMode = gameconn.CommMode;
remote.ReturnCode = gameconn.ReturnCode;
remote.NotifyType = gameconn.NotifyType;

//控制台输入 例如输入 save Android 1 将在Android上关闭外部连接、强制保存全部用户数据
console.log("请输入远程命令:");
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
        let al = chunk.replace('\r\n', '').split(' ');
        for(let i=1;i<al.length;i++){
            al[i] = encodeURIComponent(al[i]);
        }
        remote.fetching({func:'Console.command', data:al}, msg=>{
            console.log(msg);
        });
    }
});
process.stdin.on('end', () => {
    process.stdout.write('end');
});

//end
