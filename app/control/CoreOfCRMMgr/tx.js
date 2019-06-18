let facade = require('gamecloud')
let { ReturnCode, NotifyType } = facade.const

/**
 * 交易的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class tx extends facade.Control {
    /**
     * 查询交易记录(钱包)
     * tx.get.wallet
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async GetWallet(user, paramGold) {
        try {
            console.log("tx.GetWallet参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.id).execute('tx.get.wallet', paramArray);
            //console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "tx.GetWallet方法出错" };
        }

    }

    /**
     * 交易列表(钱包)
     * tx.list
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async List(user, paramGold) {
        try {
            console.log("tx.List参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray, "::", paramGold.currentPage);
            let orignData = await this.core.service.RemoteNode.conn(user.id).execute('tx.list', paramArray);
            let srcData=orignData.result.reverse();//倒排序

            //扩展分页器对象
            let $data = { items: {}, list: [], pagination: {} };
            let currentPage = 1;
            if (!!paramGold.currentPage && !isNaN(paramGold.currentPage)) {
                currentPage = parseInt(paramGold.currentPage);
            }
            console.log(currentPage);
            $data.pagination = { "total": srcData.length, "pageSize": 10, "current": currentPage };
            console.log($data.pagination);
            $data.total = srcData.length;
            $data.page = currentPage;
            // 截取有效的数组部分
            for (let i = (currentPage-1) * 10; i < Math.min(currentPage * 10,$data.total); i++) {
                $data.list.push( srcData[i]);
            }


            //转化并设置数组属性
            console.log($data);
            return { code: ReturnCode.Success, data: $data };

            // console.log(ret);
            // console.log(paramGold.daterange);
            // let retArray = new Array();
            // if (paramGold.daterange != null && paramGold.daterange != 'undefined' && paramGold.daterange[0] != null) {
            //     console.log("daterange值有效，开始过滤返回结果数据");
            //     let dateRangeParam = eval(paramGold.daterange);
            //     let beginDate = dateRangeParam[0].substring(0, 10)
            //         .replace(/-/g, '/') + ' 00:00:00';
            //     let endDate = dateRangeParam[1].substring(0, 19)
            //         .replace(/-/g, '/') + ' 23:59:59';
            //     console.log(beginDate);
            //     console.log(endDate);
            //     let nBeginDate = new Date(beginDate).getTime() / 1000;
            //     let nEndDate = new Date(endDate).getTime() / 1000;
            //     //判断是否符合筛选条件
            //     ret.forEach(function (value, index) {
            //         if (nBeginDate <= value.blocktime && nEndDate >= value.blocktime) {
            //             retArray.push(value);
            //         }

            //     });
            // }
            // else {
            //     //无参数情况
            //     retArray = ret;
            // }
            // console.log(ret);
            // return { code: ReturnCode.Success, data: retArray };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "tx.List方法出错" };
        }
    }

    /**
     * 签署交易(钱包)
     * tx.sign
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Sign(user, paramGold) {
        try {
            console.log("tx.sign参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.id).execute('tx.sign', paramArray);
            console.log(ret);
             //return { code: ReturnCode.Success, data: ret };
             return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "tx.Sign方法出错" };
        }

    }

    /**
     * 创建交易(钱包)
     * tx.create
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Create(user, paramGold) {
        try {
            console.log("tx.Create参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.id).execute('tx.create', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "tx.Create方法出错" };
        }

    }

    /**
     * 根据输入的金额和地址，创建、签署、发送一笔P2PKH类转账交易：
     * 【钱包-转出功能使用】
     * tx.send addr value
     * 目标地址、尘
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Send(user, paramGold) {
        try {
            console.log("tx.Send参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await this.core.service.RemoteNode.conn(user.id).execute('tx.send', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "tx.Send方法出错" };
        }

    }

}

exports = module.exports = tx;
