let facade = require('gamecloud')
let {TableType, EntityType, IndexType, TableField} = facade.const
let fetch = require("node-fetch");

/**
 * CP成功注册事件
 * 主网下发CP注册通知，此时应该将CP记录插入数据库
 * @param {Object} data.msg { cid, name, url, address, ip, cls, grate, wid, account }
 * 
 * @description 如果不返回 Promise 的话，事件将不能充当同步事件使用，即使外围使用 await 也起不到阻塞作用
 */
function handle(data) {
    //收到CP注册事件，在本地数据库注册CP信息
    return CreateRecord(data.msg, this).catch(e => {
        console.error(e);
    });
}

/**
 * 创建新的CP对象(当收到主网通知，或者系统自检时调用，客户端不会直接调用)：
 * 1. 从游戏厂商接口处集采信息
 * 2. 将集采信息和主网信息进行整合
 * 3. 创建新的数据库记录
 * @param {Object} cpInfo { cid, name, url, address, ip, cls, grate, wid, account }
 */
async function CreateRecord(cpInfo, core) {
    if(!cpInfo || typeof cpInfo != 'object') {
        console.log('cp.CreateRecord: error cp info.');
        return {code: 0};
    }

    if(cpInfo.cid == "xxxxxxxx-game-gold-boss-xxxxxxxxxxxx") { //强制跳过特殊CP
        return {code: 0};
    }

    cpInfo.stock = cpInfo.stock || {}; //主网CP注册消息中，不包含 stock 信息

    let content = {
        sort: 1, // `sort` int(4)  '排序',
        category_id: 1001, // `category_id` int(2)  '游戏类别',
        provider_id: 1002, // `provider_id` int(4)  '供应商ID',
        provider_name: '红蝶游戏', // `provider_name` varchar(32)  '供应商名',
        ad_title: '孤胆车神：新奥尔良 - 在线开放世界游戏', // `ad_title` varchar(32)  '推广标题',
        ranking: 0, // `ranking` int(2)  '排名',
        star_level: 0, // `star_level` int(2)  '星级',
        player_count: 368, // `player_count` int(4)  '玩家人数',
        down_count: 0, // `down_count` int(4)  '下载次数',
        comment_count: 1, // `comment_count` int(4)  '评论数',
        game_link_url: '', // `game_link_url` varchar(255)  '游戏链接',

        cpid: cpInfo.cid, // `cpid` 'CP编码',
        category_title: cpInfo.cls, // `category_title` varchar(32)  '类别名',
        cpurl: cpInfo.url, // `cpurl` varchar(255)  'cpurl',
        cp_addr: cpInfo.address, // `cp_addr` varchar(64)  'cp地址',
        cp_name: cpInfo.name, // `cp_name` varchar(32)  'cp_name',
        grate: cpInfo.grate, // 媒体分成比例
        stock_price: cpInfo.stock.hPrice || 0, // 凭证持有均价
        stock_sum: cpInfo.stock.hSum || 0, // 凭证流通总量
        hHeight: cpInfo.stock.hHeight || -1, //初次众筹高度
        hBonus: cpInfo.stock.hBonus || 0, //历史分红
        hAds: cpInfo.stock.hAds || 0, //历史分成
    };

    //从CP开放接口获取CP详细信息
    //@warning 如果开放接口访问异常，会导致中台CP注册流程提前终止
    let res = {};
    try {
        res = await fetch(`${cpInfo.url}`, { mode: 'cors' });
        res = await res.json();

        let pics = '';
        if(typeof res.game.pic_urls == 'string') {
            res.game.pic_urls = JSON.parse(res.game.pic_urls);
        }
        if(Array.isArray(res.game.pic_urls)) {
            pics = res.game.pic_urls.reduce((sofar,cur)=>{sofar = sofar==''? cur : sofar+','+cur; return sofar;},'');
        }
    
        content.game_version = res.game.version; // `game_version` varchar(16)  '版本号',
        content.developer = res.game.provider; // `developer` varchar(64)  '开发者',
        content.create_time = res.game.publish_time; // `create_time` int(8)  '创建时间',
        content.update_time = res.game.update_time; // `update_time` int(8)  '更新时间',
        content.store_status = res.game.state; // `store_status` int(1)  '状态',
        content.game_title = res.game.game_title; // `game_title` varchar(64)  '标题',
        content.game_ico_uri = res.game.icon_url; // `game_ico_uri` varchar(255)  '图标URI',
        content.update_desc = res.game.update_content; // `update_desc` varchar(255)  '更新描述',
        content.game_resource_uri = res.game.large_img_url;  // `game_resource_uri` varchar(255)  '大图',
        content.small_img_url = res.game.small_img_url;  // `small_img_url` varchar(255)  '小图',
        content.game_screenshots = pics; // `game_screenshots` varchar(255)  '游戏截图',
        content.game_desc = res.game.desc; // `game_desc` varchar(255)  '描述',
    } catch(e) {
        console.log('CP开放接口访问错误', e.message);
        return {code: 0};
    }

    let cpObj = core.GetObject(TableType.blockgame, cpInfo.cid, IndexType.Domain);
    if(!!cpObj) { //已经有相同 cid 的记录了, 更新其内容
        for(let key of Object.keys(content)) {
            cpObj.orm[key] = content[key];
        }
    } else { //尚无记录，创建新的条目
        await core.GetMapping(TableType.blockgame).Create(content);
    }

    //完成众筹信息的入库和更新
    if(cpInfo.stock.sum > 0 && cpInfo.stock.height > 0) {
        let stockList = core.GetMapping(TableType.StockBase).groupOf()
            .where([['cid', cpInfo.cid]])
            .orderby('height', 'desc')
            .records();

        let content = {
            sum_left: cpInfo.stock.sum,                     //发行剩余数量
            supply_people_num:0,                            //支持人数
        };

        let stock = stockList[0];
        if(!stock || cpInfo.stock.height > stock.orm.height) { //如果是新纪录，或者是更高高度的记录
            content.sum = cpInfo.stock.sum,                    //发行数量
            content.cid = cpInfo.cid,                          //CID
            content.height = cpInfo.stock.height,              //发行高度，可据此计算剩余天数
            content.price = cpInfo.stock.price,                //发行价格,单位尘

            //从CP开放接口获得的数据
            content.funding_text = res.crowd.funding_text;
            content.funding_project_text = res.crowd.funding_project_text;

            await core.GetMapping(TableType.StockBase).Create(content);
        } else if (cpInfo.stock.height == stock.orm.height) { //相同高度才更新
            for(let key of Object.keys(content)) {
                stock.orm[key] = content[key];
            }
        }
    }

    return { code: 0 };
}

module.exports.handle = handle;
