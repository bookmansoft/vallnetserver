/**
 * Updated by Administrator on 2017-11-29.
 */
let facade = require('gamecloud')

/**
 * 模拟游戏服务器
 */
class CoreOfSimulation extends facade.CoreOfBase 
{
    constructor($env){
        super($env);

        //中间件设定 - 注意不要覆盖父类构造函数已经做出的设定
        this.middlewareSetting.default = ['parseParams', 'afterHandle'];
    }

    /**
     * 映射自己的服务器类型数组，提供给核心类的类工厂使用
     * @returns {Array}
     */
    static get mapping() {
        this.$mapping = ['Simu'];
        return this.$mapping;
    }

    /**
     * 自启函数
     * @param {*} app 
     */
    async Start(app){
        super.Start(app);

        //对外开放RPC接口
        this.StartSocketServer(app);
        
        //对内建立以索引服务器为中心的星状通讯链路
        this.initConnector("Index", 1);
    }
}

exports = module.exports = CoreOfSimulation;