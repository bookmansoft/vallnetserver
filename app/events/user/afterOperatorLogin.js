/**
 * Created by liub on 2017-05-26.
 */
let facade = require('gamecloud')
let {EntityType, IndexType, NotifyType, ActionExecuteType, UserStatus,em_Condition_Type} = facade.const
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息

/**
 * 用户登录后，用来执行一些后续操作
 * @note 事件处理函数，this则由外部注入并指向上下文相关的节点对象
 * @param data
 */
function handle(data){
    try {
        data.user.loginTime = facade.util.now(); //记录登录时间

        data.curTime = new Date();//记录当前时间，为后续流程提供统一的时间标尺
    
        //记录用户登录行为
        if(data.user.getActionMgr().Execute(ActionExecuteType.AE_Login, 1, true)){
            //记录累计登录
            this.notifyEvent('user.task', {user:data.user, data:{type:em_Condition_Type.totalLogin, value:1}});
            if(Date.parse(data.curTime)/1000 - Date.parse(d2)/1000 < 3600*48){
                //记录连续登录
                this.notifyEvent('user.task', {user:data.user, data:{type:em_Condition_Type.loginContinue, value:1}});
            }
        }

        data.user.baseMgr.info.SetStatus(UserStatus.online, false);

        //检测操作员CID是否已经正确设置
        let cid = data.user.baseMgr.info.getAttr('cid');
        if(!cid) {
            if(this.options.master.includes(data.user.openid)) {
                data.user.baseMgr.info.setAttr('cid', remoteSetup.cid);         //记录为管理员分配的终端编号
                data.user.baseMgr.info.setAttr('token', remoteSetup.token);     //记录为管理员分配的终端令牌，注意不是登录CRM的令牌
            } else {
                let remote = this.service.RemoteNode.conn(`auth2step.${this.options.master[0]}`);
                remote.execute('sys.createAuthToken', [data.user.domainId]).then(retAuth => {
                    let cid = retAuth.result[0].cid;
                    let {aeskey, aesiv} = remote.getAes();
                    let token = remote.decrypt(aeskey, aesiv, retAuth.result[0].encry);
                
                    data.user.baseMgr.info.setAttr('cid', cid);
                    data.user.baseMgr.info.setAttr('token', token);
                }).catch(e => {
                    console.log(e);
                });
            }
        }

        //如果登记了手机号码，添加手机号码反向索引
        if(!!data.user.baseMgr.info.getAttr('phone')) {
            this.GetMapping(EntityType.User).addId([data.user.baseMgr.info.getAttr('phone'), data.user.id], IndexType.Phone);
        }

        //test only
        data.user.notify({type: NotifyType.test, info: {content: 'hello world'}});
    }
    catch(e){
        console.error(e);
    }
}

module.exports.handle = handle;