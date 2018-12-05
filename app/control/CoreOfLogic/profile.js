let facade = require('gamecloud');
let tableType = require('../../util/tabletype');
let tableField = require('../../util/tablefield');
//引入工具包
const toolkit = require('gamegoldtoolkit')
//创建授权式连接器实例
const remote = new toolkit.conn();
//兼容性设置，提供模拟浏览器环境中的 fetch 函数
remote.setFetch(require('node-fetch'))  
function remoteSetup() {
    remote.setup({
        type:   'testnet',
        ip:     '114.116.14.176',     //远程服务器地址
        head:   'http',               //远程服务器通讯协议，分为 http 和 https
        id:     'primary',            //默认访问的钱包编号
        apiKey: 'bookmansoft',        //远程服务器基本校验密码
        cid:    'xxxxxxxx-game-gold-root-xxxxxxxxxxxx', //授权节点编号，用于访问远程钱包时的认证
        token:  '03aee0ed00c6ad4819641c7201f4f44289564ac4e816918828703eecf49e382d08', //授权节点令牌固定量，用于访问远程钱包时的认证
    });
}
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
        remoteSetup();
        let openid = params.openid;
        let userWechats = facade.GetMapping(tableType.userWechat).groupOf().where([['openid', '==', openid]]).records(['uid']);
        var data = null;
        if(userWechats.length >0 ) {
            let uid = userWechats[0].uid;
            let userProfile = facade.GetMapping(tableType.userProfile).groupOf().where([['uid', '==', uid]]).records();
            if(userProfile.length >0 ) {
                data = userProfile[0].orm;
                /*
                let ret = await remote.execute('prop.count', [openid]);
                if(!!ret) {
                    data.current_prop_count = ret;
                    userProfile[0].setAttr('current_prop_count', ret);
                    userProfile[0].orm.save();
                }
                remote.execute('prop.list', [openid]).then(ret => {
                    ret.forEach(element => {
                        
                    });
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

    //我的道具
    async UserProp(user, params)  {

    }
}

exports = module.exports = profile;
