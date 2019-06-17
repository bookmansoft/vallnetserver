let facade = require('gamecloud')
let { ReturnCode, NotifyType } = facade.const
let tableType = require('../../util/tabletype');

//引入自定义的远程节点类
let RemoteNode = require('./RemoteNode');

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class cpfunding extends facade.Control {
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
            facade.GetMapping(tableType.cpfunding).Delete(objData.id, true);
            return { code: ReturnCode.Success, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cpfunding.DeleteRecord方法出错" };
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
            let cpfunding = facade.GetObject(tableType.cpfunding, parseInt(objData.id));
            if (!!cpfunding) {
                console.log(49);
                //需要针对各个属性增加为null的判断；如果为null的情况下，则
                cpfunding.setAttr('cpid', objData.cpid);
                cpfunding.setAttr('stock_num', objData.stock_num);
                cpfunding.setAttr('total_amount', objData.total_amount);
                cpfunding.setAttr('stock_amount', objData.stock_amount);
                cpfunding.setAttr('stock_rmb', objData.stock_rmb);
                cpfunding.setAttr('audit_state_id', objData.audit_state_id);
                cpfunding.setAttr('audit_text', objData.audit_text);
                cpfunding.setAttr('modify_date', objData.modify_date);
                cpfunding.setAttr('cp_name', objData.cp_name);
                cpfunding.setAttr('cp_text', objData.cp_text);
                cpfunding.setAttr('cp_type', objData.cp_type);
                cpfunding.setAttr('cp_url', objData.cp_url);
                cpfunding.setAttr('develop_name', objData.develop_name);
                cpfunding.setAttr('develop_text', objData.develop_text);
                cpfunding.setAttr('user_id', objData.user_id);
                cpfunding.setAttr('cid', objData.cid);
                cpfunding.setAttr('operator_id',objData.operator_id);
                cpfunding.Save();
                return { code: ReturnCode.Success };
            }
            return { code: -2, data: null,message:"找不到记录" };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cp.UpdateRecord方法出错" };
        }
    }
    /**
     * 此方法暂时给众筹详情页的列表使用
     * @param {*} user 
     * @param {*} paramGold cid 唯一参数
     */
    async StockRecord(user, paramGold) {
        try {
            let remote = new RemoteNode().conn(paramGold.userinfo);
            console.log("cpfunding.StockRecord参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log("paramArray:",paramArray);
            let ret = await remote.execute('stock.record', paramArray);
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cpfunding.StockRecord方法出错" };
        }

    }

    /**
     * 众筹申请访问区块链的部分
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Create(user, paramGold) {
        try {
            let remote = new RemoteNode().conn(paramGold.userinfo);
            console.log("cpfunding.Create参数串：");
            let cid=paramGold.cid;
            let stock_num=parseInt(paramGold.stock_num);
            let stock_amount=parseInt(paramGold.stock_amount);
            let operator_id=parseInt(paramGold.operator_id);
            //获取operator
            let operator = facade.GetObject(tableType.operator, parseInt(operator_id));
            console.log("获得的操作员信息为: ",operator.getAttr('cid'));


            let paramArray = [cid,stock_num,stock_amount,operator.getAttr('cid')];
            console.log(paramArray);
            let ret = await remote.execute('stock.offer', paramArray);
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cpfunding.Create方法出错" };
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
           
            let cpfunding = await facade.GetMapping(tableType.cpfunding).Create(
                objData.cpid,
                objData.stock_num,
                objData.total_amount,
                objData.stock_amount,
                objData.stock_rmb,
                objData.audit_state_id,
                objData.audit_text,
                objData.modify_date,
                objData.cp_name,
                objData.cp_text,
                objData.cp_type,
                objData.cp_url,
                objData.develop_name,
                objData.develop_text,
                objData.userinfo.id,
                objData.cid,
                objData.operator_id,
            );
            let ret = { code: ReturnCode.Success, data: null, message: "cpfunding.CreateRecord成功" };
            console.log(ret);
            return ret;
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cpfunding.CreateRecord方法出错" };
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
            let cpfunding = facade.GetObject(tableType.cpfunding, parseInt(objData.id));
            if (!!cpfunding) {
                // console.log(162,"有数据啊");
                // console.log(cpfunding.getAttr('cpid'));
                return {
                    code: ReturnCode.Success,
                    data: {
                        id: parseInt(objData.id),
                        cpid: cpfunding.getAttr('cpid'),
                        stock_num: cpfunding.getAttr('stock_num'),
                        total_amount: cpfunding.getAttr('total_amount'),
                        stock_amount: cpfunding.getAttr('stock_amount'),
                        stock_rmb: cpfunding.getAttr('stock_rmb'),
                        audit_state_id: cpfunding.getAttr('audit_state_id'),
                        audit_text: cpfunding.getAttr('audit_text'),
                        modify_date: cpfunding.getAttr('modify_date'),
                        cp_name: cpfunding.getAttr('cp_name'),
                        cp_text: cpfunding.getAttr('cp_text'),
                        cp_type: cpfunding.getAttr('cp_type'),
                        cp_url: cpfunding.getAttr('cp_url'),
                        develop_name: cpfunding.getAttr('develop_name'),
                        develop_text: cpfunding.getAttr('develop_text'),
                        user_id: cpfunding.getAttr('user_id'),
                        cid: cpfunding.getAttr("cid"),
                        operator_id: cpfunding.getAttr("operator_id"),
                        sell_limit_date:cpfunding.getAttr('modify_date')+3600*24*14
                    },

                };
            }
            else {
                return { code: -2, data: null, message: "该cpfunding不存在" };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cpfunding.Retrieve方法出错" };
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
            console.log('cpfunding列表参数：',paramArray);

            //得到 Mapping 对象
            let muster = facade.GetMapping(tableType.cpfunding)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .where(paramArray)
                .orderby('id', 'desc') //根据id字段倒叙排列
                .paginate(10, currentPage, ['id', 'cpid', 'stock_num', 'total_amount', 'stock_amount', 'stock_rmb', 'audit_state_id', 'audit_text', 'modify_date',
                    'cp_name','cp_text','cp_type','cp_url','develop_name','develop_text','user_id','cid','operator_id']);

            let $data = { items: {}, list: [], pagination: {} };
            //扩展分页器对象
            $data.pagination = { "total": muster.pageNum * 10, "pageSize": 10, "current": muster.pageCur };
            $data.total = muster.pageNum;
            $data.page = muster.pageCur;

            let $idx = (muster.pageCur - 1) * muster.pageSize;
            for (let $value of muster.records()) {
                $data.items[$idx] = { id: $value['id'], cpid: $value['cpid'], stock_num: $value['stock_num'],
                    total_amount: $value['total_amount'], stock_amount: $value['stock_amount'], stock_rmb: $value['stock_rmb'],
                    audit_state_id: $value['audit_state_id'], audit_text: $value['audit_text'], 
                    modify_date: $value['modify_date'],
                    cp_name:$value['cp_name'],cp_text:$value['cp_text'],cp_type:$value['cp_type'],
                    cp_url:$value['cp_url'],develop_name:$value['develop_name'],
                    develop_text:$value['develop_text'],user_id:$value['user_id'],cid:$value['cid'],operator_id:$value['operator_id'],
                    sell_limit_date: $value['modify_date']+3600*24*14,//此字段计算获得
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


    /**
     * 从数据库中获取Cp。用于在客户端显示所有数据库中的cp用于查询
     * 客户端直接调用此方法
     * @param {*} user 
     * @param {*} objData 无需参数。
     */
    ListCp(user, objData) {
        try {
            //得到 Mapping 对象
            let muster = facade.GetMapping(tableType.cp)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .orderby('id', 'asc') //根据id字段倒叙排列
                .paginate(10, 1, ['id', 'cp_id', 'cp_text']); 

            let $data=[];
            for (let $value of muster.records()) {
                let item = { id: $value['id'], cp_id: $value['cp_id'], cp_text: $value['cp_text']};
                $data.push(item);
            }
            return $data;

        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

exports = module.exports = cpfunding;
