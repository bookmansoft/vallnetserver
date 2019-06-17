let facade = require('gamecloud')
let { ReturnCode, NotifyType } = facade.const
const tableType = require('../../util/tabletype')

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class cpstock extends facade.Control {
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
            facade.GetMapping(tableType.CpStockEntity).Delete(objData.id, true);
            return { code: ReturnCode.Success, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cpstock.DeleteRecord方法出错" };
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
            let cpstock = facade.GetObject(tableType.CpStockEntity, parseInt(objData.id));
            if (!!cpstock) {
                cpstock.setAttr('cid', objData.cid);
                cpstock.setAttr('cp_name', objData.cp_name);
                cpstock.setAttr('cp_text', objData.cp_text);
                cpstock.setAttr('stock_day', objData.stock_day);
                cpstock.setAttr('stock_open', objData.stock_open);
                cpstock.setAttr('stock_close', objData.stock_close);
                cpstock.setAttr('stock_high', objData.stock_high);
                cpstock.setAttr('stock_low', objData.stock_low);
                cpstock.setAttr('total_num', objData.total_num);
                cpstock.setAttr('total_amount', objData.total_amount);

                cpstock.Save();
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
            let cpstock = await facade.GetMapping(tableType.CpStockEntity).Create(
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
            let ret = { code: ReturnCode.Success, data: null, message: "cpstock.CreateRecord成功" };
            console.log(ret);
            return ret;
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cpstock.CreateRecord方法出错" };
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
            let cpstock = facade.GetObject(tableType.CpStockEntity, parseInt(objData.id));
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
                return { code: -2, data: null, message: "该cpstock不存在" };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cpstock.Retrieve方法出错" };
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
            let muster = facade.GetMapping(tableType.CpStockEntity)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .where(paramArray)
                .orderby('id', 'desc') //根据id字段倒叙排列
                .paginate(10, currentPage, ['id', 'cid','cp_name','cp_text', 'stock_day', 'stock_open', 'stock_close', 'stock_high', 'stock_low',
                    'total_num', 'total_amount']);

            let $data = { items: {}, list: [], pagination: {} };
            //扩展分页器对象
            $data.pagination = { "total": muster.pageNum * 10, "pageSize": 10, "current": muster.pageCur };
            $data.total = muster.pageNum;
            $data.page = muster.pageCur;

            let $idx = (muster.pageCur - 1) * muster.pageSize;
            for (let $value of muster.records()) {
                $data.items[$idx] = { id: $value['id'], cid: $value['cid'], cp_name: $value['cp_name'], cp_text: $value['cp_text'],
                    stock_day: $value['stock_day'],
                    stock_open: $value['stock_open'], stock_close: $value['stock_close'], stock_high: $value['stock_high'],
                    stock_low: $value['stock_low'], total_num: $value['total_num'], 
                    total_amount: $value['total_amount'],
                    rank: $idx };
                $idx++;
            }

            //转化并设置数组属性
            $data.list = Object.keys($data.items).map(key => $data.items[key]);

            // let ret=$data.list;
            return $data;

        } catch (error) {
            console.log(error);
            return { items: {}, list: [], pagination: {} };
        }
    }



}

exports = module.exports = cpstock;
