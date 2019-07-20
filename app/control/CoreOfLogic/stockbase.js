let facade = require('gamecloud')
let { ReturnCode, TableType, TableField } = facade.const

/**
 * 游戏的控制器
 * Updated on 2018-11-19.
 */
class stockbase extends facade.Control {
    /**
     * 从数据库中获取列表
     * 客户端直接调用此方法
     * @param {*} user 
     * @param {*} objData 查询及翻页参数，等整体调通以后再细化。
     */
    ListRecord(user, objData) {
        objData = objData || {};
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
        let muster = this.core.GetMapping(TableType.StockBase)
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
        for (let $value of muster.records(TableField.StockBase)) {
            $data.items[$idx] = $value;
            $value['rank'] = $idx++;
        }

        //转化并设置数组属性
        $data.list = Object.keys($data.items).map(key => $data.items[key]);

        return {code: 0, data: $data};
    }
}

exports = module.exports = stockbase;
