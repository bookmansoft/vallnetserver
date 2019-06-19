let facade = require('gamecloud');
let {EntityType, IndexType, ReturnCode} = facade.const
const toolkit = require('gamerpc')
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息

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
        let operator = this.core.GetObject(EntityType.User, id);
        if(!!operator) {
            //创建授权式连接器实例
            let remote = new toolkit.conn();

            //设置连接器的值
            remote.setup(
                Object.assign({}, 
                    remoteSetup, 
                    { cid: operator.baseMgr.info.getAttr('cid'), token: operator.baseMgr.info.getAttr('token')}
                )).setFetch(require('node-fetch'));

            this.connmap.set(id, remote);
            return remote;
        }

        return null;
    }
}

module.exports = RemoteNode;