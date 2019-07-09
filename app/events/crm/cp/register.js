let facade = require('gamecloud')
let {DomainType, UserStatus, EntityType, IndexType} = facade.const
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息

/**
 * CP成功注册事件
 * 主网下发CP注册通知，该通知为先前操作员发起的CP注册请求的确认应答，此时应该将CP记录插入数据库
 * @param {Object} data.msg { cid, name, url, address, ip, cls, grate, wid, account }
 */
function handle(data) {
    //收到CP注册事件，根据其携带的账号信息查找操作员对象
    let cid = data.msg.account;
    if(cid == 'default') { //对超级管理员账号进行转换
        cid = remoteSetup.cid;
    }

    let user = this.GetObject(EntityType.User, cid, IndexType.Terminal);
    if(user) {
        this.control.cp.CreateRecord(user, data.msg).catch(e => {
            console.error(e);
        });
    }
}

module.exports.handle = handle;
