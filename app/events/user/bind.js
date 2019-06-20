let facade = require('gamecloud')
let {EntityType, IndexType} = facade.const
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息

/**
 * Created by liub on 2019.06.05
 */
function handle(data){ 
    let cid = data.user.baseMgr.info.getAttr('cid');
    if(!cid) {
        if(data.user.openid === 'admin') {
            data.user.baseMgr.info.setAttr('cid', remoteSetup.cid);
            data.user.baseMgr.info.setAttr('token', remoteSetup.token);
        } else {
            this.service.RemoteNode.conn('admin').execute('sys.createAuthToken', [data.user.openid]).then(retAuth => {
                let cid = retAuth.result[0].cid;
                let {aeskey, aesiv} = remote.getAes();
                let token = remote.decrypt(aeskey, aesiv, retAuth.result[0].encry);
            
                data.user.baseMgr.info.setAttr('cid', cid);
                data.user.baseMgr.info.setAttr('token', token);
            }).catch(e => {
                console.log(e);
            });
        }
    }

    if(!!data.params.address && !!data.params.addrType) {
        switch(data.params.addrType) {
            default: {
                data.user.baseMgr.info.setAttr('phone', data.params.address);
                this.GetMapping(EntityType.User).addId([data.params.address, data.user.id], IndexType.Phone);
                break;
            }
        }
    }
}

module.exports.handle = handle;
