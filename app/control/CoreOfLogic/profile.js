let facade = require('gamecloud');
let {TableType, TableField} = facade.const;

/**
 * 个人中心
 * Create by gamegold Fuzhou on 2018-11-27
 */
class profile extends facade.Control
{
    //新增游戏
    async AddUserGame(user, params)  {
        let uid = user.id;
        let game_id = params.game_id;
        let userGames = await this.core.GetMapping(TableType.usergame).groupOf().where([
            ['uid', '==', uid],
            ['game_id', '==', game_id],
        ]).records(['uid']);
        if(userGames.length ==0 ) {
            let userGameItem = {
                openid: openid,
                uid: uid,
                game_id: game_id
            };
            this.core.GetMapping(TableType.usergame).Create(userGameItem);
        }
        return {code: 0, data: userGameItem};
    }

    //我的游戏
    async UserGame(user, params)  {
        let uid = user.id;
        let userGames = await this.core.GetMapping(TableType.usergame).groupOf().where([
            ['uid', '==', uid]
        ]).records(['game_id']);
        if(userGames.length >0 ) {
            let gameIds = new Array();
            userGames.forEach(element => {
                gameIds.push(element.game_id);
            });
            let blockGames = await this.core.GetMapping(TableType.blockgame).groupOf().where([
                ['id', 'include', gameIds]
            ]).records(TableField.blockgame);
            return {code: 0, data: blockGames};
        }
    }

    //我的道具
    async UserProp(user, params)  {
        let page = params.page;
        let ret = await remote.execute('prop.list', [page, user.openid]);
        user.baseMgr.info.setAttr('prop_count', ret.result.count);
        return {code: 0, data: ret.result.list};
    }

    /**
     * 提取游戏币
     * @param {*} user 
     * @param {*} params 
     */
    async VipDraw(user, params)  {
        let draw_count = params.draw_count;
        let vip_usable_count = user.baseMgr.info.getAttr('vcur');
        if( draw_count < 10 * 100000) {
            return {code: -1, msg: 'draw is not enouth'};
        }
        if(draw_count > vip_usable_count) {
            return {code: -1, msg: 'draw beyond'};
        }

        let ret = await this.core.service.gamegoldHelper.execute('tx.send', [
            user.baseMgr.info.getAttr('block_addr'),
            draw_count,
        ]);   

        if(!ret) {
            return {code: -1, msg: 'txsend fail'};
        } else {
            let remainder = vip_usable_count - draw_count;
            user.baseMgr.info.setAttr('vcur', remainder);
            return {code: 0, data: drawItem};
        }
    }
}

exports = module.exports = profile;
