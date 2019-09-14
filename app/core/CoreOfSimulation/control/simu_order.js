let facade = require('gamecloud')
let crypto = require('crypto');
let { stringify } = require('../../../util/stringUtil');
let uuid = require('uuid');
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息
const toolkit = require('gamerpc')

/**
 * 游戏提供的对外接口：订单接收处理
 */
class order extends facade.Control
{
    /**
     * 自定义中间件序列
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }
    
    /**
     * 配置URL路由，用户可以直接经由页面访问获取签名数据集
     */
    get router() {
        return [
            [`/mock/:cp_name/${remoteSetup.type}/order/confirm`, 'confirmOrder'],
            [`/mock/:cp_name/${remoteSetup.type}/order/notify`, 'notifyOrder'],
            [`/mock/:cp_name/${remoteSetup.type}/order/add`, 'addOrder'],
        ];
    }

    /**
     * 游戏客户端上行订单，游戏服务端以通告模型处理
     * @param {*} params
     */
    async notifyOrder(params) {
        let user = this.core.userMap[params.uid];
        if(!user) {
            return {code: -1};
        }

        //生成订单。对于以 sys.notify 模式发起的订单，游戏服务器不用承担订单状态监控、主动查询订单状态、再次发起订单支付的义务，简单说就是发射后不管
        let data = {
            cid: params.cid,                  //CP编码
            oid: params.oid,                  //道具原始编码
            price: params.price,              //价格，单位尘
            url: params.url,                  //道具图标URL
            props_name: params.props_name,    //道具名称
            sn: uuid.v1(),                    //订单编号
            addr: user.addr,                  //用户地址
            confirmed: -1,                    //确认数，-1表示尚未被主网确认，而当确认数标定为0时，表示已被主网确认，只是没有上链而已
            time: Date.now()/1000,
        };
        
        //向主网发送消息
        let paramArray = [
            data.addr,
            JSON.stringify(data),
        ];
        let ret = await this.core.service.gamegoldHelper.execute('sys.notify', paramArray);
        if(!!ret) {
            if(ret.code == 0) { //操作成功，本地缓存订单，以便在将来接收到回调时进行必要的比对
                this.core.orderMap.set(data.sn, data);
            }
            return { code: ret.code };
        }

        return { code: -1 };
    }

    /**
     * 钱包提交订单信息，服务端缓存订单、等待回调通知
     * @param {*} params
     */
    async addOrder(params) {
        if(!params.auth) {
            return {code: -1};
        }

        try {
            if(typeof params.auth == 'string') {
                params.auth = JSON.parse(params.auth);
            }
            let user = params.auth;
            if(toolkit.verifyData({
                data: {
                    cid: user.cid,
                    uid: user.uid,
                    time: user.time,
                    addr: user.addr,
                    pubkey: user.pubkey,
                },
                sig: user.sig
            })) {
                //缓存认证报文
                this.core.userMap[user.uid] = user;
            } else {
                return {code: -1};
            }

            //生成订单。对于以 sys.notify 模式发起的订单，游戏服务器不用承担订单状态监控、主动查询订单状态、再次发起订单支付的义务，简单说就是发射后不管
            let data = {
                cid: params.cid,                  //CP编码
                oid: params.oid,                  //道具原始编码
                price: params.price,              //价格，单位尘
                url: params.url,                  //道具图标URL
                props_name: params.props_name,    //道具名称
                sn: params.sn,                    //订单编号
                addr: user.addr,                  //用户地址
                confirmed: -1,                    //确认数，-1表示尚未被主网确认，而当确认数标定为0时，表示已被主网确认，只是没有上链而已
                time: Date.now()/1000,
            };
            this.core.orderMap.set(data.sn, data);
            
            return { code: 0 };
        } catch(e) {
        }

        return { code: -1 };
    }
    
    /**
     * 订单支付回调接口，处理来自主网的订单支付确认通知
     * @param {*} params
     */
    async confirmOrder(params) {
        try {
            //确认已获取正确签名密钥
            if(!this.core.cpToken[params.data.cid]) {
                let retAuth = await this.core.service.gamegoldHelper.execute('sys.createAuthToken', [params.data.cid]);
                if(retAuth.code == 0) {
                    let {aeskey, aesiv} = this.core.service.gamegoldHelper.remote.getAes();
                    this.core.cpToken[params.data.cid] = this.core.service.gamegoldHelper.remote.decrypt(aeskey, aesiv, retAuth.result[0].encry);
                } else {
                    return { code: 0 };
                }
            }
    
            //校验签名
            let dstr = stringify(params.data);
            let sim = crypto.createHmac('sha256', dstr).update(this.core.cpToken[params.data.cid]).digest('hex');
            if (sim != params.sig) {
                return { code: 0 };
            }

            //更新订单信息
            params.data.time = Date.now()/1000;

            let theOrder = this.core.orderMap.get(params.data.sn) || {};
            Object.keys(params.data).map(key=>{
                theOrder[key] = params.data[key];
            });

            this.core.orderMap.set(theOrder.sn, theOrder);

            return { code: 0 };
        } catch (e) {
            console.error(e);
            return { code: 0 };
        }
    }
}

exports = module.exports = order;
