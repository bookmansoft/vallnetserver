//引入查看权限必备的包
let facade = require('gamecloud');
//引入工具包
const toolkit = require('gamerpc')
const tableType = require('../../util/tabletype')

function RemoteNode() { 
    // 授权连接器的预备代码，调试完成后转正
    this.conn=function(userinfo) {
        console.log("remoteX：");
        console.log(JSON.stringify(userinfo));
        //创建授权式连接器实例
        const remote = new toolkit.conn();
        //获取cid和token
        let operator = facade.GetObject(tableType.operator, userinfo.id);
        console.log("登录信息: "+operator.getAttr('cid')+" "+operator.getAttr('token'));
        if(!!operator) {
            //设置连接器的值
            remote.setup({
                type:   'testnet',
                // ip:     '127.0.0.1',          //连接本机（服务器适用）
                ip:     '114.116.148.48',          //连接远程服务器（本地调试适用）
                head:   'http',               //远程服务器通讯协议，分为 http 和 https
                id:     'primary',            //默认访问的钱包编号
                apiKey: 'bookmansoft',        //远程服务器基本校验密码
                cid:    operator.getAttr('cid'),
                token:  operator.getAttr('token'),
                structured: true,           //结构化参数
            });
            //兼容性设置，提供模拟浏览器环境中的 fetch 函数
            remote.setFetch(require('node-fetch'));
            return remote;
        }
        return null;
    }
}; 
module.exports = RemoteNode;