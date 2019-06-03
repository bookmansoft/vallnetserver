let facade = require('gamecloud')
let {ReturnCode, EntityType, NotifyType, IndexType} = facade.const
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息
const toolkit = require('gamegoldtoolkit');//引入工具包

class Helper {
     /**
     * 构造函数
     * @param {*}  监控对象ID
     */
    constructor(){
        this.remote = new toolkit.conn();
        //兼容性设置，提供模拟浏览器环境中的 fetch 函数
        this.remote.setup(remoteSetup);
        this.remote.setFetch(require('node-fetch'))  
    }

    /**
     * 将连接器设置为长连模式，同时完成登录、消息订阅等操作
     */
    setlongpoll() {
        this.remote.setmode(this.remote.CommMode.ws)
    }

    /**
     * 当重连发生时，自动调用该方法
     */
    async reconnect() {
        super();
        
        await this.remote.login();
        await this.remote.join();
        await this.subscribe();
    }

    //消息订阅
    async subscribe() {
        //prop/receive: 收到新的道具，或者已有道具发生变更
        this.remote.watch(msg => {
            console.log('prop/receive', msg);
            this.notfiyToClient(msg.account, 'prop/receive', msg)
        }, 'prop/receive');

        /*
        this.remote.watch(msg => {
            console.log('notify/receive', msg);
        }, 'notify/receive');
        */

        //子账户余额变动通知
        this.remote.watch(msg => {
            console.log('balance.account.client', msg.accountName);
            this.notfiyToClient(msg.accountName, 'balance.account.client', msg)
        }, 'balance.account.client')

        //用户发布的道具被成功拍卖后的通知
        this.remote.watch(msg => {
            console.log('prop/auction', msg);
            this.notfiyToClient(msg.account, 'prop/auction', msg)
        }, 'prop.auction')

        //用户执行 order.pay 之后，CP特约节点发起到账通知消息
        this.remote.watch(msg => {
            console.log('order.pay', msg);
        }, 'order.pay')

        let ret = await this.remote.execute('subscribe', ['prop/receive', 'balance.account.client', 'prop/auction', 'order.pay']);
        console.log(ret)
    }
    
    notfiyToClient(uid, msgType, msg) {
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

    async execute(method, params) {
        let ret = await this.remote.execute(method, params)
        return ret
    }

    watchNotify(cb, etype = '0') {
        this.remote.watchNotify(cb, etype)
    }

    watch(cb, etype = '0') {
        this.remote.watch(cb, etype)
    }

    async orderPay(cid, user_id, sn, price, account) {
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

    revHex(data) {
        this.assert(typeof data === 'string');
        this.assert(data.length > 0);
        this.assert(data.length % 2 === 0);
      
        let out = '';
      
        for (let i = 0; i < data.length; i += 2)
          out = data.slice(i, i + 2) + out;
      
        return out;
    }  

    assert(value, message) {
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

let conn = new Helper();
let longpoll = new Helper();
longpoll.setlongpoll();

module.exports = {
    longpoll: longpoll,
    gamegoldHelp: conn,
};