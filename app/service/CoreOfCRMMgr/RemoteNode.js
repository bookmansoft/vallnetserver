//引入查看权限必备的包
let facade = require('gamecloud');
//引入工具包
const toolkit = require('gamerpc')
const tableType = require('../../util/tabletype')

class RemoteNode extends facade.Service
{
     /**
     * 构造函数
     * @param {CoreOfBase} core
     */
    constructor(core) {
        super(core);

        this.connmap = new Map();
    }

    /**
     * 
     * @param {String} id
     */
    conn(id) {
        if(this.connmap.has(id)) { //返回缓存的连接器
            return this.connmap.get(id);
        }

        //获取cid和token
        let operator = this.core.GetObject(tableType.operator, id);
        if(!!operator) {
            console.log("登录信息: "+operator.getAttr('cid')+" "+operator.getAttr('token'));

            //创建授权式连接器实例
            let remote = new toolkit.conn();
            //设置连接器的值
            remote.setup({
                type:   'testnet',
                ip:     '114.116.148.48',     //连接远程服务器（本地调试适用）
                head:   'http',               //远程服务器通讯协议，分为 http 和 https
                id:     'primary',            //默认访问的钱包编号
                apiKey: 'bookmansoft',        //远程服务器基本校验密码
                cid:    operator.getAttr('cid'),
                token:  operator.getAttr('token'),
                structured: true,           //结构化参数
            }).setFetch(require('node-fetch'));

            this.connmap.set(id, remote);
            return remote;
        }

        return null;
    }
}

module.exports = RemoteNode;