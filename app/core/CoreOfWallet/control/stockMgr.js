let facade = require('gamecloud')
let {EntityType, TableField, IndexType} = facade.const;

/**
 * 游戏的控制器
 * Updated on 2018-11-19.
 */
class stockMgr extends facade.Control {
    /**
     * 向目标地址赠送凭证
     * @param {*} user      当前操作员，注意如果是系统管理员，要将账户切换为'game'
     * @param {*} objData 
     */
    async sendStock(user, objData) {
        let ret = await this.core.service.gamegoldHelper.execute('stock.send', [
            objData.params.cid, 
            objData.params.num, 
            objData.params.address, 
            user.account, 
            objData.params.srcAddr,
        ]);

        return {code: ret.code};
    }

    /**
     * 列表我的凭证，或者列表我的挂单
     * @param {*} user
     * @param {*} objData 
     */
    async MyStock(user, objData) {
        let conditions = [
            ['page', objData.page],
            ['size', 10],
            ['account', user.account],
        ];

        let ret = await this.core.service.gamegoldHelper.execute('stock.list.wallet', [conditions]);
        if(ret.code == 0) {
            let $data = { list: [] };
            for(let item of ret.result.list) {
                let cpObj = this.core.GetObject(EntityType.blockgame, item.cid, IndexType.Domain);
                if(!!cpObj) { 
                    $data.list.push({
                        src: cpObj.orm.game_ico_uri,
                        title: cpObj.orm.game_title,
                        cid: item.cid,
                        addr: item.addr,
                        sum: item.sum,
                        price: item.price,
                        sell_price: item.stock.price,
                        sell_sum: item.stock.sum,
                        period: item.stock.period,
                    });
                }
            }
            //弥补下协议上的差异
            $data.total = ret.result.page;
            $data.page = ret.result.cur;
            //添加当前主网高度，作为时间基点使用
            $data.height = this.core.chain.height; 

            return {code: 0, data:$data}
        } else {
            return {code: ret.code, data: null};
        }
    }

    /**
     * 我拍卖凭证
     * @param {*} user
     * @param {*} objData 
     */
    async bidStock(user, objData) {
        let ret = await this.core.service.gamegoldHelper.execute('stock.bid', [
            objData.params.cid, 
            objData.params.num, 
            objData.params.price, 
            user.account, 
            objData.params.addr, //主网有校验 addr 是否归属 user.account
        ]);

        return {code: ret.code};
    }

    /**
     * 我竞买凭证
     * @param {*} user
     * @param {*} objData 
     */
    async auctionStock(user, objData) {
        let ret = await this.core.service.gamegoldHelper.execute('stock.auction', [
            objData.params.cid, 
            objData.params.addr, 
            objData.params.num, 
            objData.params.price,
            user.account,
        ]);

        return {code: ret.code, msg: !!ret.error ? ret.error.message : ''};
    }

    /**
     * 查询二级凭证列表
     * @param {*} user
     * @param {*} objData 
     */
    async BidList(user, objData) {
        let ret = await this.core.service.gamegoldHelper.execute('stock.bid.list', [
            [
                ['page', objData.currentPage],
                ['size', objData.pageSize],
            ]
        ]);

        if(ret.code == 0) {
            let $data = { list: [] };
            for(let item of ret.result.list) {
                let cpObj = this.core.GetObject(EntityType.blockgame, item.cid, IndexType.Domain);
                if(!!cpObj) { 
                    $data.list.push({
                        provider: cpObj.orm.developer,
                        icon_url: cpObj.orm.game_ico_uri,
                        cp_text: cpObj.orm.game_desc,
                        cid: item.cid,
                        addr: item.addr,
                        sum: item.sum,
                        price: item.price,
                        sell_price: item.stock.price,
                        sell_sum: item.stock.sum,
                        period: item.stock.period,
                    });
                }
            }
            //弥补下协议上的差异
            $data.total = ret.result.page;
            $data.page = ret.result.cur;

            return {code: 0, data:$data}
        } else {
            return {code: ret.code, data: null};
        }
    }

    /**
     * 查询一级凭证列表，即众筹列表
     * @param {*} user 
     * @param {*} objData 查询及翻页参数
     */
    getCrowdList(user, objData) {
        objData = objData || {};
        objData.currentPage = objData.currentPage || 1;

        let muster = this.core.GetMapping(EntityType.StockBase)
            .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
            .where([['orm.height', '>', this.core.chain.height - 144*14]]) // 判断有效期
            .orderby('id', 'desc') //根据id字段倒叙排列
            .paginate(10, objData.currentPage);

        let list = [];
        let $idx = (muster.pageCur - 1) * muster.pageSize;
        for (let $value of muster.records(TableField.StockBase)) {
            $value['rank'] = $idx++;
            //查询CP基本信息，补充显示内容
            let cpObj = this.core.GetObject(EntityType.blockgame, $value.cid, IndexType.Domain);
            if(!!cpObj) { 
                $value.cp_name = cpObj.orm.cp_name;
                $value.large_img_url = cpObj.orm.game_resource_uri;
                $value.small_img_url = cpObj.orm.small_img_url;
                $value.icon_url = cpObj.orm.game_ico_uri;
                $value.pic_urls = JSON.stringify(cpObj.orm.game_screenshots.split(','));
                $value.cp_desc = cpObj.orm.game_desc;
                $value.provider = cpObj.orm.developer;
                $value.funding_residue_day = Math.max(0, parseFloat((14*24*6 - Math.max(0, this.core.chain.height - $value.height))/144).toFixed(2));
            }

            list.push($value);
        }

        return {code: 0, data: {
            total: muster.pageNum,
            page: muster.pageCur,
            list: list}
        };
    }

    /**
     * 查询指定CP、指定地址上的交易记录 - 可以统计当前地址上的凭证买入、卖出、累计分成信息
     * @param {*} user 
     * @param {*} params 
     */
    async UserStockLogs(user, params) {
        let ret = await this.core.service.gamegoldHelper.execute('stock.record.wallet', [0, params.cid, 0, [['addr', params.addr]]]);
        if(ret.code == 0) {
            //弥补下协议上的差异
            ret.result.total = ret.result.page;
            ret.result.page = ret.result.cur;
            //添加当前主网高度，作为时间基点使用
            ret.result.height = this.core.chain.height; 

            return {
                code: ret.code,
                data: ret.result,
            };
        } else {
            return {
                code: ret.code,
            };
        }
    }    
}

exports = module.exports = stockMgr;
