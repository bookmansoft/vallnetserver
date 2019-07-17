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
                if(usr.baseMgr.info.getAttr('state') == 0) { //检测是否被禁用
                    sofar.fn({ code: ReturnCode.authThirdPartFailed });
                    sofar.recy = false;
                    return;
                }

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
                        if(key == 'openkey') {
                            usr.SetAttr('password', profile[key]);
                        } else if(key == 'openid' || key == 'unionid' || key == 'uuid') { //这些属性不必存储
                        } else {
                            usr.baseMgr.info.setAttr(key, profile[key]);
                        }
                    });

                    sofar.facade.notifyEvent('user.newAttr', {user: usr, attr:[{type:'uid', value:usr.id}, {type:'name', value:usr.name}]});
                    sofar.facade.service.mail.send({
                        addr: usr.openid, 
                        subject:'Congratulations', 
                        content:'You have registered successfully', 
                        html:'<b>Congratulations!</b>You have registered successfully, Visit <a href="www.vallnet.cn">Vallnet</a> for more info.'
                    });

                    usr.Save();
                }
            }

            if (!!usr) {
                usr.sign = sofar.msg.oemInfo.token;     //记录登录令牌
                usr.time = CommonFunc.now();           //记录标识令牌有效期的时间戳
                sofar.facade.GetMapping(EntityType.User).addId([usr.sign, usr.id], IndexType.Token);  //添加一定有效期的令牌类型的反向索引
        
                //同步完成事件的调用
                await sofar.facade.notifyEvent('user.afterOperatorLogin', {user:usr, msg:sofar.msg}); //发送"登录后"事件. 注意使用 token 登录不会触发该事件
            }
        }

        if (!sofar.socket.user) {//未通过身份校验
            sofar.fn({ code: ReturnCode.userIllegal });
            sofar.recy = false;
        }
        else {
            console.log(`鉴权成功: ${sofar.socket.user.domainId}`);
        }
    }
    catch (e) {
        console.log(e);
        sofar.fn({ code: ReturnCode.illegalData });
        sofar.recy = false;
    }
}

module.exports.handle = handle;
