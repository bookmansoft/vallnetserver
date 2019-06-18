let facade = require('gamecloud')
let { ReturnCode, NotifyType } = facade.const

let tableType = require('../../util/tabletype')

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class operator extends facade.Control {
    /**
     * 删除记录
     * @param {*} user 
     * @param {*} objData 
     */
    DeleteRecord(user, objData) {
        try {
            this.core.GetMapping(tableType.operator).Delete(objData.id, true);
            return { code: ReturnCode.Success, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "operator.DeleteRecord方法出错" };
        }

    }
    /**
     * 修改数据库记录
     * @param {*} user 
     * @param {*} objData 
     */
    UpdateRecord(user, objData) {
        try {
            let operator = this.core.GetObject(tableType.operator, objData.id);
            if (!!operator) {
                //需要针对各个属性增加为null的判断；如果为null的情况下，则
                operator.setAttr('login_name', objData.login_name);
                operator.setAttr('password', objData.password);
                operator.setAttr('cid', objData.cid);
                operator.setAttr('token', objData.token);
                operator.setAttr('state', objData.state);
                operator.setAttr('remark', objData.remark);
                return { code: ReturnCode.Success };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "operator.UpdateRecord方法出错" };
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
            let paramArray = new Array();
            paramArray.push(objData.login_name);
            console.log("创建操作员参数串：");
            console.log(paramArray);
            let retAuthOld = await this.core.service.RemoteNode.conn(user.id).execute('sys.createAuthToken', paramArray);
            console.log(retAuthOld);
            let retAuth=retAuthOld.result;

            if (retAuth == null) {
                return { code: -1 };
            }
            //协议曾经变动过，这里的特殊处理是兼容两种情况
            let cid = retAuth[0] == null ? retAuth.cid : retAuth[0].cid;
            let token = retAuth[0] == null ? retAuth.token : retAuth[0].token;

            let operator = await this.core.GetMapping(tableType.operator).Create(
                objData.login_name,
                objData.password,
                cid,
                token,
                1,
                objData.remark,
            );
            // console.log("执行创建成功了吗？");
            if (operator == null) {
                return { code: -1, message: "违反唯一性约束" }
            }
            else {
                return { code: 0, data: null };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "operator.CreateRecord方法出错" };
        }
    }

    /**
     * 修改密码
     * @param {*} user 
     * @param {*} objData 
     */
    async ChangePassword(user, objData) {
        try {
            console.log("创建操作员参数串：");
            console.log(objData.userinfo);//获取其id属性使用
            console.log(objData.oldpassword,objData.newpassword);
            //从userinfo中获取到可信的id
            let operator = this.core.GetObject(tableType.operator, parseInt(objData.userinfo.id));
            // console.log(operator);
            if (!!operator) {
                //记录有效
                if (operator.getAttr('password')!=objData.oldpassword) {
                    return {code: -10,data:null,message:"原密码错误"};
                }
                //原密码正确的情况下，执行更新操作
                console.log("开始更新密码……");
                operator.setAttr('password', objData.newpassword);
                console.log("已更新密码",operator.getAttr('password'));
                operator.Save();
                console.log("更新完成");
            }

            // console.log("执行创建成功了吗？");
            if (operator == null) {
                return { code: -1, message: "修改密码失败" }
            }
            else {
                return { code: 0, data: null,message:"密码更改成功" };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "operator.ChangePassword方法出错" };
        }
    }

    /**
     * 修改状态
     * @param {*} user 
     * @param {*} objData 传递进来的state就是目标状态；其他字段不变
     */
    async ChangeState(user, objData) {
        try {
            console.log("创建操作员参数串：");
            console.log(objData.userinfo);//获取其id属性使用
            //从userinfo中获取到可信的id
            let operator = this.core.GetObject(tableType.operator, parseInt(objData.id));
            if (!!operator) {
                //原密码正确的情况下，执行更新操作
                console.log("开始更新状态……");
                operator.setAttr('state', objData.state);
                console.log("已更新状态",operator.getAttr('state'));
                operator.Save();
                console.log("更新完成");
            }

            // console.log("执行创建成功了吗？");
            if (operator == null) {
                return { code: -1, message: "状态更改失败" }
            }
            else {
                return { code: 0, data: null,message:"状态成功" };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "operator.ChangeState方法出错" };
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
            let operator = this.core.GetObject(tableType.operator, parseInt(objData.id));
            //console.log(operator);
            if (!!operator) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        login_name: operator.getAttr('login_name'),
                        password: operator.getAttr('password'),
                        cid: operator.getAttr('cid'),
                        token: operator.getAttr('token'),
                        state: 1,
                        remark: operator.getAttr('remark'),
                    },

                };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "operator.Retrieve方法出错" };
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
            //console.log(Number.isNaN(parseInt(currentPage)));
            if (Number.isNaN(parseInt(currentPage))) {
                currentPage = 1;
            }

            //构造查询条件
            //login_name=3&state=1
            let paramArray = new Array();
            if (typeof (objData.login_name) != "undefined" && (objData.login_name != "")) {
                console.log(`login_name 参数: ${objData.login_name}`);
                let tmp = ['login_name', '==', objData.login_name];
                paramArray.push(tmp);
            }
            if (typeof (objData.state) != "undefined" && (objData.state != "")) {
                console.log(`state 参数: ${objData.state}`);
                let tmp = ['state', '==', objData.state];
                paramArray.push(tmp);
            }
            console.log(paramArray);
            //得到 Mapping 对象
            let muster = this.core.GetMapping(tableType.operator)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .where(paramArray)
                .orderby('id', 'desc') //根据id字段倒叙排列
                .paginate(10, currentPage, ['id', 'login_name', 'cid', 'state', 'remark']); //每页5条，显示第${objData.id}页，只选取'id'和'item'字段

            let $data = { items: {}, list: [], pagination: {} };
            //扩展分页器对象
            $data.pagination = { "total": muster.pageNum * 10, "pageSize": 10, "current": muster.pageCur };
            $data.total = muster.pageNum;
            $data.page = muster.pageCur;

            let $idx = (muster.pageCur - 1) * muster.pageSize;
            $idx = $idx + 5;
            for (let $value of muster.records()) {
                $data.items[$idx] = { id: $value['id'], login_name: $value['login_name'], cid: $value['cid'], state: $value['state'], remark: $value['remark'], rank: $idx };
                $idx++;
            }

            //转化并设置数组属性
            $data.list = Object.keys($data.items).map(key => $data.items[key]);

            // let ret=$data.list;
            return $data;
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "operator.ListRecord方法出错" };
        }

    }


}

exports = module.exports = operator;
