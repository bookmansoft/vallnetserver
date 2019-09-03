/**
 * Updated by Administrator on 2017-11-29.
 */
let facade = require('gamecloud')
let CoreOfBase = facade.CoreOfBase
let {ReturnCode} = facade.const
let socketClient = require('socket.io-client')

/**
 * 签证服务器对应的门面类
 */
class CoreOfAuth extends CoreOfBase 
{
    constructor($env){
        super($env);

        //中间件设定 - 注意不要覆盖父类构造函数已经做出的设定
        this.middlewareSetting = this.middlewareSetting || {};
        this.middlewareSetting.default = ['parseParams', 'commonHandle', 'afterHandle'];
        
        this.loadingList = [];
    }

    /**
     * 映射自己的服务器类型数组，提供给核心类的类工厂使用
     * @returns {Array}
     */
    static get mapping() {
        this.$mapping = ['Auth'];
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

        //启动对外网络服务
        this.StartSocketServer(app);
        
        //建立内部RPC机制
        this.initConnector("Index", 1);
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
                if(msg.code == ReturnCode.Success) {
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

exports = module.exports = CoreOfAuth;