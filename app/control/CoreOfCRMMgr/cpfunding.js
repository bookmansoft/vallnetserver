let facade = require('gamecloud')
let { IndexType, EntityType, ReturnCode, NotifyType, TableType, TableField } = facade.const
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息

/**
 * 游戏的控制器
 * Updated on 2018-11-19.
 */
class cpfunding extends facade.Control {
    /**
     * 增加数据库记录。此方法被从页面入口的Create方法所调用
     * 众筹申请写数据库的部分
     * @param {*} user 
     * @param {*} objData 
     */
    async CreateRecord(user, objData) {
        //1. 首先检验该操作员是否有权发布该众筹
        let cp = this.core.GetObject(TableType.Cp, objData.cid, IndexType.Foreign);
        if(!cp) {
            return { code: -1, msg: "指定CP不存在" };
        } else if(cp.getAttr('operator_id') != user.id) {
            return { code: -1, msg: "不具备指定CP操作权" };
        }

        //2. 检查操作员余额
        if(user.baseMgr.info.getAttr('balance')/100000 < (parseInt(objData.stock_num) * parseInt(objData.stock_amount)*1.02)) {
            return { code: -1, msg: "不具备足够的发行资金" };
        }

        //3. 其次检验当前情况下，是否允许为指定CP发布众筹，例如发行周期等
        //todo ...

        //4. 提交众筹申请，等待管理员审批
        await this.core.GetMapping(TableType.CpFunding).Create(
            objData.stock_num,
            objData.stock_num * objData.stock_amount,
            objData.stock_amount,
            objData.stock_rmb,
            objData.audit_state_id,
            objData.audit_text,
            new Date().getTime() / 1000,
            cp.getAttr('cp_name'),
            cp.getAttr('cp_text'),
            cp.getAttr('cp_type'),
            cp.getAttr('cp_url'),
            cp.getAttr('develop_name'),
            objData.develop_text,
            user.id,                    //发起者编号
            cp.getAttr('cp_id'),        //发起众筹的游戏编码
        );

        return { code: ReturnCode.Success, msg: "cpfunding.CreateRecord成功" };
    }

    /**
     * 审核众筹
     * @param {*} user 
     * @param {*} objData 
     */
    async UpdateRecord(user, objData) {
        if(user.cid == remoteSetup.cid) { //只能超级管理员执行
            let cpfunding = this.core.GetObject(TableType.CpFunding, parseInt(objData.id));
            if (!!cpfunding) {
                //获取发行众筹的发起者
                let operator = this.core.GetObject(EntityType.User, cpfunding.getAttr('user_id'));
                if(!!operator) {
                    //以发起者身份，向主链广播众筹报文
                    let ret = await this.core.service.RemoteNode.conn(operator.cid).execute('stock.offer', [
                        cpfunding.getAttr('cid'),              //CP编码
                        cpfunding.getAttr('stock_num'),        //发行总量
                        cpfunding.getAttr('stock_amount'),     //发行单价
                    ]);

                    if(ret.code == 0) {
                        //广播成功，更新本地数据库
                        cpfunding.setAttr('stock_rmb', objData.stock_rmb);
                        cpfunding.setAttr('audit_state_id', objData.audit_state_id);
                        cpfunding.setAttr('audit_text', objData.audit_text);
                        cpfunding.setAttr('modify_date', new Date().getTime() / 1000);
                        cpfunding.setAttr('operator_id', user.id);
                    }

                    return { code: ret.code, data: ret.result };
                }
            }
        }

        return { code: -2, msg:"找不到记录" };
    }

    /**
     * 此方法暂时给众筹详情页的列表使用
     * @param {*} user 
     * @param {*} paramGold cid 唯一参数
     */
    async StockRecord(user, paramGold) {
        try {
            console.log("cpfunding.StockRecord参数串：");
            let paramArray = paramGold.items;
            if (typeof paramArray == "string") {
                paramArray = JSON.parse(paramArray);
            }
            console.log("paramArray:",paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.cid).execute('stock.record', paramArray);
            if(!!ret.result) {
                //添加客户端所需要的字段，以正确渲染表格内容
                ret.result.pagination = { current: ret.result.cur, pageSize: ret.result.countCur };
            }

            return { 
                code: ret.code, 
                data: ret.result,
            };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "cpfunding.StockRecord方法出错" };
        }
    }

    /**
     * 查看单个记录
     * @param {*} user 
     * @param {*} objData 
     */
    async Retrieve(user, objData) {
        try {
            let cpfunding = this.core.GetObject(TableType.CpFunding, parseInt(objData.id));
            if (!!cpfunding) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        id: parseInt(objData.id),
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
                return { code: -2, msg: "该cpfunding不存在" };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "cpfunding.Retrieve方法出错" };
        }
    }

    /**
     * 查询一级市场待售列表
     * @param {*} user 
     * @param {*} objData 
     */
    async StockList(user, objData) {
        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('stock.offer.list', [
            [
                ['page', objData.currentPage],
                ['size', objData.pageSize],
            ]
        ]);

        if(ret.code == 0) {
            let $data = { list: [] };
            $data.pagination = { "total": ret.result.count, "pageSize": ret.result.countCur, "current": ret.result.cur };
            $data.total = ret.result.page;
            $data.page = ret.result.cur;

            for(let it of ret.result.list) {
                let stock = {
                    cpid: it.cid,
                    cpname: it.name,
                    hisSum: it.stock.hSum,
                    sum: it.stock.sum,
                    hisPrice: it.stock.hPrice,
                    price: it.stock.price,
                    audit_state_id: 2,
                    sell_limit_date: Date.now()/1000 - (this.core.chain.height - it.stock.height)*600 + 3600*24*14,
                };
                $data.list.push(stock);
            }
    
            return {code: 0, data:$data}
        } else {
            return {code: ret.code, data: null};
        }

        /** {
            "cid": "b47f1ab0-a246-11e9-9e6c-493029995e58",
            "name": "cp010061",
            "url": "http://localhost:9701/mock",
            "ip": "",
            "cls": "SHT",
            "grate": 15,
            "current": {
                "hash": "8db3c4a0baabf3577765f9dccf425dc2ccc2f87d468e94088edcc9ec00f7e0d0",
                "index": 0,
                "address": "tb1qwlm83tk3cd6wmcf34x43unewkhp9scu6x9x3l7"
            },
            "stock": {
                "hHeight": 191,
                "hSum": 0,
                "hPrice": 0,
                "hBonus": 0,
                "hAds": 0,
                "sum": 10000,
                "price": 1000000,
                "height": 191
            },
            "height": 191,
            "status": 0
        }*/
    }

    /**
     * 通过一级市场购买凭证
     * @param {*} user 
     * @param {*} objData 
     */
    async StockPurchase(user, objData) {
        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('stock.purchase', [objData.cid, objData.num]);
        if(ret.code == 0) {
            return {code: 0}
        } else {
            return {code: ret.code, data: null};
        }
    }

    /**
     * 从数据库中获取列表
     * 客户端直接调用此方法
     * @param {*} user 
     * @param {*} objData 查询及翻页参数，等整体调通以后再细化。
     */
    ListRecord(user, objData) {
        if (objData == null) {
            objData = {};
        }
        let currentPage = objData.currentPage;
        if (Number.isNaN(parseInt(currentPage))) {
            currentPage = 1;
        }

        //构造查询条件
        let paramArray = [];
        if (!!objData.cp_text) {
            paramArray.push(['cp_text', objData.cp_text]);
        }
        if (!!objData.audit_state_id) {
            paramArray.push(['audit_state_id', objData.audit_state_id]);
        }

        //得到 Mapping 对象
        let muster = this.core.GetMapping(TableType.CpFunding)
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
        for (let $value of muster.records(TableField.CpFunding)) {
            $data.items[$idx] = $value;
            $value['sell_limit_date'] = $value['modify_date'] + 3600*24*14;
            $value['rank'] = $idx++;
        }

        //转化并设置数组属性
        $data.list = Object.keys($data.items).map(key => $data.items[key]);

        return $data;
    }

    /**
     * 从数据库中获取Cp。用于在客户端显示所有数据库中的cp用于查询
     * 客户端直接调用此方法
     * @param {*} user 
     * @param {*} objData
     */
    ListCp(user, objData) {
        try {
            //查询当前操作员名下注册的CP列表
            let muster = this.core.GetMapping(TableType.Cp)
                .groupOf()                          // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .where([['operator_id', user.id]])  //只罗列当前操作员名下记录
                .orderby('id', 'asc')               //根据id字段倒叙排列
                .paginate(-1, 1);                   //在第一页罗列所有记录

            let $data=[];
            for (let $value of muster.records(TableField.Cp)) {
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
