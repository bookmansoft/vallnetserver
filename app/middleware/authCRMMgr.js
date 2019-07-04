let facade = require('gamecloud')
let {MiddlewareParam, ReturnCode, EntityType, IndexType, UserStatus} = facade.const
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
        //根据访问令牌(oemInfo.token)进行鉴权, 直接获得用于业务操作的用户对象
        //令牌在签发后两个小时内有效，如果失效，将重新进行身份认证
        if(!sofar.socket.user) {
            sofar.socket.user = await sofar.facade.GetObject(EntityType.User, sofar.msg.oemInfo.token, IndexType.Token);
        }
        
        if (!sofar.socket.user) {
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
            } else if(!!unionid) {//新玩家注册
                let profile = await sofar.facade.control[domainType].getProfile(sofar.msg.oemInfo);
                if(!profile.openid || !profile.openkey) { //用户名和用户密码是必填项
                    sofar.fn({ code: ReturnCode.authThirdPartFailed });
                    sofar.recy = false;
                    return;
                }

                usr = await sofar.facade.GetMapping(EntityType.User).Create(
                    profile.nickname, 
                    sofar.msg.oemInfo.domain, 
                    unionid, 
                    true,/*指示跳过负载均衡相关的预注册检测*/
                );
                if (!!usr) {
                    usr.socket = sofar.socket; //更新通讯句柄
                    usr.userip = sofar.msg.userip;
                    sofar.socket.user = usr;

                    Object.keys(profile).map(key=>{
                        usr.baseMgr.info.setAttr(key, profile[key]);
                    });

                    //第一个注册的用户自动成为超级管理员
                    if(sofar.facade.GetMapping(EntityType.User).total == 1) {
                        usr.baseMgr.info.setAttr('currentAuthority', ['admin', 'user']);
                    } else {
                        usr.baseMgr.info.setAttr('currentAuthority', ['user']);
                    }

                    sofar.facade.notifyEvent('user.newAttr', {user: usr, attr:[{type:'uid', value:usr.id}, {type:'name', value:usr.name}]});
                    sofar.facade.service.mail.send({
                        addr: usr.openid, 
                        subject:'Congratulations', 
                        content:'You have registered successfully', 
                        html:'<b>Congratulations!</b>You have registered successfully, Visit <a href="www.vallnet.cn">Vallnet</a> for more info.'
                    });

                    //在用户创建成功后，绑定CID
                    sofar.facade.notifyEvent('user.bindCid', {user: usr, params:{}});
                }
            }

            if (!!usr) {
                usr.sign = sofar.msg.oemInfo.token;         //记录登录令牌
                usr.time = CommonFunc.now();                //记录标识令牌有效期的时间戳
                sofar.facade.GetMapping(EntityType.User).addId([usr.sign, usr.id],IndexType.Token);   //添加一定有效期的令牌类型的反向索引
                if(!!usr.baseMgr.info.getAttr('phone')) {
                    sofar.facade.GetMapping(EntityType.User).addId([usr.baseMgr.info.getAttr('phone'), usr.id], IndexType.Phone);
                }
            }
        }

        if (!sofar.socket.user) {//未通过身份校验
            sofar.fn({ code: ReturnCode.userIllegal });
            sofar.recy = false;
        }
        else {
            console.log(`鉴权成功: ${sofar.msg.domainId}`);
        }
    }
    catch (e) {
        console.log(e);
        sofar.fn({ code: ReturnCode.illegalData });
        sofar.recy = false;
    }
}

module.exports.handle = handle;
