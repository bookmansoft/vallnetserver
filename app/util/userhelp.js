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