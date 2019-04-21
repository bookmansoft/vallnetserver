let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');
let userHelp = require('../../util/userhelp')
const gamegoldHelp = require('../../util/gamegoldHelp');

/**
 * 管理后台
 */
class stock extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    //众筹列表
    async Stocks(user, params) {
        let stockList = await facade.GetMapping(tableType.stock).groupOf().where([['status', '==', 1]]).records(tableField.stock)
        return {errcode: 'success', data: stockList} 
    }

    //众筹详情
    async StockInfo(user, params) {
        let stockInfo = facade.GetObject(tableType.stock, params.id);          
        if(!!userStock) {
            return {errcode: 'success', data: stockInfo};
        }
        return {errcode: 'fail', data: null};
    }

    //用户众筹记录
    async UserStocks(user, params) {
        let uid = params.uid
        let cid = params.cid
        let userStockActs = await facade.GetMapping(tableType.userStock).groupOf()
            .where([
                ['uid', '==', uid]
            ]).records(tableField.userStock)
        return {errcode: 'success', data: userStockActs}    
    }

    //用户众筹记录详情
    async UserStockInfo(user, params) {
        let userStock = facade.GetObject(tableType.userStock, params.id);          
        if(!!userStock) {
            return {errcode: 'success', data: userStock};
        }
        return {errcode: 'fail', data: null};
    }

    async StockSend(user, params) {
        let uid = params.uid
        let cid = params.cid
        let uhelp = new userHelp()
        let addr = uhelp.getAddrFromUserIdAndCid(uid, cid)
        let ret = await gamegoldHelp.execute('stock.send', [cid, 100, addr, 'alice']);
        return {errcode: 'success', data: ret} 
    }

}

exports = module.exports = stock;
