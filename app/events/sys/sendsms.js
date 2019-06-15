let facade = require('gamecloud')
let EventData = facade.Util.EventData

/**
 * Created by liub on 2019-06-14.
 * @param {EventData} data
 */
function handle(data) {
    switch(data.params.addrType) {
        default: {
            //todo 向用户发送短信
            console.log('todo 向用户发送短信', data.params.address, data.params.content);
            break;
        }
    }
}

module.exports.handle = handle;
