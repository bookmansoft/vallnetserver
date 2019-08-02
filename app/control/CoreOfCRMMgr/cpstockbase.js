let facade = require('gamecloud')
let { ReturnCode, TableType } = facade.const
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息

/**
 * 游戏的控制器
 * Updated on 2018-11-19.
 */
class cpstockbase extends facade.Control {
    /**
     * 向目标地址赠送凭证
     * @param {*} user      当前操作员，注意如果是系统管理员，要将账户切换为'game'
     * @param {*} objData 
     */
    async sendStock(user, objData) {
        let account = user.cid;
        if(account == remoteSetup.cid) {
            account = 'game';
        }

        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('stock.send', [
            objData.params.cid, objData.params.num, objData.params.address, null, objData.params.srcAddr,
        ]);

        return {code: ret.code}
    }

    /**
     * 列表我的凭证
     * @param {*} user      当前操作员，注意如果是系统管理员，要将账户切换为'game'
     * @param {*} objData 
     */
    async MyStock(user, objData) {
        let account = user.cid;
        if(account == remoteSetup.cid) {
            account = 'game';
        }

        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('stock.list.wallet', [
            [
                ['page', objData.currentPage],
                ['size', objData.pageSize],
                ['account', account],
            ]
        ]);

        if(ret.code == 0) {
            let $data = { list: [] };
            $data.pagination = { "total": ret.result.count, "pageSize": ret.result.countCur, "current": ret.result.cur };
            $data.total = ret.result.page;
            $data.page = ret.result.cur;
            for(let item of ret.result.list) {
                $data.list.push({
                    cid: item.cid,
                    addr: item.addr,
                    sum: item.sum,
                    price: item.price,
                    sell_price: item.stock.price,
                    sell_sum: item.stock.sum,
                });
            }

            return {code: 0, data:$data}
        } else {
            return {code: ret.code, data: null};
        }
    }

    /**
     * 拍卖凭证
     * @param {*} user      当前操作员，注意如果是系统管理员，要将账户切换为'game'
     * @param {*} objData 
     */
    async bidStock(user, objData) {
        let account = user.cid;
        if(account == remoteSetup.cid) {
            account = 'game';
        }

        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('stock.bid', [
            objData.params.cid, objData.params.num, objData.params.price, null, objData.params.srcAddr,
        ]);

        return {code: ret.code}
    }

    /**
     * 竞拍凭证
     * @param {*} user      当前操作员，注意如果是系统管理员，要将账户切换为'game'
     * @param {*} objData 
     */
    async auctionStock(user, objData) {
        let account = user.cid;
        if(account == remoteSetup.cid) {
            account = 'game';
        }

        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('stock.auction', [
            objData.params.cid, 
            objData.params.srcAddr, 
            objData.params.num, 
            objData.params.price,
        ]);

        return {code: ret.code}
    }

    /**
     * 查询转让凭证列表
     * @param {*} user      当前操作员，注意如果是系统管理员，要将账户切换为'game'
     * @param {*} objData 
     */
    async BidList(user, objData) {
        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('stock.bid.list', [
            [
                ['page', objData.currentPage],
                ['size', objData.pageSize],
            ]
        ]);

        if(ret.code == 0) {
            let $data = { list: [] };
            $data.pagination = { "total": ret.result.count, "pageSize": ret.result.countCur, "current": ret.result.cur };
            $data.total = ret.result.page;
            $data.page = ret.result.cur;
            for(let item of ret.result.list) {
                $data.list.push({
                    cid: item.cid,
                    addr: item.addr,
                    sum: item.sum,
                    price: item.price,
                    sell_price: item.stock.price,
                    sell_sum: item.stock.sum,
                    period: item.stock.period,
                });
            }

            return {code: 0, data:$data}
        } else {
            return {code: ret.code, data: null};
        }
    }
}

exports = module.exports = cpstockbase;
