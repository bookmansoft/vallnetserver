/**
 * Updated by Administrator on 2017-11-29.
 */
let facade = require('gamecloud')
let CoreOfLogic = facade.CoreOfLogic

/**
 * 游戏 Chick 的业务逻辑节点
 */
class CoreOfChick extends CoreOfLogic
{
    /**
     * 映射自己的服务器类型数组，提供给核心类的类工厂使用
     * @returns {Array}
     */
    static get mapping() {
        this.$mapping = ['CoreOfChickIOS'];
        return this.$mapping;
    }

    async Start(app) {
        await super.Start(app);

        //#region 和主链节点交互
        try {
            //自动填充cid
            let ret = await this.service.gamegoldHelper.execute('cp.byName', [this.service.gamegoldHelper.cname]);
            this.service.gamegoldHelper.remote.setup({
                cpid: ret.result.cid,
                type: this.service.gamegoldHelper.remote.defaultNetworkType,
            })

            //检查并构建自有NFT的内存表
            if(!this.nftMap) {
                this.nftMap = new Map();

                ret = await this.service.gamegoldHelper.execute('prop.query', [[
                    ['cid', this.service.gamegoldHelper.cid],
                    ['pst', 9],
                    ['size',-1]
                ]]);

                for(let nft of ret.result.list) {
                    if(!this.nftMap.has(nft.oid)) {
                        this.nftMap.set(nft.oid, []);
                    }
                    this.nftMap.get(nft.oid).push(nft.pid);
                }
            }
        } catch(e) {
            console.log(e.message);
        }
        //#endregion
    }   
}

exports = module.exports = CoreOfChick;