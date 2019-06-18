let facade = require('gamecloud')
let { ReturnCode, NotifyType } = facade.const
let tableType = require('../../util/tabletype');

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class cp extends facade.Control {
    /**
     * 删除记录
     * @param {*} user 
     * @param {*} objData 
     */
    DeleteRecord(user, objData) {
        try {
            this.core.GetMapping(tableType.cp).Delete(objData.id, true);
            return { code: ReturnCode.Success, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cp.DeleteRecord方法出错" };
        }
    }
    /**
     * 修改数据库记录
     * @param {*} user 
     * @param {*} objData 
     */
    UpdateRecord(user, objData) {
        try {
            let cp = this.core.GetObject(tableType.cp, objData.id);
            if (!!cp) {
                //需要针对各个属性增加为null的判断；如果为null的情况下，则
                cp.setAttr('cp_id', objData.cp_id);
                cp.setAttr('cp_name', objData.cp_name);
                cp.setAttr('cp_text', objData.cp_text);
                cp.setAttr('cp_url', objData.cp_url);
                cp.setAttr('wallet_addr', objData.wallet_addr);
                cp.setAttr('cp_type', objData.cp_type);
                cp.setAttr('develop_name', objData.develop_name);
                cp.setAttr('cp_desc', objData.cp_desc);
                cp.setAttr('cp_version', objData.cp_version);
                cp.setAttr('cp_version', objData.cp_version);
                cp.setAttr('cp_state', objData.cp_state);
                cp.setAttr('publish_time', objData.publish_time);
                cp.setAttr('update_time', objData.update_time);
                cp.setAttr('update_content', objData.update_content);
                cp.setAttr('invite_share',objData.invite_share);
                cp.setAttr('operator_id',objData.operator_id);
                return { code: ReturnCode.Success };
            }
            return { code: -2, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cp.UpdateRecord方法出错" };
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
            let cp = await this.core.GetMapping(tableType.cp).Create(
                objData.cp_id,
                objData.cp_name,
                objData.cp_text,
                objData.cp_url,
                objData.wallet_addr,
                objData.cp_type,
                objData.develop_name,
                objData.cp_desc,
                objData.cp_version,
                objData.picture_url,
                objData.cp_state,
                objData.publish_time,
                objData.update_time,
                objData.update_content,
                objData.invite_share,
                objData.operator_id,
            );
            let ret = { code: ReturnCode.Success, data: null, message: "创建CP成功" };
            console.log(ret);
            return ret;
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cp.CreateRecord方法出错" };
        }

    }
    /**
     * 页面入口
     * CP注册指令：cp.create "name" "url" ["addr", "cls" ,"grate媒体分成比例0-30" ,"ip"]
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Create(user, paramGold) {
        try {
            console.log("cp.Create参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.id).execute('cp.create', paramArray);
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cp.Create方法出错" };
        }

    }

    /**
     * CP修改/转让指令： cp.change "name" ["url" "ip" "addr"]
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Change(user, paramGold) {
        try {
            console.log("cp.Change参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.id).execute('cp.change', paramArray);
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cp.Change方法出错" };
        }

    }

    /**
     * 根据ID查询CP注册信息 cid CP编码
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async ById(user, paramGold) {
        try {
            console.log("cp.ById参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.id).execute('cp.byId', paramArray);
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cp.ById方法出错" };
        }

    }

    /**
     * 根据名称查询CP注册信息 name CP名称
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async ByName(user, paramGold) {
        try {
            console.log("cp.ByName参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.id).execute('cp.byName', paramArray);
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cp.ByName方法出错" };
        }

    }

    /**
     * 查看单个记录
     * @param {*} user 
     * @param {*} objData 
     */
    Retrieve(user, objData) {
        try {
            let cp = this.core.GetObject(tableType.cp, parseInt(objData.id));
            if (!!cp) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        id: parseInt(objData.id),
                        cp_id: cp.getAttr('cp_id'),
                        cp_name: cp.getAttr('cp_name'),
                        cp_text: cp.getAttr('cp_text'),
                        cp_url: cp.getAttr('cp_url'),
                        wallet_addr: cp.getAttr('wallet_addr'),
                        cp_type: cp.getAttr('cp_type'),
                        develop_name: cp.getAttr('develop_name'),
                        cp_desc: cp.getAttr('cp_desc'),
                        cp_version: cp.getAttr('cp_version'),
                        picture_url: cp.getAttr('picture_url'),
                        cp_state: cp.getAttr('cp_state'),
                        publish_time: cp.getAttr('publish_time'),
                        update_time: cp.getAttr('update_time'),
                        update_content: cp.getAttr('update_content'),
                        invite_share: cp.getAttr('invite_share'),
                        operator_id: cp.getAttr('operator_id'),
                    },

                };
            }
            else {
                return { code: -2, data: null, message: "该CP不存在" };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cp.Retrieve方法出错" };
        }

    }

    /**
     * 查询系统中现有的所有CP列表：cp.list
     * 20181128:此方法暂不使用。
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async List(user, paramGold) {
        try {
            console.log("cp.list参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.id).execute('cp.list', paramArray);
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cp.List方法出错" };
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
            //cp_text=3&cp_id=23&cp_type=1&cp_state=2
            let paramArray = new Array();
            if (typeof (objData.cp_text) != "undefined" && (objData.cp_text != "")) {
                console.log(`cp_text 参数: ${objData.cp_text}`);
                let tmp = ['cp_text', '==', objData.cp_text];
                paramArray.push(tmp);
            }
            if (typeof (objData.cp_id) != "undefined" && (objData.cp_id != "")) {
                console.log(`cp_id 参数: ${objData.cp_id}`);
                let tmp = ['cp_id', '==', objData.cp_id];
                paramArray.push(tmp);
            }
            if (typeof (objData.cp_type) != "undefined" && (objData.cp_type != "")) {
                console.log(`cp_type 参数: ${objData.cp_type}`);
                let tmp = ['cp_type', '==', objData.cp_type];
                paramArray.push(tmp);
            }
            if (typeof (objData.cp_state) != "undefined" && (objData.cp_state != "")) {
                console.log(`cp_state 参数: ${objData.cp_state}`);
                let tmp = ['cp_state', '==', objData.cp_state];
                paramArray.push(tmp);
            }

            //得到 Mapping 对象
            let muster = this.core.GetMapping(tableType.cp)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .where(paramArray)
                .orderby('id', 'desc') //根据id字段倒叙排列
                .paginate(10, currentPage, ['id', 'cp_id', 'cp_text', 'cp_type', 'cp_state', 'publish_time', 'operator_id']); //每页5条，显示第${objData.id}页，只选取'id'和'item'字段

            let $data = { items: {}, list: [], pagination: {} };
            //扩展分页器对象
            $data.pagination = { "total": muster.pageNum * 10, "pageSize": 10, "current": muster.pageCur };
            $data.total = muster.pageNum;
            $data.page = muster.pageCur;

            let $idx = (muster.pageCur - 1) * muster.pageSize;
            for (let $value of muster.records()) {
                $data.items[$idx] = { id: $value['id'], cp_id: $value['cp_id'], cp_text: $value['cp_text'], cp_type: $value['cp_type'], cp_state: $value['cp_state'], publish_time: $value['publish_time'],operator_id:$value['operator_id'], rank: $idx };
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
     * 从数据库中获取CpType
     * 客户端直接调用此方法
     * @param {*} user 
     * @param {*} objData 无需参数。
     */
    ListCpType(user, objData) {
        try {
            //得到 Mapping 对象
            let muster = this.core.GetMapping(tableType.cpType)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .orderby('id', 'asc') //根据id字段倒叙排列
                .paginate(10, 1, ['id', 'cp_type_id', 'cp_type_name']); 

            let $data=[];
            for (let $value of muster.records()) {
                let item = { id: $value['id'], cp_type_id: $value['cp_type_id'], cp_type_name: $value['cp_type_name']};
                $data.push(item);
            }
            return $data;

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * 从外部获取URL
     * 传入的参数是cp_url，就是真实的URL路径
     */
    async getGameFromUrl(user, objData) {
        let fetch = require("node-fetch");
        let res = await fetch(objData.cp_url, { mode: 'no-cors' });
        let json = await res.json();//fetch正常返回后才执行
        return json;//这样就能返回res不用担心异步的问题啦啦啦
    }
}

exports = module.exports = cp;
