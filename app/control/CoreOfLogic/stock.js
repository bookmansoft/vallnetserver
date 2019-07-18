let facade = require('gamecloud');
let {TableType} = facade.const;
let tableField = require('../../util/tablefield');

/**
 * 管理后台
 */
class stock extends facade.Control
{
    //众筹列表
    async Stocks(user, params) {
        let stockList = await this.core.GetMapping(TableType.stock).groupOf().where([['status', '==', 1]]).records(tableField.stock)
        return {errcode: 'success', data: stockList} 
    }

    //众筹详情
    async StockInfo(user, params) {
        let stockInfo = this.core.GetObject(TableType.stock, params.id);          
        if(!!userStock) {
            return {errcode: 'success', data: stockInfo};
        }
        return {errcode: 'fail', data: null};
    }

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
            userStockItem.setAttr('quantity', userStockItem.orm.quantity - quantity)
            userStockItem.orm.save()
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
            ]).records(tableField.userstocklog)
        return {code: 0, data: userStockLogs};
    }

    //用户众筹记录
    async UserStocks(user, params) {
        let uid = user.id
        let userStockActs = await this.core.GetMapping(TableType.userstock).groupOf()
            .where([
                ['uid', '==', uid]
            ]).records(tableField.userstock);

        return {code: 0, data: userStockActs};
    }

    //用户众筹记录详情
    async UserStockInfo(user, params) {
        let userStock = this.core.GetObject(TableType.userstock, params.id);          
        if(!!userStock) {
            return {errcode: 'success', data: userStock};
        }
        return {errcode: 'fail', data: null};
    }

    async StockSend(user, params) {
        let uid = user.id
        let cid = params.cid
        let addr = await this.core.service.userhelp.getAddrFromUserIdAndCid(uid, cid)
        let ret = await this.core.service.gamegoldHelper.execute('stock.send', [cid, 100, addr, 'alice']);
        return {errcode: 'success', data: ret} 
    }

}

exports = module.exports = stock;
