let facade = require('gamecloud')
let remoteSetup = require('../../util/gamegold');
let {ReturnCode, NotifyType} = facade.const
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');
let userhelp = require('../../util/userhelp');
//引入工具包
const toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
const remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch'))  
remote.setup(remoteSetup);
let userHelp = new userhelp();

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
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async List(user, params) {
        let page = params.page;
        let num = params.num;
        let ret = await remote.execute('cp.list', [
            page,
            num
        ]);
        return {errcode: 'success', cp: ret};
    }

    /**
     * 查询系统中现有的CP数量
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async CpCount(user, params) {
        let page = 1;
        let num = 100000;
        let ret = await remote.execute('cp.list', [
            page,
            num
        ]);
        let count = ret==null ? 0 : ret.list.length
        return {errcode: 'success', cp_count: count};
    }

    /**
     * CP注册指令：cp.create "name" "url" ["ip"]
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Create(user, params) {
        let ret = await remote.execute('cp.create', params.items);
        return {errcode: 'success',result: ret};
    }

    /**
     * CP修改/转让指令： cp.change "name" ["url" "ip" "addr"]
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async Change(user, params) {
        console.log(params.items);
        let ret = await remote.execute('cp.change', params.items);
        return {errcode: 'success',result: ret};
    }

    /**
     * 根据ID查询CP注册信息 cid CP编码
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async ById(user, params) {
        console.log(params.items);
        let ret = await remote.execute('cp.ById', params.items);
        return {errcode: 'success',result: ret};
    }

    /**
     * 根据名称查询CP注册信息 name CP名称
     * @param {*} user 
     * @param {*} params 其中的成员 items 是传递给区块链全节点的参数数组
     */
    async ByName(user, params) {
        let ret = await remote.execute('cp.ByName', params.items);
        return {errcode: 'success',result: ret};
    }

    //申请令牌
    async UserToken(user, params) {
        let ret = await remote.execute('token.user', [
            params.cid,
            params.uid,
            null,
            params.openid
        ]);
        if (!!ret && ret.hasOwnProperty("data")) {
            let addr = ret.data.addr;
            let userWallet = facade.GetMapping(tableType.userWallet).groupOf().where([
                ['cid', '==', params.cid],
                ['cp_uid', '==', params.uid],
                ['openid', '==', params.openid]
            ]).records();
            if(userWallet.length == 0) {
                let uid = await userHelp.getUserIdFromOpenId(params.openid)
                let userWalletItem = {
                    uid: uid,
                    cid: params.cid,
                    addr: addr,
                    cp_uid: params.uid,
                    openid: params.openid,
                };
                facade.GetMapping(tableType.userWallet).Create(userWalletItem);
            }
        }
        return {errcode: 'success', errmsg:'usertoken:ok', ret: ret};
    }
}

exports = module.exports = cp;
