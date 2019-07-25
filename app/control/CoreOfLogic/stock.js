let facade = require('gamecloud');
let {TableType, TableField, IndexType} = facade.const;

/**
 * 管理后台
 */
class stock extends facade.Control
{
    /**
     * 从数据库中获取列表
     * 客户端直接调用此方法
     * @param {*} user 
     * @param {*} objData 查询及翻页参数，等整体调通以后再细化。
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
