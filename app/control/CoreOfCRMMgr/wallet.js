let facade = require('gamecloud')
let { ReturnCode, NotifyType } = facade.const

//引入自定义的远程节点类
let RemoteNode = require('./RemoteNode');

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class wallet extends facade.Control {
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 创建钱包
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Create(user, paramGold) {
        try {
            let remote = new RemoteNode().conn(paramGold.userinfo);
            console.log("wallet.Create参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await remote.execute('wallet.create', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, list: ret };
            return { code: ret.code, list: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "wallet.Create方法出错" };
        }

    }

    /**
     * 列表钱包
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async List(user, paramGold) {
        try {
            let remote = new RemoteNode().conn(paramGold.userinfo);
            console.log("wallet.List参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await remote.execute('wallet.list', paramArray);
            //console.log(ret);
            //return { code: ReturnCode.Success, list: ret };
            return { code: ret.code, list: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "wallet.List方法出错" };
        }

    }

    /**
     * 查询钱包概要
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Info(user, paramGold) {
        try {
            let remote = new RemoteNode().conn(paramGold.userinfo);
            console.log("wallet.Info参数串：");
            console.log(JSON.stringify(paramGold.userinfo));
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await remote.execute('wallet.info', paramArray);
            //console.log(ret);
            //return { code: ReturnCode.Success, list: ret };
            return { code: ret.code, list: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "wallet.Info方法出错" };
        }

    }

    /**
     * 转储钱包信息
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Dump(user, paramGold) {
        try {
            let remote = new RemoteNode().conn(paramGold.userinfo);
            console.log("wallet.Dump参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await remote.execute('wallet.dump', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, list: ret };
            return { code: ret.code, list: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "wallet.Dump方法出错" };
        }

    }

    /**
     * 导入钱包备份
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async ImportWallet(user, paramGold) {
        try {
            let remote = new RemoteNode().conn(paramGold.userinfo);
            console.log("wallet.ImportWallet参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await remote.execute('wallet.import', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, list: ret };
            return { code: ret.code, list: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "wallet.ImportWallet方法出错" };
        }

    }

    /**
     * 备份钱包
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Backup(user, paramGold) {
        try {
            let remote = new RemoteNode().conn(paramGold.userinfo);
            console.log("wallet.Backup参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await remote.execute('wallet.backup', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, list: ret };
            return { code: ret.code, list: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "wallet.Backup方法出错" };
        }

    }

    /**
     * 获取钱包助记词
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async KeyMaster(user, paramGold) {
        try {
            let remote = new RemoteNode().conn(paramGold.userinfo);
            console.log("key.master参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await remote.execute('key.master', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, list: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "wallet.KeyMaster方法出错" };
        }

    }
}

exports = module.exports = wallet;
