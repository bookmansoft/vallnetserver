/**
 * Created by liub on 2017-05-26.
 */
let facade = require('gamecloud')
let {NotifyType} = facade.const

/**
 * 用户登录后，用来执行一些后续操作，例如获取腾讯会员信息、蓝钻特权等
 * @note 事件处理函数，this由外部注入，指向Facade
 * @param data
 */
function handle(data){
}

module.exports.handle = handle;