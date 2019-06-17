let facade = require('gamecloud')
let { ReturnCode, NotifyType } = facade.const

//引入自定义的远程节点类
let RemoteNode = require('./RemoteNode');

/**
 * 收款地址的控制器
 * Updated by thomasFuzhou on 2018-11-20.
 */
class address extends facade.Control {
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 创建收款地址
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Create(user, paramGold) {
        try {
            let remote = new RemoteNode().conn(paramGold.userinfo);
            console.log("address.Create参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await remote.execute('address.create', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "address.Create方法出错" };
        }
    }

    /**
     * 获取最后一个收款地址
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Receive(user, paramGold) {
        try {
            let remote = new RemoteNode().conn(paramGold.userinfo);
            console.log("address.Receive参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let ret = await remote.execute('address.receive', paramArray);
            console.log(ret);
            //return { code: ReturnCode.Success, data: ret };
            return { code: ret.code, data: ret.result };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "address.Receive方法出错" };
        }

    }


    /**
     * 获取用户地址列表，地址过滤命令
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Filter(user, paramGold) {
        try {
            let remote = new RemoteNode().conn(paramGold.userinfo);
            console.log("address.Filter参数串：");
            let paramArray = paramGold.items;
            if (typeof (paramArray) == "string") {
                paramArray = eval(paramArray);
            }
            console.log(paramArray);
            let retOld = await remote.execute('address.filter', paramArray);
            console.log(retOld);
            let ret=retOld.result;

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

            // let ret=$data.list;
            return $data;
        }
        catch (ex) {
            console.log(error);
            return { code: -1, data: null, message: "address.Filter方法出错" };
        }
    }
}

exports = module.exports = address;
