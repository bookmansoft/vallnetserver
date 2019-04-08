let facade = require('gamecloud');
let { ReturnCode, NotifyType } = facade.const;
let tableType = require('../../util/tabletype');
const axios = require('axios');
const gamegoldHelp = require('../../util/gamegoldHelp');
const redisHelp = require('../../util/redisHelp');

/**
 * 游戏的控制器
 */
class manyreceive extends facade.Control {
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
            facade.GetMapping(tableType.manyReceive).Delete(objData.id, true);
            return { code: ReturnCode.Success, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manyreceive.DeleteRecord方法出错" };
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
            let manyreceive = facade.GetObject(tableType.manyReceive, parseInt(objData.id));
            if (!!manyreceive) {
                //需要针对各个属性增加为null的判断；如果为null的情况下，则
                manyreceive.setAttr('send_id', objData.send_id);
                manyreceive.setAttr('receive_amount', objData.receive_amount);
                manyreceive.setAttr('send_uid', parseInt(objData.send_uid));
                manyreceive.setAttr('send_nickname', parseInt(objData.send_nickname));
                manyreceive.setAttr('send_headimg', parseInt(objData.send_headimg));
                manyreceive.setAttr('receive_uid', parseInt(objData.receive_uid));
                manyreceive.setAttr('receive_nickname', objData.receive_nickname);
                manyreceive.setAttr('receive_headimg', objData.receive_headimg);
                manyreceive.setAttr('modify_date', parseInt(objData.modify_date));
                console.log("60 ok");
                manyreceive.Save();
                console.log("62 ok");
                return { code: ReturnCode.Success };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manyreceive.UpdateRecord方法出错" };
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

            let manyreceive = await facade.GetMapping(tableType.manyReceive).Create(
                objData.send_id,
                objData.receive_amount,
                objData.send_uid,
                objData.send_nickname,
                objData.send_headimg,
                objData.receive_uid,
                objData.receive_nickname,
                objData.receive_headimg,
                objData.modify_date,
            );
             console.log("执行创建成功了吗？");
            if (manyreceive == null) {
                return { code: -1, message: "违反唯一性约束" }
            }
            else {
                return { code: 0, data: null };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manyreceive.CreateRecord方法出错" };
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
            let manyreceive = facade.GetObject(tableType.manyReceive, parseInt(objData.id));
            console.log(manyreceive);
            if (!!manyreceive) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        send_id: manyreceive.getAttr('send_id'),
                        receive_amount: manyreceive.getAttr('receive_amount'),
                        send_uid: manyreceive.getAttr('send_uid'),
                        send_nickname: manyreceive.getAttr('send_nickname'),
                        send_headimg: manyreceive.getAttr('send_headimg'),
                        receive_uid: manyreceive.getAttr('receive_uid'),
                        receive_nickname: manyreceive.getAttr('receive_nickname'),
                        receive_headimg: manyreceive.getAttr('receive_headimg'),
                        modify_date: manyreceive.getAttr('modify_date'),
                    },

                };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manyreceive.Retrieve方法出错" };
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
            console.log("manyreceive.ListRecord:",objData);
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
            let muster = facade.GetMapping(tableType.manyReceive)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .where(paramArray)
                .orderby('id', 'desc') //根据id字段倒叙排列
                .paginate(10, currentPage, ['id', 'send_id', 'receive_amount', 'send_uid', 'send_nickname', 'send_headimg', 'receive_uid', 'receive_nickname', 'receive_headimg', 'modify_date']);

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
                    send_id: $value['send_id'],
                    receive_amount: $value['receive_amount'],
                    send_uid: $value['send_uid'],
                    send_nickname: $value['send_nickname'],
                    send_headimg: $value['send_headimg'],
                    receive_uid: $value['receive_uid'],
                    receive_nickname: $value['receive_nickname'],
                    receive_headimg: $value['receive_headimg'],
                    modify_date: $value['modify_date'],
                    rank: $idx
                };
                $idx++;
            }

            //转化并设置数组属性
            $data.list = Object.keys($data.items).map(key => $data.items[key]);
            console.log($data);
            return $data;
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manyreceive.ListRecord方法出错" };
        }

    }


}

exports = module.exports = manyreceive;
