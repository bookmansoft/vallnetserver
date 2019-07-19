let facade = require('gamecloud')
let { ReturnCode, NotifyType, TableType, TableField } = facade.const

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class cpstock extends facade.Control {
    /**
     * 查看单个记录
     * @param {*} user 
     * @param {*} objData 
     */
    async Retrieve(user, objData) {
        console.log(158,objData.id);
        try {
            let cpstock = this.core.GetObject(TableType.CpStock, parseInt(objData.id));
            if (!!cpstock) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        id: parseInt(objData.id),
                        cid: cpstock.getAttr('cid'),
                        cp_name: cpstock.getAttr('cp_name'),
                        cp_text: cpstock.getAttr('cp_text'),
                        stock_day: cpstock.getAttr('stock_day'),
                        stock_open: cpstock.getAttr('stock_open'),
                        stock_close: cpstock.getAttr('stock_close'),
                        stock_high: cpstock.getAttr('stock_high'),
                        stock_low: cpstock.getAttr('stock_low'),
                        total_num: cpstock.getAttr('total_num'),
                        total_amount: cpstock.getAttr('total_amount'),
                    },
                };
            }
            else {
                return { code: -2, msg: "该cpstock不存在" };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "cpstock.Retrieve方法出错" };
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
            console.log('cpstock列表参数：',paramArray);
            //得到 Mapping 对象
            let muster = this.core.GetMapping(TableType.CpStock)
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
            for (let $value of muster.records(TableField.CpStock)) {
                $data.items[$idx] = $value;
                $value['rank'] = $idx++;
            }

            //转化并设置数组属性
            $data.list = Object.keys($data.items).map(key => $data.items[key]);

            return $data;
        } catch (error) {
            console.log(error);
            return { items: {}, list: [], pagination: {} };
        }
    }
}

exports = module.exports = cpstock;
