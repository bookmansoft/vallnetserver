let facade = require('gamecloud')
let { ReturnCode, EntityType, NotifyType } = facade.const
let remoteSetup = facade.ini.servers["CoreOfIndex"][1].node; //全节点配置信息

/**
 * 游戏的控制器
 * Updated on 2018-11-19.
 */
class operator extends facade.Control {
    /**
     * 修改密码
     * @param {*} user 
     * @param {*} objData 
     */
    async ChangePassword(user, objData) {
        if (user.GetAttr('password') != objData.oldpassword) {
            return {code: -10, msg:"原密码错"};
        } else if(!objData.newpassword) {
            return {code: -10, msg:"新密码为空"};
        }

        user.SetAttr('password', objData.newpassword);
        user.Save();
        return {code: 0};
    }

    /**
     * 修改状态
     * @param {*} user 
     * @param {*} objData 传递进来的state就是目标状态；其他字段不变
     */
    async ChangeState(user, objData) {
        if(!Number.isInteger(objData.state)) {
            objData.state = parseInt(objData.state); 
        }
        if(objData.state != 1) { //限定取值范围为0/1
            objData.state = 0;
        }

        let operator = this.core.GetObject(EntityType.User, parseInt(objData.id));
        if (!!operator && operator.cid != remoteSetup.cid) { //不能禁止系统管理员
            operator.baseMgr.info.setAttr('state', objData.state);
        }

        return { code: 0, msg:"状态成功" };
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
                        cid: operator.cid,
                        state: operator.baseMgr.info.getAttr('state')|| 1,
                        remark: operator.baseMgr.info.getAttr('name'),
                    },

                };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "operator.Retrieve方法出错" };
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
            let paramArray = [];
            if(!!objData.login_name) {
                paramArray.push(['openid', objData.login_name]);
            }
            if(!!objData.state) {
                paramArray.push(['baseMgr.info.v.state', parseInt(objData.state||0)]);
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
                $data.items[$idx] = { 
                    id: $value.id, 
                    login_name: $value.openid, 
                    cid: $value.cid, 
                    balance: $value.baseMgr.info.getAttr('balance') || 0,
                    state: $value.baseMgr.info.getAttr('state') || 0, 
                    remark: $value.baseMgr.info.getAttr('name') || '', 
                    rank: $idx 
                };
                $idx++;
            }

            //转化并设置数组属性
            $data.list = Object.keys($data.items).map(key => $data.items[key]);

            return $data;
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "operator.ListRecord方法出错" };
        }
    }
}

exports = module.exports = operator;
