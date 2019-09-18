let facade = require('gamecloud')

/**
 * 用户注册事件处理句柄
 * Created by admin on 2017-05-26.
 */
function handle(data) {
    if(!this.options.debug) {
        switch(data.user.domainType) {
            default: //腾讯平台数据上报接口
                break;
        }
    }
}

module.exports.handle = handle;
