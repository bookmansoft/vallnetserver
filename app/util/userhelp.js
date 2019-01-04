let facade = require('gamecloud')
let tableType = require('./tabletype');
let tableField = require('./tablefield');

class userhelp {
     /**
     * 构造函数
     * @param {*}  监控对象ID
     */
    constructor(){

    }

    async getUserIdFromOpenId(openid) {
        let userWechats = facade.GetMapping(tableType.userWechat).groupOf().where([['openid', '==', openid]]).records(['uid']);
        if(userWechats.length >0 ) {
            return userWechats[0].uid;
        }
        return 0
    }
}

module.exports = userhelp;