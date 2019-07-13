let facade = require('gamecloud')
let { ReturnCode, NotifyType, TableType } = facade.const
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class cpstockbase extends facade.Control {
    /**
     * 增加数据库记录。此方法被从页面入口的Create方法所调用
     * 众筹申请写数据库的部分
     * @param {*} user 
     * @param {*} objData 
     */
    async CreateRecord(user, objData) {
        await this.core.GetMapping(TableType.CpStockBase).Create(
            objData.cpid,
            objData.cid,
            objData.cp_name,
            objData.cp_text,
            objData.total_num,
            objData.sell_stock_amount,
            objData.sell_stock_num,
            objData.base_amount,
            user.id,
        );
        return { code: ReturnCode.Success, data: null, message: "cpstockbase.CreateRecord成功" };
    }

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
     * 拍卖凭证
     * @param {*} user      当前操作员，注意如果是系统管理员，要将账户切换为'game'
     * @param {*} objData 
     */
    async auctionStock(user, objData) {
        let account = user.cid;
        if(account == remoteSetup.cid) {
            account = 'game';
        }

        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('stock.auction', [
            objData.params.cid, objData.params.srcAddr, objData.params.num, objData.params.price,
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

    /**
     * 查看单个记录
     * @param {*} user 
     * @param {*} objData 
     */
    async Retrieve(user, objData) {
        console.log(158,objData.id);
        try {
            let cpstockbase = this.core.GetObject(TableType.CpStockBase, parseInt(objData.id));
            if (!!cpstockbase) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        id: parseInt(objData.id),
                        cid: cpstockbase.getAttr("cid"),
                        cpid: cpstockbase.getAttr('cpid'),
                        cp_name: cpstockbase.getAttr('cp_name'),
                        cp_text: cpstockbase.getAttr('cp_text'),
                        total_num: cpstockbase.getAttr('total_num'),
                        sell_stock_amount: cpstockbase.getAttr('sell_stock_amount'),
                        sell_stock_num: cpstockbase.getAttr('sell_stock_num'),
                        base_amount: cpstockbase.getAttr('base_amount'),
                        operator_id: cpstockbase.getAttr('operator_id'),
                    },

                };
            }
            else {
                return { code: -2, data: null, message: "该cpstockbase不存在" };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cpstockbase.Retrieve方法出错" };
        }
    }
}

exports = module.exports = cpstockbase;
