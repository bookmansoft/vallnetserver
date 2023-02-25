/**
 * Updated by Administrator on 2017-11-29.
 */
let facade = require('gamecloud')
let CoreOfLogic = facade.CoreOfLogic

/**
 * 钱包节点
 */
class CoreOfWallet extends CoreOfLogic
{
    /**
     * 映射自己的服务器类型数组，提供给核心类的类工厂使用
     * @returns {Array}
     */
    static get mapping() {
        this.$mapping = ['CoreOfWallet'];
        return this.$mapping;
    }
}

exports = module.exports = CoreOfWallet;