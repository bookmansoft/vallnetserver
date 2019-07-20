let facade = require('gamecloud');
let {TableType, TableField} = facade.const;

/**
 * 管理后台
 */
class stock extends facade.Control
{
    //众筹详情
    async StockSale(user, params) {
        let uid = user.id
        let cid = params.cid
        let price = params.price
        let quantity = params.quantity
        let current_time = parseInt(new Date().getTime() / 1000)

        let userStockItems = this.core.GetMapping(TableType.userstock).groupOf().where([
            ['uid', '==', uid],
            ['cid', '==', cid]
        ]).records();
        if(userStockItems.length >0 ) {
            let userStockItem = userStockItems[0]
            userStockItem.setAttr('quantity', userStockItem.orm.quantity - quantity);
        }

        let userStockLogItem = {
            uid: uid,
            cid: cid,
            quantity: quantity,
            pay_at: current_time,
            status: 0
        }
        await this.core.GetMapping(TableType.userstocklog).Create(userStockLogItem)
        return {code: 0, data: userStockLogItem};
    }

    //用户众筹记录
    async UserStockLogs(user, params) {
        let uid = user.id
        let cid = params.cid
        let userStockLogs = await this.core.GetMapping(TableType.userstocklog).groupOf()
            .where([
                ['uid', '==', uid],
                ['cid', '==', cid]
            ]).records(TableField.userstocklog)
        return {code: 0, data: userStockLogs};
    }

    //用户众筹记录
    async UserStocks(user, params) {
        let uid = user.id
        let userStockActs = await this.core.GetMapping(TableType.userstock).groupOf()
            .where([
                ['uid', '==', uid]
            ]).records(TableField.userstock);

        return {code: 0, data: userStockActs};
    }

    //用户众筹记录详情
    async UserStockInfo(user, params) {
        let userStock = this.core.GetObject(TableType.userstock, params.id);          
        if(!!userStock) {
            return {code: 0, data: userStock};
        }
        return {code: -1};
    }
}

exports = module.exports = stock;
