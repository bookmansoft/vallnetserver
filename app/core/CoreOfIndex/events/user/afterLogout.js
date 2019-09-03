let facade = require('gamecloud')
let {UserStatus} = facade.const

/**
 * Created by admin on 2017-05-26.
 */
function handle(data) {//用户签退
    this.service.servers.mapServer(data.user, true); //清理先前注册的逻辑服信息
}

module.exports.handle = handle;
