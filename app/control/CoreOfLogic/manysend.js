let facade = require('gamecloud');
let { ReturnCode, NotifyType } = facade.const;
let tableType = require('../../util/tabletype');
const axios = require('axios');
const gamegoldHelp = require('../../util/gamegoldHelp');
const redisHelp = require('../../util/redisHelp');

/**
 * 游戏的控制器
 */
class manysend extends facade.Control {
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
    DeleteRecord(user, objData) {
        try {
            facade.GetMapping(tableType.manySend).Delete(objData.id, true);
            return { code: ReturnCode.Success, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manysend.DeleteRecord方法出错" };
        }

    }
    /**
     * 修改数据库记录
     * @param {*} user 
     * @param {*} objData 
     */
    UpdateRecord(user, objData) {
        try {
            console.log(JSON.stringify(objData));
            console.log(objData.id);
            let manysend = facade.GetObject(tableType.manySend, parseInt(objData.id));
            if (!!manysend) {
                //需要针对各个属性增加为null的判断；如果为null的情况下，则
                manysend.setAttr('total_amount', objData.total_amount);
                manysend.setAttr('actual_amount', objData.actual_amount);
                manysend.setAttr('total_num', parseInt(objData.total_num));
                manysend.setAttr('send_uid', parseInt(objData.send_uid));
                manysend.setAttr('send_nickname', parseInt(objData.send_nickname));
                manysend.setAttr('send_headimg', parseInt(objData.send_headimg));
                manysend.setAttr('wishing', objData.wishing);
                manysend.setAttr('modify_date', parseInt(objData.modify_date));
                console.log("60 ok");
                manysend.Save();
                console.log("62 ok");
                return { code: ReturnCode.Success };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manysend.UpdateRecord方法出错" };
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

            let manysend = await facade.GetMapping(tableType.manySend).Create(
                objData.total_amount,
                objData.actual_amount,
                objData.total_num,
                objData.send_uid,
                objData.send_nickname,
                objData.send_headimg,
                objData.wishing,
                objData.modify_date,
            );
            // console.log("执行创建成功了吗？");
            if (manysend == null) {
                return { code: -1, message: "违反唯一性约束" }
            }
            else {
                return { code: 0, data: null };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manysend.CreateRecord方法出错" };
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
            let manysend = facade.GetObject(tableType.manySend, parseInt(objData.id));
            console.log(manysend);
            if (!!manysend) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        total_amount: manysend.getAttr('total_amount'),
                        actual_amount: manysend.getAttr('actual_amount'),
                        total_num: manysend.getAttr('total_num'),
                        send_uid: manysend.getAttr('send_uid'),
                        send_nickname: manysend.getAttr('send_nickname'),
                        send_headimg: manysend.getAttr('send_headimg'),
                        wishing: manysend.getAttr('wishing'),
                        modify_date: manysend.getAttr('modify_date'),
                    },

                };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manysend.Retrieve方法出错" };
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
            let muster = facade.GetMapping(tableType.manySend)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .where(paramArray)
                .orderby('id', 'desc') //根据id字段倒叙排列
                .paginate(10, currentPage, ['id', 'total_amount', 'actual_amount', 'total_num', 'send_uid', 'send_nickname', 'send_headimg', 'wishing', 'modify_date']);

            let $data = { items: {}, list: [], pagination: {} };
            //扩展分页器对象
            $data.pagination = { "total": muster.pageNum * 10, "pageSize": 10, "current": muster.pageCur };
            $data.total = muster.pageNum;
            $data.page = muster.pageCur;

            let $idx = (muster.pageCur - 1) * muster.pageSize;
            $idx = $idx + 5;
            for (let $value of muster.records()) {
                $data.items[$idx] = {
                    id: $value['id'],
                    total_amount: $value['total_amount'],
                    actual_amount: $value['actual_amount'],
                    total_num: $value['total_num'],
                    send_uid: $value['send_uid'],
                    send_nickname: $value['send_nickname'],
                    send_headimg: $value['send_headimg'],
                    wishing: $value['wishing'],
                    modify_date: $value['modify_date'],
                    rank: $idx
                };
                $idx++;
            }

            //转化并设置数组属性
            $data.list = Object.keys($data.items).map(key => $data.items[key]);

            return $data;
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manysend.ListRecord方法出错" };
        }

    }


}

exports = module.exports = manysend;
