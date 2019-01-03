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
                /*
                let cpProps = facade.GetMapping(tableType.userProp).groupOf().where([['uid', '==', uid]]).records(['id']);
                if(cpProps.length >0 ) {
                    let ids = [];
                    cpProps.forEach(element => {
                        ids.push(element.id);
                    });
                    await facade.GetMapping(tableType.userProp).Deletes(ids, true);
                }
                remote.execute('prop.list', [1, openid]).then(ret => {
                    console.log(ret);
                    if(!!ret) {
                        ret.forEach(element => {
                            let itemData = {
                                uid: uid,
                                openid: openid,
                                cid: element.cid,
                                oid: element.oid,
                                pid: element.pid,
                                oper: element.oper,
                                current_hash: element.current.hash,
                                current_index: element.current.index,
                                current_rev: element.current.rev,
                                current_height: element.current.height,
                                time: element.time,
                                gold: element.gold,
                                status: element.status,
                                cp_url: element.cp.url,
                                cp_name: element.cp.name,
                                cp_ip: element.cp.ip
                            };
                            facade.GetMapping(tableType.userProp).Create(itemData);
                        });
                    }
                });
                */
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

    //购买VIP会员 
    async UserVipBuy(user, params)  {
        let uid = params.uid;     
        let vip_level =  params.vip_level;
        //let userProfiles = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records(tableField.userProfiles);
        let userProfiles = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
        if(userProfiles. length >0 ) {
            let userProfile = userProfiles[0];
            if(userProfile.orm.vip_level >= vip_level) {
                return {errcode: 'error', errmsg: '当前已经是VIP'+vip_level};
            }
            let vip_start_time = parseInt(new Date().getTime() / 1000);
            let vip_end_time = vip_start_time + 3600 * 24 * 30;
            userProfile.setAttr('vip_level', vip_level);
            userProfile.setAttr('vip_start_time', vip_start_time);
            userProfile.setAttr('vip_end_time', vip_end_time);
            userProfile.orm.save();
            return {errcode: 'success', errmsg: 'uservipbuy:ok'}; 
        } else {
            return {errcode: 'error', errmsg: 'no user'};
        }
    }
    
    //用户信息
    async Mine(user, params)  {
        let uid = params.uid;
        let openid = params.openid;
        let userProfiles = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
        if(userProfiles.length >0 ) {
            let userProfile = userProfiles[0];
            let ret = await remote.execute('prop.count', [openid]);
            if(!!ret) {
                data.current_prop_count = ret;
                userProfile.setAttr('current_prop_count', ret);
                userProfile.orm.save()
            }
            let vip_get_all_count = 0
            if(userProfile.orm.vip_level > 0) {
                
                let current_time = parseInt(new Date().getTime() / 1000);
                let day = 24 * 3600
                let delta_time = 0
                let get_count = 0
                
                if(userProfile.orm.vip_level==1) {
                    get_count = 10
                } else if(userProfile.orm.vip_level==2) {
                    get_count = 100
                } else if(userProfile.orm.vip_level==3) {
                    get_count = 300 
                }
                vip_get_all_count = get_count * 30

                if( userProfile.orm.vip_last_get_time == 0 ) {
                    userProfile.setAttr('vip_last_get_time', current_time);
                    userProfile.setAttr('vip_last_get_count', get_count);
                    userProfile.orm.save();
                } else {
                    delta_time = current_time - userProfile.orm.vip_last_get_time
                    let delta_day = parseInt(delta_time / day)
                    if(delta_day > 0) {
                        userProfile.setAttr('vip_last_get_time', current_time);
                        userProfile.setAttr('vip_last_get_count', get_count * delta_day);
                        userProfile.orm.save();
                    }
                }
            }
            let data = {
                vip_level: userProfile.orm.vip_level,
                vip_start_time:  userProfile.orm.vip_start_time,
                vip_end_time:  userProfile.orm.vip_end_time,
                vip_last_get_time:  userProfile.orm.vip_last_get_time,
                vip_last_get_count:  userProfile.orm.vip_last_get_count,
                vip_usable_count:  userProfile.orm.vip_usable_count,
                vip_get_all_count: vip_get_all_count
            }

            return {errcode: 'success', mine: data};
        }
        return {errcode: 'success', mine: null};
    };
}

exports = module.exports = profile;
