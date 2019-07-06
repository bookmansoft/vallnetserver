const gamegoldHelper = require('./gamegoldHelper')

/**
 * monitor 作为 gamegoldHelper 的字节子类，用于创建一个全局单例作为消息观察者(基于WS通讯模式)
 */
class monitor extends gamegoldHelper
{
}

module.exports = monitor;
