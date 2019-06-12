let facade = require('gamecloud');
let tableType = require('./tabletype');
let randomHelp = require('./randomHelp')
let crypto = require('crypto')

class userhelp {
     /**
     * 构造函数
     * @param {*}  监控对象ID
     */
    constructor() {
    }

    async getAddrFromUserIdAndCid(uid, cid) {
        let userWallets = await facade.GetMapping(tableType.userWallet).groupOf()
            .where([
                ['uid', '==', uid],
                ['cid', '==', cid],
            ])
            .records(['addr']);
        if(userWallets.length >0 ) {
            return userWallets[0].addr;
        }
        return '';
    }

    /**
     * 从微信服务器提供的openid，获取该用户的信息；如果该openid没有对应的信息，则返回 {id:0}
     * 判断用户存在必须 user_wechat 和 user_base 
     */
    async getUserFromOpenId(openid, ntype) {
        let userWechats = await facade.GetMapping(tableType.userWechat).groupOf()
            .where([
                ['openid', '==', openid],
                ['ntype', '==', ntype],
            ]).records(['uid'])
        if(userWechats.length >0 ) {
            let uid = userWechats[0].uid
            let userBase = await facade.GetMapping(tableType.userBase).groupOf()
                .where([['id', '==', uid]]).records(['id', 'user_name'])
            if(userBase.length >0 ) {
                return userBase[0]
            }
        }
        return {id:0, user_name:''};
    }

    isPoneAvailable($poneInput) {
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test($poneInput.val())) {
            return false;
        } else {
            return true;
        }
    }
}

let conn = new userhelp();

module.exports = conn;