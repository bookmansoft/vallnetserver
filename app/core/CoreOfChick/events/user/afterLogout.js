let facade = require('gamecloud')
let {UserStatus} = facade.const

/**
 * Created by admin on 2017-05-26.
 */
function handle(data) {//用户签退
    //在线状态发生变化
    data.user.baseMgr.info.UnsetStatus(UserStatus.online);
}

module.exports.handle = handle;
