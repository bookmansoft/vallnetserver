let facade = require('gamecloud')
let {EntityType} = facade.const

/**
 * 定时遍历所有CP，查询每个CP一定时期内的所有流水，形成连续历史快照，为K线提供数据支撑
 * @param {Object} data 
 */
async function handle(data) {
    this.GetMapping(EntityType.Cp).groupOf().forEach(async (cp, key) => {
        let stockRecordList = await this.service.gamegoldHelper.execute('stock.record', [0, cp.getAttr("cid"), Math.max(0, this.chain.height - 144)]);
        for(let item of stockRecordList.list) {
            switch(item.type) {
                case 7: {
                    let stock_open = stockRecordList[0].price;
                    let stock_close = stockRecordList[stockRecordList.length - 1].price;
            
                    //最高价最低价，先设置为开盘价
                    let stock_high = stock_open;
                    let stock_low = stock_open;

                    let total_amount = 0;
                    let total_num = 0;
                    for (let stockInfo of stockRecordList) {
                        total_num = total_num + stockInfo.sum;
                        total_amount = total_amount + stockInfo.sum * stockInfo.price;
                        if (stockInfo.price > stock_high) {
                            stock_high = stockInfo.price;
                        }
                        if (stockInfo.price < stock_low) {
                            stock_low = stockInfo.price;
                        }
                    }

                    //记录凭证的开盘、收盘价等数据
                    let today = new Date();
                    await this.core.GetMapping(EntityType.CpStock).Create(
                        cp.getAttr("cid"),
                        today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
                        stock_open,
                        stock_close,
                        stock_high,
                        stock_low,
                        total_num,
                        total_amount,
                    );

                    break;
                }
            }
        }
    }, this);
}

module.exports.handle = handle;
