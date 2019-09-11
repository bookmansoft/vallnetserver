let facade = require('gamecloud')
let {EntityType, IndexType} = facade.const
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息
let fetch = require("node-fetch");

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

    //收到CP注册事件，根据其携带的账号信息查找操作员对象
    let account = data.msg.account;
    if(account == 'default') { //对超级管理员账号进行转换
        account = remoteSetup.cid;
    }

    let user = this.GetObject(EntityType.User, account, IndexType.Terminal);
    if(user) { //CRM系统只记录和自己相关的CP信息
        CreateRecord(user, data.msg, this).catch(e => {
            console.error(e);
        });
    }
}

/**
 * 创建新的CP对象(当收到主网通知，或者操作员登录自检时调用，客户端不会直接调用)：
 * 1. 从游戏厂商接口处集采信息
 * 2. 将集采信息和操作员提交的信息进行整合
 * 3. 创建新的数据库记录
 * @param {*} user 
 * @param {Object} cpinfo { cid, name, url, address, ip, cls, grate, wid, account }
 */
async function CreateRecord(user, cpinfo, core) {
    let data = {};
    data.cp_name = cpinfo.name;
    data.cp_url = cpinfo.url;
    data.cp_type = cpinfo.cls;
    data.invite_share = cpinfo.grate || 0;
    data.wallet_addr = cpinfo.address;
    data.cp_id = cpinfo.cid;
    data.operator_id = user.id;

    try {
        //从CP登记的集采接口获取CP详细信息
        let res = await fetch(`${cpinfo.url}/info`, { mode: 'cors' });
        res = await res.json();
        let qry = res.game;

        //合并主网信息和集采信息，调整部分字段名称和数值
        data.cp_text = qry.game_title;
        data.develop_name = qry.provider;
        data.cp_desc = qry.desc;
        data.cp_version = qry.version;
        data.picture_url = JSON.stringify({
            icon_url: qry.icon_url,
            face_url: qry.large_img_url,
            pic_urls: qry.pic_urls,
        });
        data.publish_time = qry.publish_time;
        data.update_time = qry.update_time;
        data.update_content = qry.update_content;
    } catch(e) {
        console.log('CRM - 访问CP公众接口失败', e.message);
    }

    //写入数据库
    console.log('register cp start', data);
    let cp = core.GetObject(EntityType.Cp, cpinfo.cid, IndexType.Foreign);
    if(!cp) {
        await core.GetMapping(EntityType.Cp).Create(
            data.cp_id,
            data.cp_name,
            data.cp_text,
            data.cp_url,
            data.wallet_addr,
            data.cp_type,
            data.develop_name,
            data.cp_desc,
            data.cp_version,
            data.picture_url,
            0,
            data.publish_time,
            data.update_time,
            data.update_content,
            data.invite_share,
            data.operator_id,
        );

        //修改特约商户配置信息, 在系统启动自检时还要再检查一遍
        await core.service.RemoteNode.conn(remoteSetup.cid).execute('sys.changeSpecialCp', [1, `${data.cp_id},`]); //带逗号的字符串会被RPC接口解析为数组
    } else {
        for(let [key, value] of Object.entries(data)) {
            cp.setAttr(key, value);
        }
    }
    console.log('register cp end');
    return { code: 0, msg: "创建CP成功" };
}

module.exports.handle = handle;
