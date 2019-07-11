let facade = require('gamecloud')
let {DomainType, UserStatus, EntityType, IndexType, TableType} = facade.const

/**
 * 刷新凭证信息
 * @param {Object} data.msg 
 */
async function handle(data) {
    // let cpstockbase = this.GetObject(TableType.CpStockBase, parseInt(data.msg.id));
    // if (!!cpstockbase) {
    //     let stockRecordList = (await this.service.gamegoldHelper.execute('stock.record', [
    //         7,  //有偿转让凭证交易查询
    //         cpstockbase.getAttr("cid"),
    //         Math.max(0, this.chain.height - 1440),
    //     ])).list;
    
    //     if (stockRecordList.length > 0) {
    //         let stock_open = stockRecordList[0].price;
    //         let stock_close = stockRecordList[stockRecordList.length - 1].price;
    
    //         //最高价最低价，先设置为开盘价
    //         let stock_high = stock_open;
    //         let stock_low = stock_open;
    //         let total_amount = 0;
    //         let total_num = 0;
    //         for (let stockInfo of stockRecordList) {
    //             total_num = total_num + stockInfo.sum;
    //             total_amount = total_amount + stockInfo.sum * stockInfo.price;
    //             console.log('发现凭证价格' + stockInfo.price);
    //             if (stockInfo.price > stock_high) {
    //                 stock_high = stockInfo.price;
    //             }
    //             if (stockInfo.price < stock_low) {
    //                 stock_low = stockInfo.price;
    //             }
    //         }
    //         //记录凭证的开盘、收盘价等数据
    //         let today = new Date();
    //         await this.core.GetMapping(TableType.CpStock).Create(
    //             cpstockbase.getAttr("cid"),
    //             cpstockbase.getAttr("cp_name"),
    //             cpstockbase.getAttr("cp_text"),
    //             today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
    //             stock_open,
    //             stock_close,
    //             stock_high,
    //             stock_low,
    //             total_num,
    //             total_amount,
    //         );
    //     }

    //     stockRecordList = (await this.service.gamegoldHelper.execute('stock.record', [
    //         6,  //有偿转让凭证挂单查询
    //         cpstockbase.getAttr("cid"),
    //         Math.max(0, this.chain.height - 1440),
    //     ])).list;
    //     if (stockRecordList.count != 0) {
    //         let sell_stock_amount = stockRecordList.list[0].price;
    //         let sell_stock_num = stockRecordList.list[0].sum;
    //         cpstockbase.setAttr('sell_stock_amount', sell_stock_amount);
    //         cpstockbase.setAttr('sell_stock_num', sell_stock_num);
    //     }
    // }
}

module.exports.handle = handle;
