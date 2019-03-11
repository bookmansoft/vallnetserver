let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');
let remoteSetup = require('../../util/gamegold');
let VipHelp = require('../../util/viphelp');
//引入工具包
const toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
const remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch'))  
remote.setup(remoteSetup);

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
    async Info(user, params)  {
        let openid = params.openid;
        let userWechats = await facade.GetMapping(tableType.userWechat).groupOf().where([['openid', '==', openid]]).records(['uid']);
        var data = null;
        if(userWechats.length >0 ) {
            let uid = userWechats[0].uid;
            let userProfile = await facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
            if(userProfile.length >0 ) {
                data = userProfile[0].orm;
                let ret = await remote.execute('prop.count', [openid]);
                if(!!ret) {
                    data.current_prop_count = ret;
                    userProfile[0].setAttr('current_prop_count', ret);
                    userProfile[0].orm.save();
                }
            }
        }
        return {errcode: 'success', profile: data};
    };

    //新增游戏
    async AddUserGame(user, params)  {
        let openid = params.openid;
        let game_id = params.game_id;
        let userWechats = await facade.GetMapping(tableType.userWechat).groupOf().where([['openid', '==', openid]]).records(['uid']);
        if(userWechats.length >0 ) {
            let uid = userWechats[0].uid;
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
        return {errcode: 'success'};
    }

    //我的游戏
    async UserGame(user, params)  {
        let uid = params.uid;
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
        let uid = params.uid;
        let openid = params.openid;
        let page = params.page;
        let ret = await remote.execute('prop.list', [page, openid]);
        let userProfiles = await facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
        if(userProfiles.length >0 ) {
            let userProfile = userProfiles[0];
            userProfile.setAttr('prop_count', userProfile.orm.current_prop_count);
            userProfile.orm.save();
        }
        return {errcode: 'success', errmsg: 'userprop:ok', props: ret};
    }
    
    //用户信息
    async Mine(user, params)  {
        let uid = params.uid;
        let openid = params.openid;
        let userProfiles = await facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
        if(userProfiles.length >0 ) {
            let userProfile = userProfiles[0];
            let current_prop_count = 0
            let ret = await remote.execute('prop.count', [openid])
            if(!!ret) {
                current_prop_count = ret;
                userProfile.setAttr('current_prop_count', ret)
                userProfile.orm.save()
            }
            
            let prop_count = userProfile.orm.prop_count
            let vipHelp = new VipHelp()
            let vip = await vipHelp.getVip(uid)

            let data = {
                vip: vip,
                current_prop_count: current_prop_count,
                prop_count: prop_count
            }

            return {errcode: 'success', mine: data};
        }
        return {errcode: 'fail', mine: null};
    };

    //提取游戏币
    async VipDraw(user, params)  {
        let uid = params.uid;
        let draw_count = params.draw_count;
        let userProfiles = await facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
        if(userProfiles.length == 0 ) {
            return {errcode: 'fail', errmsg: 'user not exist'};
        } else {
            let userProfile = userProfiles[0];
            let vipHelp = new VipHelp()
            let drawResult = await vipHelp.vipDraw(uid, draw_count, remote, userProfile.orm.block_addr)
            if(drawResult.result == false) {
                return {errcode: 'fail', errmsg: drawResult.errmsg};
            } else {
                return {errcode: 'success', errmsg: drawResult.errmsg, ret: drawResult.drawItem};
            }
        }
    }

    /**
     * 提币记录
     * @param {*} user 
     * @param {*} params 
     */
    async VipDrawLog(user, params)  {
        //提取记录
        let uid = params.uid
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
