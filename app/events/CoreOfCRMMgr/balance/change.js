let facade = require('gamecloud');
let {EntityType, IndexType} = facade.const;
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息

/**
 * Created by liub on 2019.06.05
 */
function handle(payload) { 
    //用户账户发生变动，对应主网事件 balance.account.client
    let account = payload.data.accountName;
    if(account == 'default') { //对超级管理员账号进行转换
        account = remoteSetup.cid;
    }
    let ui = this.GetObject(EntityType.User, account, IndexType.Terminal);
    if(!!ui) {
        ui.baseMgr.info.setAttr('balance', payload.data.confirmed);
    }
}

module.exports.handle = handle;