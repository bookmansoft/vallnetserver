let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');
let VipHelp = require('../../util/viphelp');

/**
 * 个人中心
 * Create by gamegold Fuzhou on 2018-11-27
 */
class profile extends facade.Control
{
    //用户信息
    async Info(user, params)  {
        let ret = await facade.current.service.gamegoldHelper.execute('prop.list', [1, user.id]);
        if(!!ret) {
            user.baseMgr.info.setAttr('current_prop_count', ret.result.count);
        }
        return {errcode: 'success', profile: user.baseMgr.info.getData()};
    };

    //新增游戏
    async AddUserGame(user, params)  {
        let uid = user.id;
        let game_id = params.game_id;
        let userGames = await facade.GetMapping(tableType.userGame).groupOf().where([
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

    //我的游戏
    async UserGame(user, params)  {
        let uid = user.id;
        let userGames = await facade.GetMapping(tableType.userGame).groupOf().where([
            ['uid', '==', uid]
        ]).records(['game_id']);
        if(userGames.length >0 ) {
            let gameIds = new Array();
            userGames.forEach(element => {
                gameIds.push(element.game_id);
            });
            let blockGames = await facade.GetMapping(tableType.blockGame).groupOf().where([
                ['id', 'include', gameIds]
            ]).records(tableField.blockGame);
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
    
    //用户信息
    async Mine(user, params)  {
        let current_prop_count = 0;
        let ret = await facade.current.service.gamegoldHelper.execute('prop.list', [1, user.id])
        if(!!ret) {
            current_prop_count = ret.result.count;
            user.baseMgr.info.setAttr('current_prop_count', current_prop_count);
        }
        
        let prop_count = user.baseMgr.info.getAttr('prop_count');

        let vipHelp = new VipHelp()
        let vip = await vipHelp.getVip(user.id)

        return {errcode: 'success', mine: {
            vip: vip,
            current_prop_count: current_prop_count,
            prop_count: prop_count,
        }};
    };

    //提取游戏币
    async VipDraw(user, params)  {
        let draw_count = params.draw_count;
        let vipHelp = new VipHelp();
        let drawResult = await vipHelp.vipDraw(user.id, draw_count, user.baseMgr.info.getAttr('block_addr'));
        if(drawResult.result == false) {
            return {errcode: 'fail', errmsg: drawResult.errmsg};
        } else {
            return {errcode: 'success', errmsg: drawResult.errmsg, ret: drawResult.drawItem};
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
            vipDrawLog = await facade.GetMapping(tableType.vipdraw)
            .groupOf().where([['uid','==',uid]])
            .orderby('draw_at', 'desc')
            .paginate(5, 1, tableField.vipdraw)
            .records()
        } else {
            vipDrawLog = await facade.GetMapping(tableType.vipdraw)
            .groupOf().where([['uid','==',uid]])
            .orderby('draw_at', 'desc')
            .records(tableField.vipdraw);
        }
        return {errcode: 'success', errmsg: 'vipdrawlog:ok', ret:vipDrawLog};
    }
}

exports = module.exports = profile;
