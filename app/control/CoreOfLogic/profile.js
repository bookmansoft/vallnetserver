let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');
let remoteSetup = require('../../util/gamegold');
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
        let userWechats = facade.GetMapping(tableType.userWechat).groupOf().where([['openid', '==', openid]]).records(['uid']);
        var data = null;
        if(userWechats.length >0 ) {
            let uid = userWechats[0].uid;
            let userProfile = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
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
        let uid = params.uid;
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

    //我的道具
    async UserProp(user, params)  {
        let uid = params.uid;
        let openid = params.openid;
        let page = params.page;
        let ret = await remote.execute('prop.list', [page, openid]);
        let userProfiles = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
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
        let userProfiles = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
        if(userProfiles.length >0 ) {
            let userProfile = userProfiles[0];
            let ret = await remote.execute('prop.count', [openid])
            let current_prop_count = 0
            let prop_count = userProfile.orm.prop_count
            let vip_get_count = 0
            if(!!ret) {
                current_prop_count = ret;
                userProfile.setAttr('current_prop_count', ret)
                userProfile.orm.save()
            }
            let vip_get_all_count = 0
            if(userProfile.orm.vip_level > 0) {
                
                let current_time = parseInt(new Date().getTime() / 1000);
                let day_time = 24 * 3600
                let delta_time = 0
                let time_get_count = 0

                if(userProfile.orm.vip_level==1) {
                    time_get_count = 10
                } else if(userProfile.orm.vip_level==2) {
                    time_get_count = 110
                } else if(userProfile.orm.vip_level==3) {
                    time_get_count = 330 
                }
                vip_get_all_count = time_get_count * day_time * 30

                delta_time = current_time - userProfile.orm.vip_start_time
                if(delta_time > 0 && current_time < userProfile.orm.vip_end_time) {
                    let vip_last_get_count = delta_time * time_get_count
                    vip_get_count = vip_last_get_count - userProfile.orm.vip_last_get_count
                    let vip_usable_count = vip_get_count + userProfile.orm.vip_usable_count
                    userProfile.setAttr('vip_last_get_time', current_time);
                    userProfile.setAttr('vip_last_get_count', vip_last_get_count);
                    userProfile.setAttr('vip_usable_count', vip_usable_count);
                    userProfile.orm.save();
                }
            }

            let data = {
                vip_level: userProfile.orm.vip_level,
                vip_start_time:  userProfile.orm.vip_start_time,
                vip_end_time:  userProfile.orm.vip_end_time,
                vip_last_get_time:  userProfile.orm.vip_last_get_time,
                vip_last_get_count:  userProfile.orm.vip_last_get_count,
                vip_usable_count:  userProfile.orm.vip_usable_count,
                vip_get_all_count: vip_get_all_count,
                vip_get_count: vip_get_count,
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
        let userProfiles = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
        if(userProfiles.length >0 ) {
            let userProfile = userProfiles[0]
            let vip_usable_count = userProfile.orm.vip_usable_count
            //let k = vip_usable_count / 100000
            if( draw_count < 10 * 100000) {
                return {errcode: 'fail', errmsg: 'draw is not enouth'};
            }
            if(draw_count > vip_usable_count) {
                return {errcode: 'fail', errmsg: 'draw beyond'};
            }
            let ret = await remote.execute('tx.send', [
                userProfile.orm.block_addr, 
                draw_count
            ]);   
            if(!!!ret) {
                return {errcode: 'fail', errmsg: 'txsend fail', ret: ret};
            } else {
                let remainder = vip_usable_count - draw_count
                let current_time = parseInt(new Date().getTime() / 1000)
                let drawItem = {
                    uid: uid,
                    draw_count: draw_count,
                    remainder: remainder,
                    draw_at: current_time,
                }
                facade.GetMapping(tableType.vipdraw).Create(drawItem);
                userProfile.setAttr('vip_usable_count', remainder);
                userProfile.orm.save();
                return {errcode: 'success', errmsg: 'vipdraw:ok', ret:drawItem};
            }
        } else {
            return {errcode: 'fail', errmsg: 'vipdraw:no user'};
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
            vipDrawLog = facade.GetMapping(tableType.vipdraw)
            .groupOf().where([['uid','==',uid]])
            .orderby('draw_at', 'desc')
            .paginate(5, 1, tableField.vipdraw)
            .records()
        } else {
            vipDrawLog = facade.GetMapping(tableType.vipdraw)
            .groupOf().where([['uid','==',uid]])
            .orderby('draw_at', 'desc')
            .records(tableField.vipdraw);
        }
        return {errcode: 'success', errmsg: 'vipdrawlog:ok', ret:vipDrawLog};
    }
}

exports = module.exports = profile;
