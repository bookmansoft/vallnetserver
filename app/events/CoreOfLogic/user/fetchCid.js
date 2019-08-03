/**
 * Created by liub on 2017-05-26.
 */
let facade = require('gamecloud')
let {EntityType, IndexType} = facade.const
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息

async function handle(data){ //用户数据发生变化
    if(this.options.master.includes(data.user.openid)) {
        data.user.cid = remoteSetup.cid;         //记录为管理员分配的终端编号
        data.user.baseMgr.info.setAttr('token', remoteSetup.token);     //记录为管理员分配的终端令牌，注意不是登录CRM的令牌
    } else {
        let remote = this.service.RemoteNode.conn(remoteSetup.cid); //注意这里使用了管理员专属连接器
        let retAuth = await remote.execute('sys.createAuthToken', [data.user.domainId]);
        let cid = retAuth.result[0].cid;
        let {aeskey, aesiv} = remote.getAes();
        let token = remote.decrypt(aeskey, aesiv, retAuth.result[0].encry);
    
        data.user.cid = cid;
        data.user.baseMgr.info.setAttr('token', token);
    
        //建立终端授权号反向索引
        this.GetMapping(EntityType.User).addId([data.user.cid, data.user.id], IndexType.Terminal);
    }
}

module.exports.handle = handle;
