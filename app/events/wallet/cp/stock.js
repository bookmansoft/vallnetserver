let facade = require('gamecloud')
let {TableType, IndexType} = facade.const

/**
 * 凭证一级市场发行事件
 * @param {Object} data.msg { cid, name, url, address, ip, cls, grate, wid, account }
 */
function handle(data) {
    //收到CP注册事件
    CreateRecord(data.msg, this).catch(e => {
        console.error(e);
    });
}

async function CreateRecord(cpinfo, core) {
    if(!cpinfo || typeof cpinfo != 'object') {
        console.log('cp.CreateRecord: error cp info.');
        return {code: 0};
    }

    if(cpinfo.cid == "xxxxxxxx-game-gold-boss-xxxxxxxxxxxx") { //强制跳过特殊CP
        return {code: 0};
    }

    //部分保留字段
    // "stock": {
    //     "hHeight": 13912,
    //     "hBonus": 0,
    //     "hAds": 0,
    // }

    let cpObj = core.GetObject(TableType.blockgame, cpinfo.cid, IndexType.Foreign);
    if(cpObj) {
        let days = ((14*24*60 - (core.chain.height - cpinfo.stock.height)*10)/60/24)|0;
        await core.GetMapping(TableType.StockBase).Create({
            cid: cpinfo.cid,                                //CID
            cp_name: cpinfo.name,                           //名称
            cp_text: cpinfo.name,                           //中文名
            total_num: cpinfo.stock.hSum,                   //流通凭证总数量
            sell_stock_amount: 0,                           //最新挂单价 - 二级市场最新报价
            sell_stock_num:0,                               //挂单数量 - 二级市场挂单数量
            base_amount: cpinfo.stock.hPrice,               //历史发行价格
            stock_money: cpinfo.stock.price,                //当前发行价格     
            supply_people_num:0,                            //支持人数
            supply_money: 0,                                //支持金额 - 似乎和 已筹金额 重复
            funding_residue_day:days,                       //剩余天数
            funding_target_amount: cpinfo.stock.price*cpinfo.stock.sum,     //目标金额
            funding_done_amount:0,                                          //已筹金额
        });
    }
    return { code: 0, msg: "创建STOCK成功" };
}

module.exports.handle = handle;
