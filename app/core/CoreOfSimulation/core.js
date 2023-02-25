let facade = require('gamecloud')

/**
 * 模拟游戏服务器
 */
class CoreOfSimulation extends facade.CoreOfBase 
{
    /**
     * 映射自己的服务器类型数组，提供给核心类的类工厂使用
     * @returns {Array}
     */
    static get mapping() {
        this.$mapping = ['CoreOfSimu'];
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
    }
}

exports = module.exports = CoreOfSimulation;