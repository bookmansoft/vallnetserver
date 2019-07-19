let facade = require('gamecloud')
let { ReturnCode, NotifyType, TableType, TableField } = facade.const

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class stockbase extends facade.Control {
    get router() {
        return [
            ['/stockbase/delete', 'delete'], //指定发放签名功能的路由、函数名
            ['/stockbase/update', 'update'],
            ['/stockbase/save', 'save'],
            ['/stockbase/get', 'get'],
            ['/stockbase/page', 'page'],
        ];
    }
    async delete(data) {
        return this.DeleteRecord(null, data);
    }
    async update(data) {
        return this.UpdateRecord(null, data);
    }
    async save(data) {
        return this.CreateRecord(null, data);
    }
    async get(data) {
        return this.Retrieve(null, data);
    }
    async page(data) {
        return this.ListRecord(null, data);
    }
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }
    /**
     * 删除记录
     * @param {*} user 
     * @param {*} objData 
     */
    async DeleteRecord(user, objData) {
        try {
            this.core.GetMapping(TableType.StockBase).Delete(objData.id, true);
            return { code: ReturnCode.Success, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "stockbase.DeleteRecord方法出错" };
        }
    }
    /**
     * 修改数据库记录
     * @param {*} user 
     * @param {*} objData 
     */
    async UpdateRecord(user, objData) {
        try {
            console.log("46:更新数据", objData.id);
            let stockbase = this.core.GetObject(TableType.StockBase, parseInt(objData.id));
            if (!!stockbase) {
                //需要针对各个属性增加为null的判断；如果为null的情况下，则
                stockbase.setAttr('cid', objData.cid);
                stockbase.setAttr('cp_name', objData.cp_name);
                stockbase.setAttr('cp_text', objData.cp_text);
                stockbase.setAttr('total_num', objData.total_num);
                stockbase.setAttr('sell_stock_amount', objData.sell_stock_amount);
                stockbase.setAttr('sell_stock_num', objData.sell_stock_num);
                stockbase.setAttr('base_amount', objData.base_amount);
                stockbase.setAttr('operator_id', user.id);

                stockbase.setAttr('large_img_url', objData.large_img_url);
                stockbase.setAttr('small_img_url', objData.small_img_url);
                stockbase.setAttr('icon_url', objData.icon_url);
                stockbase.setAttr('pic_urls', objData.pic_urls);
                stockbase.setAttr('cp_desc', objData.cp_desc);
                stockbase.setAttr('funding_text', objData.funding_text);
                stockbase.setAttr('funding_project_text', objData.funding_project_text);
                stockbase.setAttr('stock_money', objData.stock_money);
                stockbase.setAttr('supply_people_num', objData.supply_people_num);
                stockbase.setAttr('supply_money', objData.supply_money);
                stockbase.setAttr('funding_residue_day', objData.funding_residue_day);
                stockbase.setAttr('funding_target_amount', objData.funding_target_amount);
                stockbase.setAttr('funding_done_amount', objData.funding_done_amount);
                stockbase.setAttr('provider', objData.provider);
                stockbase.setAttr('history_text',objData.provider);
                stockbase.setAttr('now_sale',objData.now_sale);

                stockbase.Save();

                return { code: ReturnCode.Success };
            }
            return { code: -2, msg: "找不到记录" };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "stockbase.UpdateRecord方法出错" };
        }
    }

    /**
     * 增加数据库记录。此方法被从页面入口的Create方法所调用
     * 众筹申请写数据库的部分
     * @param {*} user 
     * @param {*} objData 
     */
    async CreateRecord(user, objData) {
        try {
            await this.core.GetMapping(TableType.StockBase).Create(
                objData.cid,
                objData.cp_name,
                objData.cp_text,
                objData.total_num,
                objData.sell_stock_amount,
                objData.sell_stock_num,
                objData.base_amount,
                objData.operator_id,

                objData.large_img_url,
                objData.small_img_url,
                objData.icon_url,
                objData.pic_urls,
                objData.cp_desc,
                objData.funding_text,
                objData.funding_project_text,
                objData.stock_money,
                objData.supply_people_num,
                objData.supply_money,
                objData.funding_residue_day,
                objData.funding_target_amount,
                objData.funding_done_amount,
                objData.provider,
                objData.history_text,
                objData.now_sale,
            );
            let ret = { code: ReturnCode.Success, msg: "stockbase.CreateRecord成功" };
            console.log(ret);
            return ret;
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "stockbase.CreateRecord方法出错" };
        }

    }

    /**
     * 查看单个记录
     * @param {*} user 
     * @param {*} objData 
     */
    async Retrieve(user, objData) {
        console.log(158, objData.id);
        try {
            let stockbase = this.core.GetObject(TableType.StockBase, parseInt(objData.id));
            if (!!stockbase) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        id: parseInt(objData.id),
                        cid: stockbase.getAttr("cid"),
                        cp_name: stockbase.getAttr('cp_name'),
                        cp_text: stockbase.getAttr('cp_text'),
                        total_num: stockbase.getAttr('total_num'),
                        sell_stock_amount: stockbase.getAttr('sell_stock_amount'),
                        sell_stock_num: stockbase.getAttr('sell_stock_num'),
                        base_amount: stockbase.getAttr('base_amount'),
                        operator_id: stockbase.getAttr('operator_id'),

                        large_img_url: stockbase.getAttr('large_img_url'),
                        small_img_url: stockbase.getAttr('small_img_url'),
                        icon_url: stockbase.getAttr('icon_url'),
                        pic_urls: stockbase.getAttr('pic_urls'),
                        cp_desc: stockbase.getAttr('cp_desc'),
                        funding_text: stockbase.getAttr('funding_text'),
                        funding_project_text: stockbase.getAttr('funding_project_text'),
                        stock_money: stockbase.getAttr('stock_money'),
                        supply_people_num: stockbase.getAttr('supply_people_num'),
                        supply_money: stockbase.getAttr('supply_money'),
                        funding_residue_day: stockbase.getAttr('funding_residue_day'),
                        funding_target_amount: stockbase.getAttr('funding_target_amount'),
                        funding_done_amount: stockbase.getAttr('funding_done_amount'),
                        provider: stockbase.getAttr('provider'),
                        history_text: stockbase.getAttr('history_text'),
                        now_sale: stockbase.getAttr('now_sale'),
                    },

                };
            }
            else {
                return { code: -2, msg: "该stockbase不存在" };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "stockbase.Retrieve方法出错" };
        }

    }

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
        if (!!objData.cp_text) {
            paramArray.push(['cp_text', objData.cp_text]);
        }
        if (!!objData.audit_state_id) {
            paramArray.push(['audit_state_id', objData.audit_state_id]);
        }

        //得到 Mapping 对象
        let muster = this.core.GetMapping(TableType.StockBase)
            .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
            .where(paramArray)
            .orderby('id', 'desc') //根据id字段倒叙排列
            .paginate(10, currentPage);

        let $data = { items: {}, list: [], pagination: {} };
        //扩展分页器对象
        $data.pagination = { "total": muster.pageNum * 10, "pageSize": 10, "current": muster.pageCur };
        $data.total = muster.pageNum;
        $data.page = muster.pageCur;

        let $idx = (muster.pageCur - 1) * muster.pageSize;
        for (let $value of muster.records(TableField.StockBase)) {
            $data.items[$idx] = $value;
            $value['rank'] = $idx++;
        }

        //转化并设置数组属性
        $data.list = Object.keys($data.items).map(key => $data.items[key]);

        return {code: 0, data: $data};
    }
}

exports = module.exports = stockbase;
