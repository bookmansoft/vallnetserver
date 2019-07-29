let gh = require('../../util/gamegoldHelper')
let facade = require('gamecloud')
let {TableType, IndexType} = facade.const

class gamegoldHelper extends gh
{
    /**
     * 查询用户对应特定CP的专用地址
     * @param {*} user  用户对象
     * @param {*} cid   CP编码
     */
    async getAddrFromUserIdAndCid(user, cid) {
        let addrObj = this.core.GetObject(TableType.userwallet, `${cid}.${user.domainId}`, IndexType.Domain);
        if(!addrObj) {
            let ret = await this.core.service.gamegoldHelper.execute('token.user', [
                cid,
                user.domainId,
                null,
                user.domainId,
            ]);
    
            if (!!ret && ret.code == 0) {
                this.core.GetMapping(TableType.userwallet).Create({
                    cid: cid,
                    user_id: user.domainId,
                    addr: ret.result.data.addr,
                });
                
                return ret.result.data.addr;
            } else {
                return null;
            }
        } else {
            return addrObj.orm.addr;
        }
    }
}

module.exports = gamegoldHelper;
