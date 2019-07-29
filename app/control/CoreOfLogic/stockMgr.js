let facade = require('gamecloud')
let {TableType, TableField, IndexType} = facade.const;
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
     * 列表我的凭证，或者列表我的挂单
     * @param {*} user
     * @param {*} objData 
     */
    async MyStock(user, objData) {
        let type = objData.type || 0;
        let conditions = [
            ['page', objData.page],
            ['size', 10],
            ['account', user.domainId],
        ];

        if(!!type) { //挑选有挂单的记录
            conditions.push(['stock.sum', '>', 0]);
        }

        let ret = await this.core.service.gamegoldHelper.execute('stock.list.wallet', [conditions]);
        if(ret.code == 0) {
            let $data = { list: [] };
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
     * 我拍卖凭证
     * @param {*} user      当前操作员，注意如果是系统管理员，要将账户切换为'game'
     * @param {*} objData 
     */
    async bidStock(user, objData) {
        let ret = await this.core.service.gamegoldHelper.execute('stock.bid', [
            objData.params.cid, 
            objData.params.num, 
            objData.params.price, 
            user.domainId, 
            objData.params.addr,
        ]);

        return {code: ret.code};
    }

    /**
     * 我竞买凭证
     * @param {*} user
     * @param {*} objData 
     */
    async auctionStock(user, objData) {
        let ret = await this.core.service.gamegoldHelper.execute('stock.auction', [
            objData.params.cid, 
            objData.params.addr, 
            objData.params.num, 
            objData.params.price,
            user.domainId,
        ]);

        return {code: ret.code}
    }

    /**
     * 查询二级凭证列表
     * @param {*} user
     * @param {*} objData 
     */
    async BidList(user, objData) {
        let ret = await this.core.service.gamegoldHelper.execute('stock.bid.list', [
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
     * 查询一级凭证列表，即众筹列表
     * @param {*} user 
     * @param {*} objData 查询及翻页参数
     */
    ListRecord(user, objData) {
        objData = objData || {};
        let currentPage = objData.currentPage;
        if (Number.isNaN(parseInt(currentPage))) {
            currentPage = 1;
        }
        //构造查询条件
        let paramArray = [];
        let muster = this.core.GetMapping(TableType.StockBase)
            .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
            .where(paramArray)
            .orderby('id', 'desc') //根据id字段倒叙排列
            .paginate(10, currentPage);

        let list = [];
        let $idx = (muster.pageCur - 1) * muster.pageSize;
        for (let $value of muster.records(TableField.StockBase)) {
            $value['rank'] = $idx++;
            //查询CP基本信息，补充显示内容
            let cpObj = this.core.GetObject(TableType.blockgame, $value.cid, IndexType.Foreign);
            if(!!cpObj) { 
                $value.cp_name = cpObj.orm.cp_name;
                $value.cp_text = cpObj.orm.game_desc;
                $value.large_img_url = cpObj.orm.game_resource_uri;
                $value.small_img_url = cpObj.orm.game_resource_uri;
                $value.icon_url = cpObj.orm.game_ico_uri;
                $value.pic_urls = JSON.stringify(cpObj.orm.game_screenshots.split(','));
                $value.cp_desc = cpObj.orm.game_desc;
                $value.provider = cpObj.orm.developer;
            }

            list.push($value);
        }

        return {code: 0, data: {
            total: muster.pageNum,
            page: muster.pageCur,
            list: list}};
    }

    /**
     * 我针对指定 cid 的买入卖出记录
     * @param {*} user 
     * @param {*} params 
     */
    async UserStockLogs(user, params) {
        let cid = params.cid;
        //todo ...
        return {code: 0, data: []};
    }    
}

exports = module.exports = cpstockbase;
