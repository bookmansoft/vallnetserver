let facade = require('gamecloud')
let {EntityType, IndexType} = facade.const

/**
 * CP成功注册事件
 * 主网下发CP注册通知，该通知为先前操作员发起的CP注册请求的确认应答，此时应该将CP记录插入数据库
 * @param {Object} data.msg { cid, name, url, address, ip, cls, grate, wid, account }
 */
async function handle(data) {
    if(!data.msg || typeof data.msg != 'object') {
        console.log('cp.register: error cp info.');
        return {code: 0};
    }

    if(data.msg.cid == "xxxxxxxx-game-gold-boss-xxxxxxxxxxxx") { //强制跳过特殊CP
        return {code: 0};
    }

    let cpfunding = this.GetObject(EntityType.CpFunding, data.msg.cid, IndexType.Foreign);
    if (!cpfunding) {
        return { code: -1, msg:"记录不存在" };
    }

    if (cpfunding.getAttr('audit_state_id') != 1) {
        return { code: -1, msg:"记录未通过审核" };
    }

    if (data.msg.height <= 0) { //尚未入块
        return {code: 0};
    }

    //一切顺利，修改凭证发行状态为'已发行'
    cpfunding.setAttr('audit_state_id', 2);
    cpfunding.setAttr('modify_date', new Date().getTime() / 1000);
    return { code: 0, msg: "发行成功" };
}

module.exports.handle = handle;
