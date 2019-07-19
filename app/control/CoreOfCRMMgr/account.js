let facade = require('gamecloud')
let { ReturnCode, NotifyType } = facade.const

/**
 * 账户的控制器
 * Updated by thomasFuzhou on 2018-11-20.
 */
class account extends facade.Control {
    /**
     * 列表账户
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async List(user, paramGold) {
        try {
            console.log("account.List参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = JSON.parse(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.cid).execute('account.list', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "account.List方法出错" };
        }
    }

    /**
     * 查询账户
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Get(user, paramGold) {
        try {
            console.log("account.Get参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = JSON.parse(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.cid).execute('account.get', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "account.Get方法出错" };
        }

    }

    /**
     * 创建账户
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Create(user, paramGold) {
        try {
            console.log("account.Create参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = JSON.parse(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.cid).execute('account.create', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "account.Create方法出错" };
        }

    }

    /**
     * 账户余额（似乎是指定账户的余额）
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Amount(user, paramGold) {
        try {
            console.log("account.Amount参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = JSON.parse(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.cid).execute('account.amount', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "account.Amount方法出错" };
        }

    }

    /**
     * 查询收款总额
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Received(user, paramGold) {
        try {
            console.log("account.Receive参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = JSON.parse(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.cid).execute('account.received', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "account.Received方法出错" };
        }

    }

    /**
     * 列表收款记录
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async ListReceived(user, paramGold) {
        try {
            console.log("account.ListReceived参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = JSON.parse(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.cid).execute('account.listreceived', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "account.ListReceived方法出错" };
        }

    }

    /**
     * 已确认余额
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async BalanceConfirmed(user, paramGold) {
        try {
            console.log("account.BalanceConfirmed参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = JSON.parse(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.cid).execute('balance.confirmed', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "account.BalanceConfirmed方法出错" };
        }

    }

    /**
     * 余额
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async BalanceAll(user, paramGold) {
        try {
            console.log("account.BalanceAll参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = JSON.parse(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.cid).execute('balance.all', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "account.BalanceAll方法出错" };
        }

    }

    /**
     * 未确认余额
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async BalanceUnconfirmed(user, paramGold) {
        try {
            console.log("account.BalanceUnconfirmed参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = JSON.parse(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.cid).execute('balance.unconfirmed', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "account.BalanceUnconfirmed方法出错" };
        }

    }

}

exports = module.exports = account;
