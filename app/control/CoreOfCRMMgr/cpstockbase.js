let facade = require('gamecloud')
let { ReturnCode, NotifyType, TableType } = facade.const
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class cpstockbase extends facade.Control {
    /**
     * 增加数据库记录。此方法被从页面入口的Create方法所调用
     * 众筹申请写数据库的部分
     * @param {*} user 
     * @param {*} objData 
     */
    async CreateRecord(user, objData) {
        await this.core.GetMapping(TableType.CpStockBase).Create(
            objData.cpid,
            objData.cid,
            objData.cp_name,
            objData.cp_text,
            objData.total_num,
            objData.sell_stock_amount,
            objData.sell_stock_num,
            objData.base_amount,
            user.id,
        );
        return { code: ReturnCode.Success, data: null, message: "cpstockbase.CreateRecord成功" };
    }

    async sendStock(user, objData) {
        let account = user.cid;
        if(account == remoteSetup.cid) {
            account = 'game';
        }

        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('stock.send', [
            objData.params.cid, objData.params.num, objData.params.address, null, objData.params.srcAddr,
        ]);

        return {code: ret.code}
    }

    async MyStock(user, objData) {
        let account = user.cid;
        if(account == remoteSetup.cid) {
            account = 'game';
        }

        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('stock.list.wallet', [
            [
                ['page', objData.currentPage],
                ['size', objData.pageSize],
                ['account', account],
            ]
        ]);

        if(ret.code == 0) {
            let $data = { list: [] };
            $data.pagination = { "total": ret.result.count, "pageSize": ret.result.countCur, "current": ret.result.cur };
            $data.total = ret.result.page;
            $data.page = ret.result.cur;
            for(let item of ret.result.list) {
                $data.list.push({
                    cid: item.cid,
                    addr: item.addr,
                    sum: item.sum,
                    price: item.price,
                    sell_price: item.stock.price,
                    sell_sum: item.stock.sum,
                });
            }

            return {code: 0, data:$data}
        } else {
            return {code: ret.code, data: null};
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
            let cpstockbase = this.core.GetObject(TableType.CpStockBase, parseInt(objData.id));
            if (!!cpstockbase) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        id: parseInt(objData.id),
                        cid: cpstockbase.getAttr("cid"),
                        cpid: cpstockbase.getAttr('cpid'),
                        cp_name: cpstockbase.getAttr('cp_name'),
                        cp_text: cpstockbase.getAttr('cp_text'),
                        total_num: cpstockbase.getAttr('total_num'),
                        sell_stock_amount: cpstockbase.getAttr('sell_stock_amount'),
                        sell_stock_num: cpstockbase.getAttr('sell_stock_num'),
                        base_amount: cpstockbase.getAttr('base_amount'),
                        operator_id: cpstockbase.getAttr('operator_id'),
                    },

                };
            }
            else {
                return { code: -2, data: null, message: "该cpstockbase不存在" };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cpstockbase.Retrieve方法出错" };
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
            objData = objData || {};

            let paramArray = [];
            if (!!objData.cp_text) {
                paramArray.push(['cp_text', objData.cp_text]);
            }
            if (!!objData.audit_state_id) {
                paramArray.push(['audit_state_id', objData.audit_state_id]);
            }

            let muster = this.core.GetMapping(TableType.CpStockBase)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .where(paramArray)
                .orderby('id', 'desc') //根据id字段倒叙排列
                .paginate(10, objData.currentPage || 1);

            let $data = { items: {}, list: [], pagination: {} };

            //扩展分页器对象, 这是为了给客户端做适配 todo: 建议移到客户端去做
            $data.pagination = { "total": muster.pageNum * 10, "pageSize": 10, "current": muster.pageCur };
            $data.total = muster.pageNum;
            $data.page = muster.pageCur;

            let $idx = (muster.pageCur - 1) * muster.pageSize;
            for (let $value of muster.records(['id', 'cpid', 'cp_name', 'cp_text', 'total_num', 'sell_stock_amount', 'sell_stock_num', 'base_amount', 'operator_id'])) {
                $data.items[$idx] = $value;
                $value['rank'] = $idx++;
            }

            //转化并设置数组属性
            $data.list = Object.keys($data.items).map(key => $data.items[key]);

            return $data;
        } catch (error) {
            console.log(error);
            return { items: {}, list: [], pagination: {} };
        }
    }
}

exports = module.exports = cpstockbase;
