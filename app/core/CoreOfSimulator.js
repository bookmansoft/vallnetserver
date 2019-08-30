let facade = require('gamecloud');

/**
 * 资源节点类
 */
class CoreOfSimulator extends facade.CoreOfBase {
    /**
     * 构造函数
     * @param {*} $env 
     */
    constructor($env){
        super($env);

        this.init();
    }

    init() {
        this.orderMap = new Map();
        this.cpToken = new Map();
        this.userMap = new Map();
    }

    /**
     * 节点类型定义函数 - 映射自己的服务器类型数组，提供给核心类的类工厂使用
     */
    static get mapping() {
        this.$mapping = ['Simulator'];
        return this.$mapping;
    }

    /**
     * 启动函数
     * @param {*} app express 对象
     */
    async Start(app) {
        super.Start(app);

        //启动网络监听服务
        let hrv = this.options.UrlHead == "https" ? require(this.options.UrlHead).createServer(this.credentials, app) : require(this.options.UrlHead).createServer(app);
        hrv.listen(this.options.webserver.port, this.options.webserver.host, () => {
            console.log(`模拟器在端口 ${this.options.webserver.port} 上准备就绪`);
        });

        this.autoTaskMgr.addCommonMonitor(()=>{
            this.CheckOrder();
        }, 5000);
    }

    /**
     * 对订单进行检测，已确认订单进行处理后删除，未确认订单如超时则主动查询状态
     */
    async CheckOrder() {
        for(let [sn, data] of this.orderMap) {
            if(data.finish) {
                continue;
            }

            if(data.confirm >= confirmNum) {
                //调用prop.order 订购该道具，即创建道具并发送到指定地址
                let paramArray = [
                    data.cid,
                    data.oid,
                    parseInt(data.sum * 0.5),//统一当成含金量50%处理
                    data.addr,
                ];
                let ret = await this.service.gamegoldHelper.execute('prop.order', paramArray);
                if(ret.code == 0) {
                    //标记为已处理
                    data.finish = true;
                }
            } else {
                if(Date.now()/1000 - data.time > 10) {
                    let ret = await this.service.gamegoldHelper.execute('order.query', [data.cid, sn]);
                    /*
                        {
                            "oper": "pay",
                            "cid": "0be0f210-c367-11e9-88a0-976cfe77cf12",
                            "uid": "u001",
                            "sn": "s00100000000000000000000000000000000",
                            "sum": 50000,
                            "addr": "tb1q6x8tcusuhyd4f48edzvsngzfs9gc2x204gmdvy",
                            "gaddr": null,
                            "publish": 112,
                            "height": 113,
                            "hash": "85829a262e627788e018e6fe369f9cfd30da9d63085078cf87d2f886d6975cbf",
                            "confirm": 2
                        }                        
                    */                        
                    if(ret.code == 0 && !!ret.result) {
                        Object.keys(ret.result).map(key=>{
                            data[key] = ret.result[key];
                        });
                    }
                }
            }
        }
    }
}

//订单执行前需要达到的确认数
const confirmNum = 0;

exports = module.exports = CoreOfSimulator;