let facade = require('gamecloud')
let {TableType, EntityType, IndexType, TableField} = facade.const

/**
 * CP一级市场购买事件
 * @param {Object} data.msg
 */
function handle(data) {
    return CreateRecord(data.msg, this).catch(e => {
        console.error(e);
    });
}

/**
 * CP一级市场购买事件
 * @param {Object} record 
 */
async function CreateRecord(record, core) {
    if(!record || typeof record != 'object') {
        return {code: 0};
    }

    if(record.cid == "xxxxxxxx-game-gold-boss-xxxxxxxxxxxx") { //强制跳过特殊CP
        return {code: 0};
    }

    let stockList = core.GetMapping(TableType.StockBase).groupOf()
        .where([['cid', record.cid]])
        .orderby('height', 'desc')
        .records();

    let dirty = false;
    let stock = stockList[0];
    if(!!stock) {
        let content = {
            sum_left: record.sum_left,                      //发行剩余数量
            supply_people_num: record.support,              //支持人数
        };
    
        for(let key of Object.keys(content)) {
            if(typeof content[key] != 'undefined' && stock.orm[key] != content[key]) {
                stock.orm[key] = content[key];
                dirty = true;
            }
        }

        if(dirty) {
            stock.orm.save();
        }
    }

    return { code: 0 };
}

module.exports.handle = handle;
