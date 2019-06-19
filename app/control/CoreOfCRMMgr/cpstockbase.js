let facade = require('gamecloud')
let { ReturnCode, NotifyType } = facade.const
const tableType = require('../../util/tabletype')

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class cpstockbase extends facade.Control {
    /**
     * 删除记录
     * @param {*} user 
     * @param {*} objData 
     */
    async DeleteRecord(user, objData) {
        try {
            this.core.GetMapping(tableType.CpStockBaseEntity).Delete(objData.id, true);
            return { code: ReturnCode.Success, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cpstockbase.DeleteRecord方法出错" };
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
            let cpstockbase = this.core.GetObject(tableType.CpStockBaseEntity, parseInt(objData.id));
            if (!!cpstockbase) {
                //需要针对各个属性增加为null的判断；如果为null的情况下，则
                cpstockbase.setAttr('cpid', objData.cpid);
                cpstockbase.setAttr('cid', objData.cid);
                cpstockbase.setAttr('cp_name', objData.cp_name);
                cpstockbase.setAttr('cp_text', objData.cp_text);
                cpstockbase.setAttr('total_num', objData.total_num);
                cpstockbase.setAttr('sell_stock_amount', objData.sell_stock_amount);
                cpstockbase.setAttr('sell_stock_num', objData.sell_stock_num);
                cpstockbase.setAttr('base_amount', objData.base_amount);
                cpstockbase.setAttr('operator_id', user.id);
                cpstockbase.Save();

                return { code: ReturnCode.Success };
            }
            return { code: -2, data: null,message:"找不到记录" };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cpstockbase.UpdateRecord方法出错" };
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
            let cpstockbase = await this.core.GetMapping(tableType.CpStockBaseEntity).Create(
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
            let ret = { code: ReturnCode.Success, data: null, message: "cpstockbase.CreateRecord成功" };
            console.log(ret);
            return ret;
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cpstockbase.CreateRecord方法出错" };
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
            let cpstockbase = this.core.GetObject(tableType.CpStockBaseEntity, parseInt(objData.id));
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
            if (Number.isNaN(parseInt(currentPage))) {
                currentPage = 1;
            }
            //构造查询条件
            //cp_text=3&audit_state_id=2
            let paramArray = new Array();
            if (typeof (objData.cp_text) != "undefined" && (objData.cp_text != "undefined")  && (objData.cp_text != "")) {
                console.log(`cp_text 参数: ${objData.cp_text}`);
                let tmp = ['cp_text', '==', objData.cp_text];
                paramArray.push(tmp);
            }
            console.log(`audit_state_id 参数: ${objData.audit_state_id}`);
            if (typeof (objData.audit_state_id) != "undefined" && (objData.audit_state_id != "undefined") && (objData.audit_state_id != "")) {
                console.log(`audit_state_id 参数: ${objData.audit_state_id}`);
                let tmp = ['audit_state_id', '==', objData.audit_state_id];
                paramArray.push(tmp);
            }
            console.log('cpstockbase列表参数：',paramArray);

            //得到 Mapping 对象
            let muster = this.core.GetMapping(tableType.CpStockBaseEntity)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .where(paramArray)
                .orderby('id', 'desc') //根据id字段倒叙排列
                .paginate(10, currentPage, ['id','cid', 'cpid','cp_name','cp_text', 'total_num', 'sell_stock_amount', 'sell_stock_num', 'base_amount','operator_id']);

            let $data = { items: {}, list: [], pagination: {} };
            //扩展分页器对象
            $data.pagination = { "total": muster.pageNum * 10, "pageSize": 10, "current": muster.pageCur };
            $data.total = muster.pageNum;
            $data.page = muster.pageCur;

            let $idx = (muster.pageCur - 1) * muster.pageSize;
            for (let $value of muster.records()) {
                $data.items[$idx] = { id: $value['id'], cpid: $value['cpid'], cp_name:$value['cp_name'],cp_text:$value['cp_text'],
                    total_num: $value['total_num'],
                    sell_stock_amount: $value['sell_stock_amount'], sell_stock_num: $value['sell_stock_num'], base_amount: $value['base_amount'],operator_id:$value['operator_id'],
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

exports = module.exports = cpstockbase;
