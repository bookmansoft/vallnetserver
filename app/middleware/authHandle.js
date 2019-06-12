let facade = require('gamecloud')
let {MiddlewareParam, ReturnCode, EntityType, IndexType, UserStatus, DomainType, GetDomainType,RecordType} = facade.const
let CommonFunc = facade.util
let {extendObj} = require('../util/util')

/**
 * 用户认证鉴权中间件
 * @param {MiddlewareParam} sofar
 * 
 * @description  注意: 该中间件覆盖了系统同名中间件
 */
async function handle(sofar) {
    try {
        //根据令牌进行鉴权
        if(!sofar.socket.user){
            sofar.socket.user = await facade.GetObject(EntityType.User, sofar.msg.oemInfo.token, IndexType.Token);
        }
        
        if (!sofar.socket.user || sofar.msg.func == "login" || sofar.msg.func == "1000"/*如果是login则强制重新验证*/) {
            //针对各类第三方平台，执行一些必要的验证流程：
            switch(GetDomainType(sofar.msg.oemInfo.domain)) {
                default: {
                    try {
                        let data = await facade.current.control[sofar.msg.oemInfo.domain].check(sofar.msg.oemInfo);
                        extendObj(sofar.msg.oemInfo, data);
                        sofar.msg.domainId = `${sofar.msg.oemInfo.domain}.${sofar.msg.oemInfo.openid}`;
                    } catch(e) {
                        sofar.fn({ code: ReturnCode.authThirdPartFailed });
                        sofar.recy = false;
                        return;
                    }
                    break;
                }
            }

            sofar.msg.oemInfo.token = facade.util.sign({ did: sofar.msg.domainId }, sofar.facade.options.game_secret); //为用户生成令牌
            
            let usr = facade.GetObject(EntityType.User, sofar.msg.domainId, IndexType.Domain);
            if (!!usr) {//老用户登录
                usr.socket = sofar.socket; //更新通讯句柄
                usr.userip = sofar.msg.userip;
                sofar.socket.user = usr;

                usr.baseMgr.info.UnsetStatus(UserStatus.isNewbie, false);
                if (!!usr.socket && usr.socket != sofar.socket) {
                    //禁止多点登录
                    sofar.facade.notifyEvent('socket.userKick', {sid:usr.socket});
                }
            }
            else {//新玩家注册
                let appId = '';												    //应用ID    
                let serverId = '';												//服务器ID

                let oemInfo = sofar.msg.oemInfo;
                if (oemInfo.appId) {
                    appId = oemInfo.appId;
                }
                if (oemInfo.serverId) {
                    serverId = oemInfo.serverId;
                }

                let profile = await facade.current.control[sofar.msg.oemInfo.domain].getProfile(oemInfo);
                usr = await facade.GetMapping(EntityType.User).Create(profile.nickname, oemInfo.domain, oemInfo.openid);
                if (!!usr) {
                    usr.socket = sofar.socket; //更新通讯句柄
                    usr.userip = sofar.msg.userip;
                    sofar.socket.user = usr;

                    //写入账号信息
                    usr.WriteUserInfo(appId, serverId, CommonFunc.now(), oemInfo.token);
                    
                    Object.keys(profile).map(key=>{
                        usr.baseMgr.info.setAttr(key, profile[key]);
                    });
                    sofar.facade.notifyEvent('user.newAttr', {user: usr, attr:[{type:'uid', value:usr.id}, {type:'name', value:usr.name}]});
                    sofar.facade.notifyEvent('user.afterRegister', {user:usr});
                }
            }

            if (!!usr) {
                sofar.facade.notifyEvent('user.afterLogin', {user:usr, objData:sofar.msg});//发送"登录后"事件
                usr.sign = sofar.msg.oemInfo.token;         //记录登录令牌
                usr.time = CommonFunc.now();                //记录标识令牌有效期的时间戳
                facade.GetMapping(EntityType.User).addId([usr.sign, usr.id],IndexType.Token); //添加一定有效期的令牌类型的反向索引
            }
        }

        if (!sofar.socket.user) {//未通过身份校验
            sofar.fn({ code: ReturnCode.userIllegal });
            sofar.recy = false;
        }
        else {
            //console.log(`鉴权成功, OpenId/Token: ${sofar.msg.oemInfo.openid}/${sofar.msg.oemInfo.token}`);
            //分发用户上行报文的消息，可以借此执行一些刷新操作
            sofar.facade.notifyEvent('user.packetIn', {user: sofar.socket.user});
        }
    }
    catch (e) {
        console.log(e);
        sofar.fn({ code: ReturnCode.illegalData });
        sofar.recy = false;
    }
}

module.exports.handle = handle;
