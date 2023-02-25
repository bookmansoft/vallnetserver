let facade = require('gamecloud')
let { IndexType, EntityType, ReturnCode, NotifyType } = facade.const
let remoteSetup = facade.ini.servers["CoreOfIndex"][1].node; //全节点配置信息

/**
 * 收款地址的控制器
 * Updated on 2018-11-20.
 */
class address extends facade.Control {
    /**
     * 获取一个新的收款地址
     * @param {*} user 
     */
    async Receive(user, params) {
        //普通操作员的CID属性就是其钱包账户，如果是超级管理员需要进一步转换为 default 账户
        let account = user.cid;
        if(!account) {
            //同步完成事件的调用
            await this.core.notifyEvent('user.fetchCid', {user:user});
        }

        if(account == remoteSetup.cid) {
            if(!!params.account) {
                account = params.account;
            } else {
                account = 'default';
            }
        }

        let ret = await this.core.service.RemoteNode.conn(remoteSetup.cid).execute('address.create', [account]);
        return { code: ret.code, data: ret.result.address };
    }

    /**
     * 获取用户地址列表，地址过滤命令
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Filter(user, paramGold) {
        try {
            let paramArray = paramGold.items;
            if (typeof paramArray == "string") {
                paramArray = JSON.parse(paramArray);
            }
            let retOld = await this.core.service.RemoteNode.conn(user.cid).execute('address.filter', paramArray);
            let ret = retOld.result;

            let $data = { items: {}, list: [], pagination: {} };
            //扩展分页器对象
            $data.total = paramArray[3] * paramArray[4];
            $data.page = paramArray[3];
            $data.pagination = { "total": $data.total, "pageSize": paramArray[4], "current": $data.page };

            let $idx = ($data.page - 1) * 10;
            for (let $value of ret.list) {
                $data.items[$idx] = { addr: $value['addr'], sum: $value['sum'], rank: $idx };
                $idx++;
            }

            //转化并设置数组属性
            $data.list = Object.keys($data.items).map(key => $data.items[key]);

            return $data;
        }
        catch (ex) {
            console.log(ex);
            return { code: -1, msg: "address.Filter方法出错" };
        }
    }
}

exports = module.exports = address;
