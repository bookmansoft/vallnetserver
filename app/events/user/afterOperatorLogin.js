/**
 * Created by liub on 2017-05-26.
 */
let facade = require('gamecloud')
let {EntityType, IndexType, NotifyType, ActionExecuteType, UserStatus,em_Condition_Type, TableType} = facade.const
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
        let cid = data.user.cid;
        if(!cid) {
            if(this.options.master.includes(data.user.openid)) {
                data.user.cid = remoteSetup.cid;         //记录为管理员分配的终端编号
                data.user.baseMgr.info.setAttr('token', remoteSetup.token);     //记录为管理员分配的终端令牌，注意不是登录CRM的令牌
            } else {
                let remote = this.service.RemoteNode.conn(remoteSetup.cid); //注意这里使用了管理员专属连接器
                remote.execute('sys.createAuthToken', [data.user.domainId]).then(retAuth => {
                    let cid = retAuth.result[0].cid;
                    let {aeskey, aesiv} = remote.getAes();
                    let token = remote.decrypt(aeskey, aesiv, retAuth.result[0].encry);
                
                    data.user.cid = cid;
                    data.user.baseMgr.info.setAttr('token', token);

                    //建立终端授权号反向索引
                    this.GetMapping(EntityType.User).addId([data.user.cid, data.user.id], IndexType.Terminal);
                }).catch(e => {
                    console.log(e);
                });
            }
        } else {
            //建立终端授权号反向索引
            this.GetMapping(EntityType.User).addId([data.user.cid, data.user.id], IndexType.Terminal);

            //获取操作员专属连接器
            let remote = this.service.RemoteNode.conn(data.user.cid);

            let account = data.user.cid;
            if(account == remoteSetup.cid) {
                account = 'default';
            }
            
            //查询操作员账户余额
            remote.execute('balance.all', [account]).then(ret => {
                data.user.baseMgr.info.setAttr('balance', ret.result.confirmed);
            });

            //查询操作员名下所有已注册CP
            remote.execute('cp.mine', [null, account]).then(ret => {
                /** ret.result.list: [{
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
                }] */

                if(!!ret && ret.code == 0) {
                    //将操作员名下已注册、未入库的CP条目写入数据库
                    let cids = this.GetMapping(TableType.Cp).groupOf().excludeProperty(ret.result.list.map(it=>it.cid), 'cp_id');
                    if(cids.length > 0) {
                        let items = ret.result.list.reduce((sofar, cur)=>{
                            sofar[cur.cid] = cur;
                            return sofar;
                        }, {});

                        for(let cid of cids) {
                            //调整协议字段，满足创建CP接口的需要
                            items[cid].address = items[cid].current.address; 
                            items[cid].account = account;
                            
                            this.notifyEvent('crm.cp.register', {msg:items[cid]});
                        }
                    }
                }
            }).catch(e => {
                console.log(e);
            });
        }

        if(!!data.user.baseMgr.info.getAttr('phone')) {
            //如果登记了手机号码，添加手机号码反向索引
            this.GetMapping(EntityType.User).addId([data.user.baseMgr.info.getAttr('phone'), data.user.id], IndexType.Phone);
        }

        //test only: push msg to client
        //data.user.notify({type: NotifyType.test, info: {content: 'hello world'}});
    }
    catch(e){
        console.error(e);
    }
}

module.exports.handle = handle;