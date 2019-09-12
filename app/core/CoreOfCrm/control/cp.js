let facade = require('gamecloud')
let { ReturnCode, EntityType, TableField } = facade.const
let fetch = require("node-fetch");
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息
let uuid = require('uuid');

/**
 * 游戏的控制器
 */
class cp extends facade.Control {
    /**
     * 获取CP类型列表
     * 客户端直接调用此方法
     * @param {*} user 
     * @param {*} objData 无需参数。
     */
    ListCpType(user, objData) {
        return this.core.fileMap['cptype'];
    }

    /**
     * 激活/禁用CP
     * @param {*} user 
     * @param {*} objData 
     */
    UpdateRecord(user, objData) {
        try {
            let cp = this.core.GetObject(EntityType.Cp, objData.cp_id);
            if(!cp || (user.id != cp.getAttr('operator_id') && user.cid != remoteSetup.cid)) {
                return { code: -2, data: null };
            }

            cp.setAttr('cp_state', objData.cp_st);

            this.core.remoteLogic('cpStatus', {cp_id: cp.getAttr('cp_id'), cp_st: objData.cp_st}, {stype:'Wallet', sid:0});

            return { code: ReturnCode.Success };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "cp.UpdateRecord 方法出错" };
        }
    }

    /**
     * 操作员发起CP注册请求
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Create(user, paramGold) {
        let paramArray = paramGold.items;
        if (typeof paramArray == "string") {
            paramArray = JSON.parse(paramArray);
        }

        //CP注册指令：cp.create "name" "url" ["addr", "cls" ,"grate 媒体分成比例" ,"ip"]
        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('cp.create', paramArray);
        if(!ret) {
            return {code: -1};
        } else if(!!ret && ret.code == 0) {
            return { code: 0, data: ret.result };
        } else {
            return { code: ret.code, data: ret.result, msg: ret.error.message };
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
            let ret = await this.core.service.RemoteNode.conn(user.cid).execute('cp.change', paramArray);
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "cp.Change方法出错" };
        }
    }

    /**
     * 生成模拟订单并支付
     * @param {*} user      当前操作员，注意如果是系统管理员，要将账户切换为'default'
     * @param {*} objData 
     */
    async payOrder(user, objData) {
        let account = user.cid;
        if(account == remoteSetup.cid) {
            account = 'default';
        }

        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('order.pay', [
            objData.params.cid, user.account, uuid.v1(), objData.params.amount, account,
        ]);

        return {code: ret.code}
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
            let ret = await this.core.service.RemoteNode.conn(user.cid).execute('cp.byName', paramArray);
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "cp.ByName方法出错" };
        }
    }

    /**
     * 查询并返回CP对象
     * @param {*} user 
     * @param {*} objData 
     */
    async Retrieve(user, objData) {
        let cp = this.core.GetObject(EntityType.Cp, parseInt(objData.id));
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
        } else {
            return { code: -2, msg: "指定CP不存在" };
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
            let ret = await this.core.service.RemoteNode.conn(user.cid).execute('cp.list', paramArray);
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "cp.List方法出错" };
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
        if(user.cid != remoteSetup.cid) {
            //普通操作员只能查看自己的游戏，超级管理员则可以查看所有游戏
            paramArray.push(['operator_id', user.id]);
        }

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
        let muster = this.core.GetMapping(EntityType.Cp)
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
        for (let $value of muster.records(TableField.Cp)) {
            $data.items[$idx] = $value;
            $value["rank"] = $idx++;
        }

        //转化并设置数组属性
        $data.list = Object.keys($data.items).map(key => $data.items[key]);

        return {code: 0, data: $data};
    }

    /**
     * 从外部获取URL
     * 传入的参数是cp_url，就是真实的URL路径
     */
    async getGameFromUrl(user, objData) {
        let res = await fetch(`${objData.cp_url}/info`, { mode: 'cors' });
        return await res.json();
    }
}

exports = module.exports = cp;
