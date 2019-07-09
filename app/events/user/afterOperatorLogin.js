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
                let remote = this.service.RemoteNode.conn(`auth2step.${this.options.master[0]}`); //注意这里使用了管理员专属连接器
                remote.execute('sys.createAuthToken', [data.user.domainId]).then(retAuth => {
                    let cid = retAuth.result[0].cid;
                    let {aeskey, aesiv} = remote.getAes();
                    let token = remote.decrypt(aeskey, aesiv, retAuth.result[0].encry);
                
                    data.user.baseMgr.info.setAttr('cid', cid);
                    data.user.baseMgr.info.setAttr('token', token);

                    //建立终端授权号反向索引
                    this.GetMapping(EntityType.User).addId([data.user.baseMgr.info.getAttr('cid'), data.user.id], IndexType.Terminal);
                }).catch(e => {
                    console.log(e);
                });
            }
        } else {
            //建立终端授权号反向索引
            this.GetMapping(EntityType.User).addId([data.user.baseMgr.info.getAttr('cid'), data.user.id], IndexType.Terminal);

            //获取操作员专属连接器
            let remote = this.service.RemoteNode.conn(data.user.domainId);

            let account = data.user.baseMgr.info.getAttr('cid');
            if(this.options.master.includes(data.user.openid)) {
                account = 'default';
            }
            
            //查询操作员账户余额
            remote.execute('balance.all', [account]).then(ret => {
                data.user.baseMgr.info.setAttr('balance', ret.result.confirmed);
            });

            //查询操作员名下所有已注册CP, 逐条插入数据库
            remote.execute('cp.mine', []).then(ret => {
                /** ret.list: {
                    "cid",
                    "name",
                    "url",
                    "ip",
                    "cls",
                    "grate",
                    "current": { "hash", "index", "address" },
                    "stock": { "hHeight", "hSum", "hPrice", "hBonus", "hAds", "sum", "price", "height" },
                    "height",
                    "status"
                }
                */
                ret.list.map(async item => {
                    await this.GetMapping(TableType.Cp).Create(
                        item.cid, //item.cp_id,
                        item.name,//item.cp_name,
                        '', //item.cp_text,
                        item.url, //item.cp_url,
                        item.current.address, //item.wallet_addr,
                        item.cls, //item.cp_type,
                        '', //item.develop_name,
                        '', //item.cp_desc,
                        '', //item.cp_version,
                        '', //item.picture_url,
                        '', //item.cp_state,
                        Math.floor(Date.now()/1000), //item.publish_time,
                        Math.floor(Date.now()/1000), //item.update_time,
                        '', //item.update_content,
                        item.grate, //item.invite_share,
                        data.user.id, //item.operator_id,
                    );
                });                
            });
        }

        if(!!data.user.baseMgr.info.getAttr('phone')) {
            //如果登记了手机号码，添加手机号码反向索引
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