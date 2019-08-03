let facade = require('gamecloud');
let {EntityType, IndexType} = facade.const;
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息

/**
 * Created by liub on 2019.06.05
 */
function handle(payload) { 
    //用户账户发生变动，对应主网事件 balance.account.client
    let account = payload.data.accountName;
    let ui = this.GetObject(EntityType.User, account, IndexType.Domain);
    if(!!ui) {
        ui.baseMgr.info.setAttr('confirmed', payload.data.confirmed);
        ui.baseMgr.info.setAttr('unconfirmed', payload.data.unconfirmed);
        ui.notify({type: 911001, info: {confirmed: payload.data.confirmed, unconfirmed: payload.data.unconfirmed}});
    }
}

module.exports.handle = handle;