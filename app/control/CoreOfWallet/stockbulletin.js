let facade = require('gamecloud')
let { IndexType, ReturnCode, TableType, TableField } = facade.const

/**
 * 凭证看板控制器
 * Updated on 2018-11-19.
 */
class stockbulletin extends facade.Control {
    /**
     * 查询当日统计数据
     * @param {*} user 
     * @param {*} params
     */
    async Retrieve(user, params) {
        if (params == null) {
            params = {};
        }

        if (!params.stock_day) {
            var date = new Date();
            params.stock_day = `${date.getFullYear()}-${(date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)}-${(date.getDate() < 10 ? '0' + date.getDate() : date.getDate())}`;
        }

        let record = this.core.GetObject(TableType.StockBulletin, `${params.cid}-${params.stock_day}`, IndexType.Domain);
        if(!!record) {
            record = TableField.record(record.orm, TableField.StockBulletin);
        } else {
            record = {
                cid: params.cid,
                stock_day: params.stock_day,
                sum: 0,                             //流通总量
                price: 0,                           //平均成本
                bonus: 0,                           //分成总量
                total_num: 0,                       //总成交数量
                total_amount: 0,                    //总成交金额
            };

            //交易类型 GLOBAL.RecordType
            // {
            //     1: '发行凭证', sum 发行数量 addr 凭证发行者(交易发起者) to 没有意义   price 发行价格
            //     2: '购买凭证', sum 买入数量 addr 凭证买入者(交易发起者) to 凭证拥有者 price 无意义
            //     3: '转让凭证', sum 转让数量 addr 凭证拥有者(交易发起者) to 凭证接收者 price 无意义
            //     4: '凭证分成', sum 没有意义 addr 分成受益者(分成诉求方) to 没有意义   price 分成数量
            //     5: '媒体分成', sum 没有意义 addr 分成受益者(分成诉求方) to 没有意义   price 分成数量
            //     6: '拍卖凭证', sum 拍卖数量 addr 凭证拍卖者(交易发起者) to 无意义     price 拍卖价格
            //     7: '竞买凭证', sum 买入数量 addr 凭证买入者(交易发起者) to 凭证拥有者 price 买入价格
            // }            
            let ret = await this.core.service.gamegoldHelper.execute('stock.record.wallet', [0, params.cid, Math.max(0, this.core.chain.height - 144)]);
            if(ret.code == 0) {
                let qry = new facade.Collection(ret.result.list.reduce((sofar, cur) => {
                    sofar.push([cur.sn, cur]);
                    return sofar;
                },[]));

                let result = qry.where([['type', 'include', [2,7]]]).orderby('seq', 'asc').records();
                if(result.length > 0) {
                    record.stock_open = result[0].price; //开盘价
                    record.stock_close = result[result.length-1].price; //收盘价

                    for(let it of result) {
                        record.total_num += it.sum;                        
                        record.total_amount += it.sum * it.price;
                        if(!record.stock_high || record.stock_high < it.price) {
                            record.stock_high = it.price;
                        }
                        if(!record.stock_low || record.stock_low > it.price) {
                            record.stock_low = it.price;
                        }
                    }
                }
            }
    
            let cpObj = this.core.GetObject(TableType.blockgame, params.cid, IndexType.Domain);
            if(!!cpObj) { 
                record.sum = cpObj.orm.stock_sum;
                record.price = cpObj.orm.stock_price;
                record.bonus = cpObj.orm.hBonus;
            }

            this.core.GetMapping(TableType.StockBulletin).Create(record);
        }

        return {code: 0, data: record};
    }
}

exports = module.exports = stockbulletin;
