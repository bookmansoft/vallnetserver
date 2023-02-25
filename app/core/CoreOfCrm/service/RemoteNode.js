let facade = require('gamecloud');
let {EntityType, IndexType, ReturnCode} = facade.const
const toolkit = require('gamerpc')
let remoteSetup = facade.ini.servers["CoreOfIndex"][1].node; //全节点配置信息

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
     * 根据终端编号 cid 获取特约节点连接器
     * @param {String} cid
     */
    conn(cid) {
        if(this.connmap.has(cid)) { //返回缓存的连接器
            return this.connmap.get(cid);
        }

        //获取cid和token
        let operator = this.core.GetObject(EntityType.User, cid, IndexType.Terminal);
        if(!!operator) {
            //创建授权式连接器实例
            let remote = new toolkit.conn();

            //设置连接器的值
            remote.setup(
                Object.assign(
                    {}, 
                    remoteSetup, 
                    { cid: cid, token: operator.baseMgr.info.getAttr('token')}
                )).setFetch(require('node-fetch'));

            this.connmap.set(cid, remote);
            return remote;
        }

        throw(new Error('illegal terminal id'));
    }
}

module.exports = RemoteNode;