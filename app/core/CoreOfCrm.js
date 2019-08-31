/**
 * Updated by Administrator on 2017-11-29.
 */
let facade = require('gamecloud')
let CoreOfBase = facade.CoreOfBase
let {serverType, EntityType, ReturnCode, CommMode} = facade.const
let socketClient = require('socket.io-client')

/**
 * CRM管理后台对应的门面类
 */
class CoreOfCrm extends CoreOfBase
{
    constructor($env){
        super($env);

        this.loadingList = [
            EntityType.User,            //载入用户
            EntityType.Mail,            //载入邮件
            EntityType.BuyLog           //载入消费日志
        ];
    }

    async loadModel() {
        super.loadModel();
    }

    /**
     * 映射自己的服务器类型数组，提供给核心类的类工厂使用
     * @returns {Array}
     */
    static get mapping() {
        this.$mapping = ['CRM'];
        return this.$mapping;
    }

    /**
     * 自启函数
     * @param {*} app 
     */
    async Start(app){
        super.Start(app);

        //载入路由配置
        Object.keys(this.$router).map(id=>{
            app.use("/", this.makeRouter(id, this.$router[id]));
        });

        //加载持久化层的数据
        console.time('Load CRM Db');

        Promise.all(this.loadingList.map(it=>this.GetMapping(it).loadAll())).then(()=>{
            console.timeEnd('Load CRM Db');
            console.log(`${this.options.serverType}.${this.options.serverId}: 数据载入完成，准备启动网络服务...`);

            //启动对外网络服务
            this.StartSocketServer(app);
            
            //建立内部RPC机制
            this.initConnector("Index", 1);
        }).catch(e=>{
            throw e;
        });

        //todo 定期刷新凭证信息, 形成历史快照
        // this.autoTaskMgr.addCommonMonitor(() => {
        //     this.notifyEvent('stock.refresh', {msg:{}});
        //     return false;
        // }, 60000);
    }

    /**
     * 当前总注册量
     * @returns {Number}
     */
    get numOfTotal(){
        return this.GetMapping(EntityType.User).total;
    }

    /**
     * 创建进行远程访问的客户端
     * @param stype     //远程服务器类型
     * @param sid       //远程服务器编号
     */
    initConnector(stype, sid){
        if(!!this.remoting){
            this.remoting.removeAllListeners();
            this.remoting.disconnect();
            this.remoting = null;
        }

        //注意：访问的是目标服务器的mapping（外部映射）地址
        this.remoting = socketClient(`${this.options.UrlHead}://${this.serversInfo[stype][sid].webserver.mapping}:${this.serversInfo[stype][sid].webserver.port}`, {'force new connection': true})
        .on('req', (msg, fn) => {//监听JSONP请求 
            this.onSocketReq(this.remoting, msg, fn).catch(e=>{console.log(e);});
        })
        .on('notify', msg => {//监听JSONP请求
            this.onSocketReq(this.remoting, msg, null).catch(e=>{console.log(e);});
        })
        .on('disconnect', ()=>{//断线重连
            console.log(`${this.options.serverType}.${this.options.serverId} disconnect`);
            this.remoting.stamp = (new Date()).valueOf();
            this.remoting.user = null;
            this.remoting.needConnect = true;
            setTimeout(()=>{
                if(this.remoting.needConnect){
                    this.remoting.needConnect = false;
                    this.remoting.connect();
                }
            }, 1500);
        })
        .on('connect', ()=>{//向Index Server汇报自身的身份
            console.log(`${this.options.serverType}.${this.options.serverId} connected`);
            
            this.remoteCall('serverLogin', {}, msg => {
                if(msg.code == ReturnCode.Success){
                    console.log(`${this.options.serverType}.${this.options.serverId} logined`);
                    this.remoting.stamp = (new Date()).valueOf();
                    this.remoting.user = {stype: this.options.serverType, sid: this.options.serverId, socket: this.remoting};
                }
                else{
                    console.log(`${this.options.serverType}.${this.options.serverId} failed login: ${msg.code}`);
                }
            })
        });
    }
}

exports = module.exports = CoreOfCrm;