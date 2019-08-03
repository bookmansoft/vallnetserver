let facade = require('gamecloud')
let EventData = facade.Util.EventData

/**
 * Created by admin on 2017-05-26.
 * @param {EventData} data
 */
function handle(data) { //客户端上行消息
    //定期检测待处理事务
    data.user.tick();
}

module.exports.handle = handle;
