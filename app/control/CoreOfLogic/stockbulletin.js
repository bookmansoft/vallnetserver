let facade = require('gamecloud')
let { ReturnCode, NotifyType, TableType } = facade.const

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class stockbulletin extends facade.Control {
    get router() {
        return [
            ['/stockbulletin/delete', 'delete'], //指定发放签名功能的路由、函数名
            ['/stockbulletin/update', 'update'],
            ['/stockbulletin/save', 'save'],
            ['/stockbulletin/get', 'get'],
            ['/stockbulletin/page','page'],
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
            this.core.GetMapping(TableType.StockBulletin).Delete(objData.id, true);
            return { code: ReturnCode.Success, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "stockbulletin.DeleteRecord方法出错" };
        }
    }
    /**
     * 修改数据库记录
     * @param {*} user 
     * @param {*} objData 
     */
    async UpdateRecord(user, objData) {
        try {
            console.log("46:更新数据",objData.id);
            let stockbulletin = this.core.GetObject(TableType.StockBulletin, parseInt(objData.id));
            if (!!stockbulletin) {
                stockbulletin.setAttr('cid', objData.cid);
                stockbulletin.setAttr('cp_name', objData.cp_name);
                stockbulletin.setAttr('cp_text', objData.cp_text);
                stockbulletin.setAttr('stock_day', objData.stock_day);
                stockbulletin.setAttr('stock_open', objData.stock_open);
                stockbulletin.setAttr('stock_close', objData.stock_close);
                stockbulletin.setAttr('stock_high', objData.stock_high);
                stockbulletin.setAttr('stock_low', objData.stock_low);
                stockbulletin.setAttr('total_num', objData.total_num);
                stockbulletin.setAttr('total_amount', objData.total_amount);

                stockbulletin.Save();
                return { code: ReturnCode.Success };
            }
            return { code: -2, data: null,message:"找不到记录" };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cp.UpdateRecord方法出错" };
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
            let stockbulletin = await this.core.GetMapping(TableType.StockBulletin).Create(
                objData.cid,
                objData.cp_name,
                objData.cp_text,
                objData.stock_day,
                objData.stock_open,
                objData.stock_close,
                objData.stock_high,
                objData.stock_low,
                objData.total_num,
                objData.total_amount,
            );
            let ret = { code: ReturnCode.Success, data: null, message: "stockbulletin.CreateRecord成功" };
            console.log(ret);
            return ret;
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "stockbulletin.CreateRecord方法出错" };
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
            let stockbulletin = this.core.GetObject(TableType.StockBulletin, parseInt(objData.id));
            if (!!stockbulletin) {

                return {
                    code: ReturnCode.Success,
                    data: {
                        id: parseInt(objData.id),
                        cid: stockbulletin.getAttr('cid'),
                        cp_name: stockbulletin.getAttr('cp_name'),
                        cp_text: stockbulletin.getAttr('cp_text'),
                        stock_day: stockbulletin.getAttr('stock_day'),
                        stock_open: stockbulletin.getAttr('stock_open'),
                        stock_close: stockbulletin.getAttr('stock_close'),
                        stock_high: stockbulletin.getAttr('stock_high'),
                        stock_low: stockbulletin.getAttr('stock_low'),
                        total_num: stockbulletin.getAttr('total_num'),
                        total_amount: stockbulletin.getAttr('total_amount'),
                    },

                };
            }
            else {
                return { code: -2, data: null, message: "该stockbulletin不存在" };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "stockbulletin.Retrieve方法出错" };
        }

    }

    /**
     * 从数据库中获取列表
     * 客户端直接调用此方法
     * @param {*} user 
     * @param {*} objData 查询及翻页参数，等整体调通以后再细化。
     */
    ListRecord(user, objData) {
        try {
            if (objData == null) {
                objData = {};
            }
            let currentPage = objData.currentPage;
            // console.log(Number.isNaN(parseInt(currentPage)));
            if (Number.isNaN(parseInt(currentPage))) {
                currentPage = 1;
            }
            //构造查询条件
            //stock_day=2019-05-07
            let paramArray = new Array();
            if (typeof (objData.stock_day) != "undefined" && (objData.stock_day != "undefined")  && (objData.stock_day != "")) {
                console.log(`stock_day 参数: ${objData.stock_day}`);
                let tmp = ['stock_day', '==', objData.stock_day];
                paramArray.push(tmp);
            }
            if (typeof (objData.cid) != "undefined" && (objData.cid != "undefined")  && (objData.cid != "")) {
                console.log(`cid 参数: ${objData.cid}`);
                let tmp = ['cid', '==', objData.cid];
                paramArray.push(tmp);
            }
            console.log('stockbulletin列表参数：',paramArray);
            //得到 Mapping 对象
            let muster = this.core.GetMapping(TableType.StockBulletin)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .where(paramArray)
                .orderby('id', 'desc') //根据id字段倒叙排列
                .paginate(10, currentPage);
// console.log(195,muster.pageNum);
            let $data = { items: {}, list: [], pagination: {} };
            //扩展分页器对象
            $data.pagination = { "total": muster.pageNum * 10, "pageSize": 10, "current": muster.pageCur };
            $data.total = muster.pageNum;
            $data.page = muster.pageCur;

            let $idx = (muster.pageCur - 1) * muster.pageSize;
            for (let $value of muster.records(['id', 'cid', 'cp_name', 'cp_text', 'stock_day', 'stock_open', 'stock_close', 'stock_high', 'stock_low', 'total_num', 'total_amount'])) {
                $data.items[$idx] = $value;
                $value['rank'] = $idx++;
            }

            //转化并设置数组属性
            $data.list = Object.keys($data.items).map(key => $data.items[key]);

            console.log($data.list);
            return $data;

        } catch (error) {
            console.log(error);
            return { items: {}, list: [], pagination: {} };
        }
    }



}

exports = module.exports = stockbulletin;
