/**
 * Updated by Administrator on 2017-11-29.
 */
let facade = require('gamecloud')
let CoreOfLogic = facade.CoreOfLogic

/**
 * CRM管理后台对应的门面类
 */
class CoreOfCrm extends CoreOfLogic
{
    /**
     * 映射自己的服务器类型数组，提供给核心类的类工厂使用
     * @returns {Array}
     */
    static get mapping() {
        this.$mapping = ['CRM'];
        return this.$mapping;
    }
}

exports = module.exports = CoreOfCrm;