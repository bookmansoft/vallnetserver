let facade = require('gamecloud')
let { ReturnCode, EntityType, NotifyType } = facade.const
let tableType = require('../../util/tabletype')

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class operator extends facade.Control {

    /**
     * 增加数据库记录。
     * 此方法被从页面入口的Create方法所调用
     * @param {*} user 
     * @param {*} objData 
     */
    async CreateRecord(user, objData) {
        let remote = this.core.service.RemoteNode.conn('admin');
        let retAuth = await remote.execute('sys.createAuthToken', [user.openid]);
        if (!retAuth) {
            return { code: -1 };
        }
        let cid = retAuth.result[0].cid;
        let {aeskey, aesiv} = remote.getAes();
        let token = remote.decrypt(aeskey, aesiv, retAuth.result[0].encry);

        let sim = await this.core.GetMapping(EntityType.User).Create(
            objData.login_name,
            objData.password,
            cid,
            token,
            1,
            objData.remark,
        );

        if (!sim) {
            return { code: -1, message: "违反唯一性约束" }
        }

        return { code: 0 };
    }

    /**
    /**
     * 修改密码
     * @param {*} user 
     * @param {*} objData 
     */
    async ChangePassword(user, objData) {
        console.log("创建操作员参数串：");
        if (user.baseMgr.info.getAttr('pwd') != objData.oldpassword) {
            return {code: -10, message:"原密码错误"};
        }
        user.baseMgr.info.setAttr('pwd', objData.newpassword);
        return {code: 0};
    }

    /**
     * 修改状态
     * @param {*} user 
     * @param {*} objData 传递进来的state就是目标状态；其他字段不变
     */
    async ChangeState(user, objData) {
        //todo 谁可以修改操作员的状态？是否需要超级管理员身份判断？
        let operator = this.core.GetObject(EntityType.User, parseInt(objData.id));
        if (!!operator) {
            operator.baseMgr.info.setAttr('state', objData.state);
        }

        return { code: 0, data: null,message:"状态成功" };
    }

    /**
     * 查看单个记录
     * @param {*} user 
     * @param {*} objData 
     */
    Retrieve(user, objData) {
        try {
            let operator = this.core.GetObject(EntityType.User, parseInt(objData.id));
            if (!!operator) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        login_name: operator.openid,
                        cid: operator.baseMgr.info.getAttr('cid'),
                        token: operator.baseMgr.info.getAttr('token'),
                        state: 1,
                        remark: operator.baseMgr.info.getAttr('remark'),
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
            if (Number.isNaN(parseInt(currentPage))) {
                currentPage = 1;
            }

            //构造查询条件
            let paramArray = [
                ['state', objData.state || 1],
            ];
            if(!!objData.login_name) {
                paramArray.push(['openid', objData.login_name]);
            }

            //得到 Mapping 对象
            let muster = this.core.GetMapping(EntityType.User)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .where(paramArray)
                .orderby('id', 'desc') //根据id字段倒叙排列
                .paginate(10, currentPage); //每页5条，显示第${objData.id}页

            let $data = { items: {}, list: [], pagination: {} };
            //扩展分页器对象
            $data.pagination = { "total": muster.pageNum * 10, "pageSize": 10, "current": muster.pageCur };
            $data.total = muster.pageNum;
            $data.page = muster.pageCur;

            let $idx = (muster.pageCur - 1) * muster.pageSize;
            $idx = $idx + 5;
            for (let $value of muster.records()) {
                $data.items[$idx] = { id: $value.id, login_name: $value.openid, cid: $value.baseMgr.info.getAttr('cid'), state: $value.baseMgr.info.getAttr('state'), remark: $value.baseMgr.info.getAttr('remark'), rank: $idx };
                $idx++;
            }

            //转化并设置数组属性
            $data.list = Object.keys($data.items).map(key => $data.items[key]);

            return $data;
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "operator.ListRecord方法出错" };
        }
    }
}

exports = module.exports = operator;
