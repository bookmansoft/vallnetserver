//引入工具包
const toolkit = require('gamegoldtoolkit')
let remoteSetup = require('./gamegold')

class gamegoldHelp {
     /**
     * 构造函数
     * @param {*}  监控对象ID
     */
    constructor(){

    }
    static async init() {
        this.remote = new toolkit.conn();
        //兼容性设置，提供模拟浏览器环境中的 fetch 函数
        this.remote.setup(remoteSetup);
        await this.remote.setmode(this.remote.CommMode.ws).login()
        //this.remote.setFetch(require('node-fetch'))  
        await this.remote.join()
    }

    static async execute(method, params) {
        let ret = await this.remote.execute(method, params)
        return ret
    }

    static watchNotify(cb, etype = '0') {
        this.remote.watchNotify(cb, etype)
    }

    static watch(cb, etype = '0') {
        this.remote.watch(cb, etype)
    }

    static async orderPay(cid, user_id, sn, price, account) {
        let ret = await this.remote.execute('order.pay', [
            cid, //game_id
            user_id, //user_id
            sn, //order_sn订单编号
            price, //order_sum订单金额
            account  //指定结算的钱包账户，一般为微信用户的openid
          ]);
        console.log(ret);
        if(ret == null) {
            return {errcode: 'faile', errmsg: 'pay error'};
        } else {
            return {errcode: 'success', errmsg: 'orderpay:ok', ret: ret};
        }
    }

}

module.exports = gamegoldHelp;