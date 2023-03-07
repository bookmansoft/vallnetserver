/**
 * Updated by Administrator on 2017-11-29.
 */
let facade = require('gamecloud')

/**
 * 签证服务器对应的门面类
 */
class CoreOfAuth extends facade.CoreOfBase 
{
    constructor($env){
        super($env);

        //中间件设定 - 注意不要覆盖父类构造函数已经做出的设定
        this.middlewareSetting.default = ['parseParams', 'commonHandle', 'afterHandle'];
    }

    /**
     * 映射自己的服务器类型数组，提供给核心类的类工厂使用
     * @returns {Array}
     */
    static get mapping() {
        this.$mapping = ['CoreOfAuth'];
        return this.$mapping;
    }

    /**
     * 自启函数
     * @param {*} app 
     */
    async Start(app){
        await super.Start(app);

        //对外开放RPC接口
        this.StartSocketServer(app);
        
        //对内建立以索引服务器为中心的星状通讯链路
        this.initConnector("CoreOfIndex", 1);
    }
}

exports = module.exports = CoreOfAuth;