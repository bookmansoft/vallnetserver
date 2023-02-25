const facade = require('gamecloud')
const gamegoldHelper = require('./gamegoldHelper')

/**
 * monitor 作为 gamegoldHelper 的字节子类，用于创建一个全局单例作为消息观察者(基于WS通讯模式)
 */
class monitor extends gamegoldHelper
{
    constructor(core) {
        super(core);
        this.remote.setup(facade.ini.servers["CoreOfIndex"][1].node);
    }
}

module.exports = monitor;
