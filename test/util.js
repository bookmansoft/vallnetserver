//引入远程连接器
let {conn, gameconn} = require('gamerpc');

//创建连接器对象
let connector = new gameconn({
        "UrlHead": "http",              //协议选择: http/https
        //如果依赖负载均衡，则此处填写LBS地址，并在执行业务前执行LBS指令，否则直接填写业务主机地址
        "webserver": {
            "host": "127.0.0.1",        //远程主机地址
            "port": 9901                //远程主机端口
        },
    }
)
.setFetch(require('node-fetch'));      //设置node服务端环境下兼容的fetch函数，**注意只能在node服务端环境中执行，浏览器环境中系统自带 fetch 函数**

module.exports = {
    conn: conn,
    gameconn: gameconn,
    connector: connector,
};