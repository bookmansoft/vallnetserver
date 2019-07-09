let facade = require('gamecloud')
let { ReturnCode, NotifyType, TableType } = facade.const

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2028-11-19.
 */
class prize extends facade.Control {
    /**
     * 删除记录
     * @param {*} user 
     * @param {*} objData 
     */
    DeleteRecord(user, objData) {
        try {
            this.core.GetMapping(TableType.Prize).Delete(objData.id, true);
            return { code: ReturnCode.Success, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "prize.DeleteRecord方法出错" };
        }

    }
    /**
     * 修改数据库记录
     * @param {*} user 
     * @param {*} objData 
     */
    UpdateRecord(user, objData) {
        try {
            let prize = this.core.GetObject(TableType.Prize, objData.id);
            if (!!prize) {
                //需要针对各个属性增加为null的判断；如果为null的情况下，则
                prize.setAttr('act_name', objData.act_name);
                prize.setAttr('mch_billno', objData.mch_billno);
                prize.setAttr('nick_name', objData.nick_name);
                prize.setAttr('re_openid', objData.re_openid);
                prize.setAttr('remark', objData.remark);
                prize.setAttr('send_name', objData.send_name);
                prize.setAttr('total_amount', objData.total_amount);
                prize.setAttr('total_num', objData.total_num);
                prize.setAttr('wishing', objData.wishing);
                prize.setAttr('return_msg', objData.return_msg);
                prize.setAttr('order_status', objData.order_status);
                return { code: ReturnCode.Success };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "prize.UpdateRecord方法出错" };
        }

    }
    /**
     * 增加数据库记录。
     * 此方法被从页面入口的Create方法所调用
     * @param {*} user 
     * @param {*} objData 
     */
    async CreateRecord(user, objData) {
        try {

            let prize = await this.core.GetMapping(TableType.Prize).Create(
                objData.act_name,
                objData.mch_billno,
                objData.nick_name,
                objData.re_openid,
                objData.remark,
                objData.send_name,
                objData.total_amount,
                objData.total_num,
                objData.wishing,
                objData.return_msg,
                objData.order_status,
            );
            // console.log("执行创建成功了吗？");
            if (prize == null) {
                return { code: -1, message: "违反唯一性约束" }
            }
            else {
                return { code: 0, data: null };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "prize.CreateRecord方法出错" };
        }
    }

    /**
     * 查看单个记录
     * @param {*} user 
     * @param {*} objData 
     */
    Retrieve(user, objData) {
        try {
            //根据上行id查找test表中记录, 注意在 get 方式时 id 不会自动由字符串转换为整型
            let prize = this.core.GetObject(TableType.Prize, parseInt(objData.id));
            console.log(prize);
            if (!!prize) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        act_name: prize.getAttr('act_name'),
                        mch_billno: prize.getAttr('mch_billno'),
                        nick_name: prize.getAttr('nick_name'),
                        re_openid: prize.getAttr('re_openid'),
                        remark: prize.getAttr('remark'),
                        send_name: prize.getAttr('send_name'),
                        total_amount: prize.getAttr('total_amount'),
                        total_num: prize.getAttr('total_num'),
                        wishing: prize.getAttr('wishing'),
                        return_msg: prize.getAttr('return_msg'),
                        order_status: prize.getAttr('order_status'),
                    },

                };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "prize.Retrieve方法出错" };
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
            console.log(Number.isNaN(parseInt(currentPage)));
            if (Number.isNaN(parseInt(currentPage))) {
                currentPage = 1;
            }

            //构造查询条件
            //id=3
            let paramArray = new Array();
            if (typeof (objData.id) != "undefined" && (objData.id != "")) {
                console.log(`id 参数: ${objData.id}`);
                let tmp = ['id', '==', objData.id];
                paramArray.push(tmp);
            }

            console.log(paramArray);
            //得到 Mapping 对象
            let muster = this.core.GetMapping(TableType.Prize)
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
            $idx = $idx + 5;
            for (let $value of muster.records(['id', 'act_name', 'mch_billno', 'nick_name', 're_openid', 'remark', 'send_name', 'total_amount', 'total_num', 'wishing', 'return_msg', 'order_status'])) {
                $data.items[$idx] = $value;
                $value['rank'] = $idx++;
            }

            //转化并设置数组属性
            $data.list = Object.keys($data.items).map(key => $data.items[key]);

            // let ret=$data.list;
            return $data;
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "prize.ListRecord方法出错" };
        }

    }


}

exports = module.exports = prize;
