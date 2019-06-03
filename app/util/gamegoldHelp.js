//引入工具包
const toolkit = require('gamerpc')
let remoteSetup = require('./gamegold')
const _assert = require('assert');
let facade = require('gamecloud')
let {ReturnCode, EntityType, NotifyType, IndexType} = facade.const

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
        // await this.remote.setmode(this.remote.CommMode.ws).login()
        this.remote.setFetch(require('node-fetch'))  
        // await this.remote.join()
        //监听
        // await this.subscribe()
    }

    //消息订阅
    static async subscribe() {
        //prop/receive: 收到新的道具，或者已有道具发生变更
        this.remote = await this.remote.watch(msg => {
            console.log('prop/receive', msg);
            this.notfiyToClient(msg.account, 'prop/receive', msg)
        }, 'prop/receive');

        /*
        this.remote = await this.remote.watch(msg => {
            console.log('notify/receive', msg);
        }, 'notify/receive');
        */
        //子账户余额变动通知
        this.remote = await this.remote.watch(msg => {
            console.log('balance.account.client', msg.accountName);
            this.notfiyToClient(msg.accountName, 'balance.account.client', msg)
        }, 'balance.account.client')

        //用户发布的道具被成功拍卖后的通知
        this.remote = await this.remote.watch(msg => {
            console.log('prop/auction', msg);
            this.notfiyToClient(msg.account, 'prop/auction', msg)
        }, 'prop.auction')

        //用户执行 order.pay 之后，CP特约节点发起到账通知消息
        this.remote = await this.remote.watch(msg => {
            console.log('order.pay', msg);
        }, 'order.pay')

        let ret = await this.remote.execute('subscribe', ['prop/receive', 'balance.account.client', 'prop/auction', 'order.pay']);
        console.log(ret)

    }
    
    static notfiyToClient(uid, msgType, msg) {
        let domain = 'tx.IOS'
        let domainId = `${domain}.${uid}`
        let user = facade.GetObject(EntityType.User, domainId, IndexType.Domain);
        if(!!user) {
            user.notify({type: NotifyType.test, info: {
                msgType: msgType,
                msg: msg
            }});
        }

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

    static revHex(data) {
        this.assert(typeof data === 'string');
        this.assert(data.length > 0);
        this.assert(data.length % 2 === 0);
      
        let out = '';
      
        for (let i = 0; i < data.length; i += 2)
          out = data.slice(i, i + 2) + out;
      
        return out;
    }  

    static assert(value, message) {
        if (!value) {
          throw new assert.AssertionError({
            message,
            actual: value,
            expected: true,
            operator: '==',
            stackStartFunction: assert
          });
        }
    }

}

module.exports = gamegoldHelp;