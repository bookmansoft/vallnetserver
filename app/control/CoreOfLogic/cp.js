let facade = require('gamecloud')
let {ReturnCode, NotifyType} = facade.const

//引入工具包
const toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
const remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch'))  

/**
 * 游戏的控制器
 * Updated by thomasFuzhou on 2018-11-19.
 */
class cp extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 查询系统中现有的所有CP列表：cp.list
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async List(user, paramGold) {
        console.log(paramGold.items);
        let ret = await remote.execute('cp.list', paramGold.items);
        console.log(ret);
        return {code: ReturnCode.Success,list: ret};
    }

    /**
     * CP注册指令：cp.create "name" "url" ["ip"]
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Create(user, paramGold) {
        console.log(paramGold.items);
        let ret = await remote.execute('cp.create', paramGold.items);
        console.log(ret);
        return {code: ReturnCode.Success,result: ret};
    }

    /**
     * CP修改/转让指令： cp.change "name" ["url" "ip" "addr"]
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Change(user, paramGold) {
        console.log(paramGold.items);
        let ret = await remote.execute('cp.change', paramGold.items);
        console.log(ret);
        return {code: ReturnCode.Success,result: ret};
    }

    /**
     * 根据ID查询CP注册信息 cid CP编码
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async ById(user, paramGold) {
        console.log(paramGold.items);
        let ret = await remote.execute('cp.ById', paramGold.items);
        console.log(ret);
        return {code: ReturnCode.Success,result: ret};
    }

    /**
     * 根据名称查询CP注册信息 name CP名称
     * @param {*} user 
     * @param {*} paramGold 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async ByName(user, paramGold) {
        console.log(paramGold.items);
        let ret = await remote.execute('cp.ByName', paramGold.items);
        console.log(ret);
        return {code: ReturnCode.Success,result: ret};
    }

    //申请令牌
    async UserToken(user, params) {
        let ret = await remote.execute('token.user', [
            params.cid,
            params.uid,
            params.openid
        ]);
        return {errcode: 'success', errmsg:'usertoken:ok', ret: ret};
    }
}

exports = module.exports = cp;
