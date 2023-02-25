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
}

exports = module.exports = CoreOfChick;