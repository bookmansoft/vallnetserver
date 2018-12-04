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
        let userWechats = facade.GetMapping(tableType.userWechat).groupOf().where([['openid', '==', openid]]).records(['uid']);
        var data = null;
        if(userWechats.length >0 ) {
            let uid = userWechats[0].uid;
            let userProfile = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records(tableField.userProfile);
            data = userProfile.length > 0 ? userProfile[0] : null;
        }
        return {errcode: 'success', profile: data};
    };

    //新增游戏
    async AddUserGame(user, params)  {
        let openid = params.openid;
        let game_id = params.game_id;
        let userWechats = facade.GetMapping(tableType.userWechat).groupOf().where([['openid', '==', openid]]).records(['uid']);
        if(userWechats.length >0 ) {
            let uid = userWechats[0].uid;
            let userGames = facade.GetMapping(tableType.userGame).groupOf().where([
                ['uid', '==', uid],
                ['game_id', '==', game_id],
            ]).records(['uid']);
            if(userGames.length ==0 ) {
                let userGameItem = {
                    openid: openid,
                    uid: uid,
                    game_id: game_id
                };
                facade.GetMapping(tableType.userGame).Create(userGameItem);
            }
            return {errcode: 'success', item: userGameItem};
        }
        return {errcode: 'success'};
    }

    //我的游戏
    async UserGame(user, params)  {
        let openid = params.openid;
        let userWechats = facade.GetMapping(tableType.userWechat).groupOf().where([['openid', '==', openid]]).records(['uid']);
        if(userWechats.length >0 ) {
            let uid = userWechats[0].uid;
            let userGames = facade.GetMapping(tableType.userGame).groupOf().where([
                ['uid', '==', uid]
            ]).records(['game_id']);
            if(userGames.length >0 ) {
                let gameIds = new Array();
                userGames.forEach(element => {
                    gameIds.push(element.game_id);
                });
                let blockGames = facade.GetMapping(tableType.blockGame).groupOf().where([
                    ['id', 'include', gameIds]
                ]).records(tableField.blockGame);
                return {errcode: 'success', data: blockGames};
            }
        }
        return {errcode: 'success', data: null};
    }
}

exports = module.exports = profile;
