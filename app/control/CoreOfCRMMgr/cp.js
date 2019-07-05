let facade = require('gamecloud')
let { ReturnCode, NotifyType } = facade.const
let tableType = require('../../util/tabletype');
let fetch = require("node-fetch");

/**
 * 游戏的控制器
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
                cp.setAttr('operator_id', user.id);
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
            if(typeof objData.picture_url == 'object') {
                objData.picture_url = JSON.stringify(objData.picture_url);
            }
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
            let paramArray = paramGold.items;
            if (typeof paramArray == "string") {
                paramArray = JSON.parse(paramArray);
            }
            let ret = await this.core.service.RemoteNode.conn(user.domainId).execute('cp.create', paramArray);
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
                paramArray = JSON.parse(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.domainId).execute('cp.change', paramArray);
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
                paramArray = JSON.parse(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.domainId).execute('cp.byId', paramArray);
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
                paramArray = JSON.parse(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.domainId).execute('cp.byName', paramArray);
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
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async List(user, paramGold) {
        try {
            console.log("cp.list参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = JSON.parse(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.domainId).execute('cp.list', paramArray);
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
        objData = objData ||{};

        //构造查询条件
        let paramArray = [];
        if (!!objData.cp_text) {
            paramArray.push(['cp_text', 'like', objData.cp_text]);
        }
        if (!!objData.cp_id) {
            paramArray.push(['cp_id', objData.cp_id]);
        }
        if (!!objData.cp_type) {
            paramArray.push(['cp_type', objData.cp_type]);
        }
        if (!!objData.cp_state) {
            paramArray.push(['cp_state', objData.cp_state]);
        }

        //得到 Mapping 对象
        let muster = this.core.GetMapping(tableType.cp)
            .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
            .where(paramArray)
            .orderby('id', 'desc') //根据id字段倒叙排列
            .paginate(10, objData.currentPage || 1); //每页10条，显示第 objData.currentPage 页

        let $data = { 
            items: {}, 
            list: [], 
            total: muster.pageNum,
            page: muster.pageCur,
            pagination: { "total": muster.pageNum * 10, "pageSize": 10, "current": muster.pageCur },
        };

        let $idx = (muster.pageCur - 1) * muster.pageSize;
        //@warning muster.records不带属性数组调用时，返回Entiry对象列表，访问内部属性时需要使用 .GetAttr(attrName) ，带属性数组调用时，返回属性映射对象列表，可以直接访问内部属性
        for (let $value of muster.records(['id', 'cp_id', 'cp_text', 'cp_type', 'cp_state', 'publish_time', 'operator_id'])) {
            $data.items[$idx] = $value;
            $value["rank"] = $idx++;
        }

        //转化并设置数组属性
        $data.list = Object.keys($data.items).map(key => $data.items[key]);

        return $data;
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
                .paginate(10, 1); 

            let $data=[];
            for (let $value of muster.records(['id', 'cp_type_id', 'cp_type_name'])) {
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
        let res = await fetch(objData.cp_url, { mode: 'no-cors' });
        return res.json();
    }
}

exports = module.exports = cp;
