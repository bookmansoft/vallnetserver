let facade = require('gamecloud');
let {TableType} = facade.const;

class userhelp  extends facade.Service 
{
    async getAddrFromUserIdAndCid(uid, cid) {
        let userWallets = await this.core.GetMapping(TableType.UserWallet).groupOf()
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

module.exports = userhelp;