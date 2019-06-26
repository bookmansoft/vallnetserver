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
     * 根据用户 openid 获取特约节点连接器
     * @param {String} domainId
     */
    conn(domainId) {
        if(this.connmap.has(domainId)) { //返回缓存的连接器
            return this.connmap.get(domainId);
        }

        //获取cid和token
        let operator = this.core.GetObject(EntityType.User, domainId, IndexType.Domain);
        if(!!operator) {
            //创建授权式连接器实例
            let remote = new toolkit.conn();

            //设置连接器的值
            remote.setup(
                Object.assign({}, 
                    remoteSetup, 
                    { cid: operator.baseMgr.info.getAttr('cid'), token: operator.baseMgr.info.getAttr('token')}
                )).setFetch(require('node-fetch'));

            this.connmap.set(domainId, remote);
            return remote;
        }

        throw(new Error('illegal openid'));
    }
}

module.exports = RemoteNode;