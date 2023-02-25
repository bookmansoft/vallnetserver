let facade = require('gamecloud')
let {MiddlewareParam, ReturnCode, EntityType, IndexType, UserStatus} = facade.const
let CommonFunc = facade.util
let extendObj = facade.tools.extend

/**
 * 用户认证鉴权中间件
 * @param {MiddlewareParam} sofar
 */
async function handle(sofar) {
    try {
        //根据访问令牌(oemInfo.token)进行鉴权, 直接获得用于业务操作的用户对象
        //令牌在签发后两个小时内有效，如果失效，将重新进行身份认证
        if(!sofar.socket.user){
            sofar.socket.user = await sofar.facade.GetObject(EntityType.User, sofar.msg.oemInfo.token, IndexType.Token);
        }
        
        if (!sofar.socket.user || sofar.msg.func == "login" || sofar.msg.func == "1000"/*如果是login则强制重新验证*/) {
            //针对各类第三方平台，执行一些必要的验证流程：
            let unionid = '';
            let domainType = sofar.msg.oemInfo.domain.split('.')[0];
            switch(domainType) {
                default: {
                    try {
                        //调用登录域相关的认证过程，生成用户证书
                        let data = await sofar.facade.control[domainType].check(sofar.msg.oemInfo);
                        //将证书内容复制到用户原始信息中，如果条目有重复则直接覆盖
                        extendObj(sofar.msg.oemInfo, data);
                        
                        //对于共享公众号，要判断是否存在 unionid
                        unionid = !!sofar.msg.oemInfo.unionid ? sofar.msg.oemInfo.unionid : sofar.msg.oemInfo.openid;

                        sofar.msg.domainId = `${sofar.msg.oemInfo.domain}.${unionid}`;
                    } catch(e) {
                        sofar.fn({ code: ReturnCode.authThirdPartFailed });
                        sofar.recy = false;
                        return;
                    }
                    break;
                }
            }

            sofar.msg.oemInfo.token = facade.util.sign({ did: sofar.msg.domainId }, sofar.facade.options.game_secret); //为用户生成令牌
            
            let usr = sofar.facade.GetObject(EntityType.User, sofar.msg.domainId, IndexType.Domain);
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
            else if(!!unionid) {//新玩家注册
                let profile = await sofar.facade.control[domainType].getProfile(sofar.msg.oemInfo);
                usr = await sofar.facade.GetMapping(EntityType.User).Create(profile.nickname, sofar.msg.oemInfo.domain, unionid);
                if (!!usr) {
                    usr.socket = sofar.socket; //更新通讯句柄
                    usr.userip = sofar.msg.userip;
                    sofar.socket.user = usr;

                    Object.keys(profile).map(key=>{
                        usr.baseMgr.info.SetRecord(key, profile[key]);
                    });
                    sofar.facade.notifyEvent('user.newAttr', {user: usr, attr:[{type:'uid', value:usr.id}, {type:'name', value:usr.name}]});
                    sofar.facade.notifyEvent('user.afterRegister', {user:usr});

                    //在用户创建成功后，再绑定手机号码
                    if(!!sofar.msg.oemInfo.address && !!sofar.msg.oemInfo.addrType) {
                        sofar.facade.notifyEvent('user.bind', {user: usr, params:{addrType: sofar.msg.oemInfo.addrType, address: sofar.msg.oemInfo.address}});
                    }
                }
            }

            if (!!usr) {
                usr.sign = sofar.msg.oemInfo.token;         //记录登录令牌
                usr.time = CommonFunc.now();                //记录标识令牌有效期的时间戳

                if(!!usr.baseMgr.info.GetRecord('phone')) {
                    sofar.facade.GetMapping(EntityType.User).addId([usr.baseMgr.info.GetRecord('phone'), usr.id], IndexType.Phone);
                }

                //TODO 暂时封存:检测并生成专用账户、专用地址
                // if(!usr.baseMgr.info.getAttr('acid')) {
                //     try {
                //         let rt = await sofar.facade.service.gamegoldHelper.execute('account.create', [{name: usr.account}]);
                //         if(rt.code == 0) {
                //             usr.baseMgr.info.setAttr('acaddr', rt.result.receiveAddress);
                //             usr.baseMgr.info.setAttr('acid', rt.result.accountIndex); //记录用户帐户索引值备查
                //         }
                //     } catch(e) {
                //         console.log(`create account ${usr.domainId}`, e.message);
                //     }
                // }

                sofar.facade.GetMapping(EntityType.User).addId([usr.sign, usr.id],IndexType.Token);   //添加一定有效期的令牌类型的反向索引
                if(!!usr.baseMgr.info.GetRecord('phone')) {
                    sofar.facade.GetMapping(EntityType.User).addId([usr.baseMgr.info.GetRecord('phone'), usr.id], IndexType.Phone);
                }

                //TODO 暂时封存:查询账户余额, 这样用户登录后就能看到最新的余额信息
                // let rt = await sofar.facade.service.gamegoldHelper.execute('balance.all', [usr.account]);
                // if(!!rt && rt.code == 0) {
                //     usr.baseMgr.info.setAttr('confirmed', rt.result.confirmed);
                //     usr.baseMgr.info.setAttr('unconfirmed', rt.result.unconfirmed - rt.result.locked);
                // } else {
                    usr.baseMgr.info.setAttr('confirmed', 0);
                    usr.baseMgr.info.setAttr('unconfirmed', 0);
                // }

                //触发并实时执行"登录后"事件, 注意将事件触发置于此可以：1. 用户持密码或两节点登录时触发 2. 用户持 token 登录时不触发，避免了频繁触发带来的性能问题
                sofar.facade.notifyEvent('user.afterLogin', {user:usr, objData:sofar.msg});
            }
        }

        if (!sofar.socket.user) {//未通过身份校验
            sofar.fn({ code: ReturnCode.userIllegal });
            sofar.recy = false;
        } else {
            console.log(`鉴权成功: ${sofar.socket.user.domainId}`);

            sofar.socket.user.socket = sofar.socket;        //更新通讯句柄
            sofar.socket.user.userip = sofar.msg.userip;    //更新IP地址

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
