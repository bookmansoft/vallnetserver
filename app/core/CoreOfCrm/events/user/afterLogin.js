/**
 * Created by liub on 2017-05-26.
 */
let facade = require('gamecloud')
let {EntityType, IndexType, UserStatus} = facade.const
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息

/**
 * 用户登录后，用来执行一些后续操作
 * @note 事件处理函数，this则由外部注入并指向上下文相关的节点对象
 * @param data
 */
async function handle(data){
    try {
        data.user.loginTime = facade.util.now(); //记录登录时间

        data.curTime = new Date();//记录当前时间，为后续流程提供统一的时间标尺
    
        data.user.baseMgr.info.SetStatus(UserStatus.online, false);

        //检测操作员CID是否已经正确设置
        let cid = data.user.cid;
        if(!cid) {
            await this.notifyEvent('user.fetchCid', {user:data.user});
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
            let rt = await remote.execute('balance.all', [account]);
            if(!!rt && rt.code == 0) {
                data.user.baseMgr.info.setAttr('balance', rt.result.confirmed);
            }

            //查询操作员名下所有已注册CP
            /** rt.result.list: [{
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
            rt = await remote.execute('cp.mine', [null, account]);
            if(!!rt && rt.code == 0) {
                //将操作员名下已注册、未入库的CP条目写入数据库
                let cids = this.GetMapping(EntityType.Cp).groupOf().excludeProperty(rt.result.list.map(it=>it.cid), 'cp_id');
                if(cids.length > 0) {
                    let items = rt.result.list.reduce((sofar, cur)=>{
                        sofar[cur.cid] = cur;
                        return sofar;
                    }, {});

                    for(let cid of cids) {
                        //调整协议字段，满足创建CP接口的需要
                        items[cid].address = items[cid].current.address; 
                        items[cid].account = account;
                        
                        this.notifyEvent('cp.register', {msg:items[cid]});
                    }
                }
            }
        }

        if(!!data.user.baseMgr.info.getAttr('phone')) {
            //如果登记了手机号码，添加手机号码反向索引
            this.GetMapping(EntityType.User).addId([data.user.baseMgr.info.getAttr('phone'), data.user.id], IndexType.Phone);
        }
    } catch(e) {
        console.error(e);
    }
}

module.exports.handle = handle;