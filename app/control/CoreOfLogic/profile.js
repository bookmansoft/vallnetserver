let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');

/**
 * 个人中心
 * Create by gamegold Fuzhou on 2018-11-27
 */
class profile extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    //用户信息
    async Mine(user, params)  {
        let openid = params.openid;
        let userWechat = facade.GetMapping(tableType.userWechat).groupOf().where([['openid', '==', openid]]).records(['uid']);
        var data = null;
        if(userWechat.length >0 ) {
            let uid = userWechat[0].uid;
            let userProfile = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records(tableField.userProfile);
            data = userProfile.length > 0 ? userProfile[0] : null;
        }
        return {errcode: 'success', profile: data};
    };

}

exports = module.exports = profile;
