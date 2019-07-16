let facade = require('gamecloud');
let {TableType} = facade.const;
let tableField = require('../../util/tablefield');

/**
 * 个人中心
 * Create by gamegold Fuzhou on 2018-11-27
 */
class profile extends facade.Control
{
    /**
     * 用户信息
     * @param {*} user 
     * @param {*} params 
     */
    async Info(user, params)  {
        //todo 这里对主网的访问是不是太频繁了？
        let ret = await this.core.service.gamegoldHelper.execute('prop.list', [1, user.id]);
        if(!!ret) {
            user.baseMgr.info.setAttr('current_prop_count', ret.result.count);
        }
        return {errcode: 'success', profile: user.baseMgr.info.getData()};
    };

    //新增游戏
    async AddUserGame(user, params)  {
        let uid = user.id;
        let game_id = params.game_id;
        let userGames = await this.core.GetMapping(TableType.UserGame).groupOf().where([
            ['uid', '==', uid],
            ['game_id', '==', game_id],
        ]).records(['uid']);
        if(userGames.length ==0 ) {
            let userGameItem = {
                openid: openid,
                uid: uid,
                game_id: game_id
            };
            this.core.GetMapping(TableType.UserGame).Create(userGameItem);
        }
        return {errcode: 'success', item: userGameItem};
    }

    //我的游戏
    async UserGame(user, params)  {
        let uid = user.id;
        let userGames = await this.core.GetMapping(TableType.UserGame).groupOf().where([
            ['uid', '==', uid]
        ]).records(['game_id']);
        if(userGames.length >0 ) {
            let gameIds = new Array();
            userGames.forEach(element => {
                gameIds.push(element.game_id);
            });
            let blockGames = await this.core.GetMapping(TableType.BlockGame).groupOf().where([
                ['id', 'include', gameIds]
            ]).records(tableField.BlockGame);
            return {errcode: 'success', data: blockGames};
        }
    }

    //我的道具
    async UserProp(user, params)  {
        let uid = user.id;
        let page = params.page;
        let ret = await remote.execute('prop.list', [page, uid]);
        user.baseMgr.info.setAttr('prop_count', ret.result.count);
        return {errcode: 'success', errmsg: 'userprop:ok', props: ret.result.list};
    }
    



    /**
     * 提取游戏币
     * @param {*} user 
     * @param {*} params 
     */
    async VipDraw(user, params)  {
        let draw_count = params.draw_count;
        let vip_usable_count = user.baseMgr.info.getAttr('vip_usable_count');
        if( draw_count < 10 * 100000) {
            return {result: false, errmsg: 'draw is not enouth'};
        }
        if(draw_count > vip_usable_count) {
            return {result: false, errmsg: 'draw beyond'};
        }

        let ret = await this.core.service.gamegoldHelper.execute('tx.send', [
            user.baseMgr.info.getAttr('block_addr'),
            draw_count,
        ]);   

        if(!ret) {
            return {errcode: 'fail', errmsg: 'txsend fail'};
        } else {
            let remainder = vip_usable_count - draw_count;
            let current_time = parseInt(new Date().getTime() / 1000);
            let drawItem = {
                uid: user.uid,
                draw_count: draw_count,
                remainder: remainder,
                draw_at: current_time,
            }
            this.core.GetMapping(TableType.VipDraw).Create(drawItem);
            user.baseMgr.info.setAttr('vip_usable_count', remainder);

            return {errcode: 'success', errmsg: 'vipdraw:ok', ret: drawItem};
        }
    }

    /**
     * 提币记录
     * @param {*} user 
     * @param {*} params 
     */
    async VipDrawLog(user, params)  {
        //提取记录
        let uid = user.id
        let last = params.last
        let vipDrawLog = null; 
        if(last==1) {
            vipDrawLog = await this.core.GetMapping(TableType.VipDraw)
            .groupOf().where([['uid','==',uid]])
            .orderby('draw_at', 'desc')
            .paginate(5, 1)
            .records(tableField.VipDraw)
        } else {
            vipDrawLog = await this.core.GetMapping(TableType.VipDraw)
            .groupOf().where([['uid','==',uid]])
            .orderby('draw_at', 'desc')
            .records(tableField.VipDraw);
        }
        return {errcode: 'success', errmsg: 'vipdrawlog:ok', ret:vipDrawLog};
    }
}

exports = module.exports = profile;
