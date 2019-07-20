let facade = require('gamecloud')
let {TableType, DomainType, UserStatus, EntityType, IndexType} = facade.const
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息
let fetch = require("node-fetch");

/**
 * CP成功注册事件
 * 主网下发CP注册通知，此时应该将CP记录插入数据库
 * @param {Object} data.msg { cid, name, url, address, ip, cls, grate, wid, account }
 */
function handle(data) {
    //收到CP注册事件
    CreateRecord(data.msg, this).catch(e => {
        console.error(e);
    });
}

/**
 * 创建新的CP对象(当收到主网通知，或者系统自检时调用，客户端不会直接调用)：
 * 1. 从游戏厂商接口处集采信息
 * 2. 将集采信息和主网信息进行整合
 * 3. 创建新的数据库记录
 * @param {Object} cpinfo { cid, name, url, address, ip, cls, grate, wid, account }
 */
async function CreateRecord(cpinfo, core) {
    if(!cpinfo || typeof cpinfo != 'object') {
        console.log('cp.CreateRecord: error cp info.');
        return {code: 0};
    }

    if(cpinfo.cid == "xxxxxxxx-game-gold-boss-xxxxxxxxxxxx") { //强制跳过特殊CP
        return {code: 0};
    }

    //部分尚未采用的字段：
    //cpinfo.grate

    //从CP登记的集采接口获取CP详细信息
    let res = await fetch(`${cpinfo.url}/${cpinfo.name}`, { mode: 'cors' });
    res = await res.json();
    let qry = res.game;

    let pics = ''
    if(typeof qry.pic_urls == 'string') {
        qry.pic_urls = JSON.parse(qry.pic_urls);
    }
    if(Array.isArray(qry.pic_urls)) {
        pics = qry.pic_urls.reduce((sofar,cur)=>{sofar = sofar==''? cur : sofar+','+cur; return sofar;},'');
    }

    //写入数据库
    await core.GetMapping(TableType.blockgame).Create({
        game_code: 'ty-yz-001', // `game_code` varchar(32) '编码',
        sort: 1, // `sort` int(4)  '排序',
        category_id: 1001, // `category_id` int(2)  '游戏类别',
        category_title: cpinfo.cls, // `category_title` varchar(32)  '类别名',
        provider_id: 1002, // `provider_id` int(4)  '供应商ID',
        provider_name: '红蝶游戏', // `provider_name` varchar(32)  '供应商名',
        ad_title: '孤胆车神：新奥尔良 - 在线开放世界游戏', // `ad_title` varchar(32)  '推广标题',
        ranking: 0, // `ranking` int(2)  '排名',
        star_level: 0, // `star_level` int(2)  '星级',
        player_count: 368, // `player_count` int(4)  '玩家人数',
        down_count: 0, // `down_count` int(4)  '下载次数',
        comment_count: 1, // `comment_count` int(4)  '评论数',
        game_version: qry.version, // `game_version` varchar(16)  '版本号',
        developer: qry.provider, // `developer` varchar(64)  '开发者',
        create_time: qry.publish_time, // `create_time` int(8)  '创建时间',
        update_time: qry.update_time, // `update_time` int(8)  '更新时间',
        store_status: qry.state, // `store_status` int(1)  '状态',
        cpid: cpinfo.cid, // `cpid` varchar(64)  'cpid',
        cpurl: cpinfo.url, // `cpurl` varchar(255)  'cpurl',
        cp_addr: cpinfo.address, // `cp_addr` varchar(64)  'cp地址',
        cp_name: cpinfo.name, // `cp_name` varchar(32)  'cp_name',
        game_title: qry.game_title, // `game_title` varchar(64)  '标题',
        game_link_url: '', // `game_link_url` varchar(255)  '游戏链接',
        game_ico_uri: qry.icon_url, // `game_ico_uri` varchar(255)  '图标URI',
        update_desc: qry.update_content, // `update_desc` varchar(255)  '更新描述',
        game_resource_uri: qry.large_img_url,  // `game_resource_uri` varchar(255)  '资源URI',
        game_screenshots: pics, // `game_screenshots` varchar(255)  '游戏截图',
        game_desc: qry.desc, // `game_desc` varchar(255)  '描述',
    });

    return { code: 0, msg: "创建CP成功" };
}

module.exports.handle = handle;
