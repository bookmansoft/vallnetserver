let fetch = require('node-fetch')
let crypto = require('crypto');
let uuid = require('uuid');
let facade = require('gamecloud')
let toolkit = require('gamerpc')
let { stringify } = require('../../../util/stringUtil');
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息
let {NotifyType, ReturnCode, UserStatus, PurchaseStatus, EntityType, IndexType} = facade.const

//游戏名称静态配置信息
let cp_name = 'cp_chick';
 
/**
 * 游戏商接入百谷王生态平台必须实现的交互接口
 */
class openapi extends facade.Control
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
            ['/auth360', 'auth360'],                                  //模拟 360 网关下发签名集
            ['/test/ping', 'ping'],                                   //PING测试接口
            ['/pay360', 'pay360'],                                    //360 发货回调路由
            ['/txpay', 'txpay'],                                      //腾讯支付回调路由
            [`/info`, 'getInfo'],                                     //获取游戏基本描述信息
            ['/prop/:id', 'responseProp'],                            //获取指定道具模板信息
            [`/${remoteSetup.type}/myprops/:addr`, 'myProps'],        //获取指定地址上的确权道具
            [`/${remoteSetup.type}/order/confirm`, 'confirmOrder'],   //订单完成回调接口
            [`/${remoteSetup.type}/order/add`, 'addOrder'],           //游戏服务端通过该接口接收钱包提交的订单，只缓存但不做进一步处理。钱包以此方式提交订单后，会进一步执行订单支付流程
        ];
    }

    /**
     * for test only: 用于为测试环境下的直连模式生产验证信息
     * @param {*} objData 
     */
    async auth360(objData){
        let ret = {
            t: now(),                               //当前时间戳，游戏方必须验证时间戳，暂定有效 期为当前时间前后 5 分钟
            nonce: Math.random()*1000 | 0,          //随机数
            plat_user_id: objData.id,               //平台用户 ID
            nickname: objData.id,                   //用户昵称
            avatar: objData.id,                     //头像
            is_tourist: 1,                          //是否为游客
        };
        ret.sign = sign(ret, this.core.options['360'].game_secret);
        return ret;
    }

    /**
     * PING测试接口
     */
    async ping(){
        return '200';
    }

    /**
     * 钱包执行订单支付流程中，会通过该接口提交订单信息，服务端缓存订单、等待主网回调通知
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

            //更新缓存中的订单信息
            this.core.orderMap.set(data.sn, data);
            
            return { code: 0 };
        } catch(e) {
        }

        return { code: -1 };
    }
    
    /**
     * 校验客户端从钱包获取的认证报文
     * @param {*} params 
     * @description 这不是必备的游戏开放接口，而是游戏服务服务端为游戏客户端提供的功能性接口，用于身份信息校验/缓存
     */
    async auth(user, params) {
        let json = params.data;
        if(toolkit.verifyData({
            data: {
                cid: json.cid,
                uid: json.uid,
                time: json.time,
                addr: json.addr,
                pubkey: json.pubkey,
            },
            sig: json.sig
        })) {
            user.baseMgr.info.setAttr('acaddr', json.addr);
            return {code: 0};
        } else {
            return {code: -1};
        }
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

            let trade_no = params.data.sn;

            let order = this.core.GetObject(EntityType.BuyLog, trade_no, IndexType.Domain);
            if(!order) {
                return {code:ReturnCode.illegalData};
            }

            let mitem = this.core.fileMap.shopOuter[order.getAttr('product_desc')];
            if(!order) {
                return {code:ReturnCode.illegalData};
            }

            let ret = await this.core.notifyEvent('user.orderPay', {data: {trade_no: order.getAttr('trade_no'), price: order.getAttr('total_fee')}});
            if(ret.code != ReturnCode.Success) {
                return {code:ReturnCode.illegalData};
            }

            this.core.notifyEvent('user.task', {user:pUser, data:{type:em_Condition_Type.totalPurchase, value: order.getAttr('total_fee')/10}});
            this.core.notifyEvent('user.afterPurchase', {user:pUser, amount: order.getAttr('total_fee')});

            let now = Date.parse(new Date())/1000;
            let tm1 = mitem.times.split(",");
            if(now >= parseInt(tm1[0]) && now <= parseInt(tm1[1])){
                if(!!mitem.extra){
                    let extra = BonusObject.convert(mitem.extra);
                    pUser.getBonus(extra);
                }
            }
        } catch (e) {
            console.error(e);
            return { code: 0 };
        }
    }
    
    /**
     * 我的道具列表【根据地址进行道具确权】 /testnet/myprops/:addr
     * @param {*} params    {addr:"确权的地址"}
     */
    async myProps(params) {
        //根据cp_name取cp完整信息，包括数据集采接口的url
        let cpParamArray = [
            cp_name,
        ];
        let cpInfo = await this.core.service.gamegoldHelper.execute('cp.byName', cpParamArray);
        if (!cpInfo || !cpInfo.result) {
            return { code: -200, msg: '查询我的道具失败，CP不存在' };
        }

        //通过url取道具列表等数据
        let propMap = new Map();
        let json = await (await fetch(`${cpInfo.result.url}/info`)).json();
        for (let i = 0; i < json.proplist.length; i++) {
            propMap.set(json.proplist[i].id, json.proplist[i]);
        }

        let retProps = await this.core.service.gamegoldHelper.execute('prop.remoteQuery', [[
            ['size', -1],
            ['pst', 9],
            ['cid',cpInfo.result.cid],
            ['current.address', params.addr]
        ]]);

        //将来自CP的商品列表信息，和链上数据信息进行拼装
        let retData = [];
        for (let item of retProps.result.list) {
            let prop = propMap.get(item.oid);
            if(prop) {
                retData.push({
                    pid: item.pid,
                    oid: item.oid,
                    gold: item.gold,
                    props_price: prop.props_price,
                    props_name: prop.props_name,
                    props_rank: prop.props_rank,
                    icon: prop.icon,
                });
            }
        }

        //返回最终的数据
        return { code: 0, data: retData };
    }
    
    /**
     * 返回对应CP的描述信息对象，同时也返回道具模板列表
     */
    getInfo() {
        //随机生成若干道具并添加到数组中
        let propArray = new Array();
        let propCount = 5;
        for (let i = 0; i < propCount; i++) {
            propArray.push(this.createProp(`${cp_name}_prop_${i}`));
        }

        //编组cpInfo
        let cpInfo = {
            "crowd": {
                "funding_text": "有可能是最好玩的游戏",
                "funding_project_text": "希望大家支持我们一哈",
            },
            "game": {
                "cp_name": cp_name,
                "game_title": `${arrayGame[0].Title}(${cp_name})`,
                "cp_type": arrayGame[0].Type,
                "desc": arrayGame[0].Desc,
                "provider": arrayGame[0].Provider,
                "icon_url": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/5/icon_img.jpg`,
                "small_img_url": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/5/small_img.jpg`,
                "large_img_url": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/5/large_img.jpg`,
                "pic_urls": [
                    `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/5/pic1.jpg`,
                    `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/5/pic2.jpg`,
                    `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/5/pic3.jpg`
                ],
                "version": "V1.0",
                "publish_time": 1545606613,
                "update_time": 1545706613,
                "update_content": "更新了最新场景和新的地图",
            },
            "proplist": propArray,
            "apps": {
                "wechat": {
                    "app_name": "{app_name}",
                    "appid": "{appid}",
                    "path": "{path}",
                    "version": "{version}",
                },
                "h5": {
                    "url": "{url}",
                },
                "android": {
                    "appid": "{appid}"
                },
                "ios": {

                }
            },
        };
        return cpInfo;
    }

    /**
     * 查询指定道具模板的描述信息对象
     * @param {*} params    {id:"道具模板编码"}
     */
    responseProp(params) {
        return this.createProp(params.id);
    }

    /**
     * 以 propid 作为模板编码，创建一个模拟游戏道具
     * @param {*} propid
     */
    createProp(propid) {
        let propIndexArray = propid.split('_prop_');
        let propIndex = propIndexArray[propIndexArray.length - 1];

        let prop = {
            "id": propid,
            "props_name": `${arrayGame[0].Prop.Name}-${propIndex}`,
            "props_desc": arrayGame[0].Prop.Desc,
            "icon": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/5/prop_icon.jpg`,
            "large_icon": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/5/prop_large_icon.jpg`,
            "more_icon": [
                `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/5/prop_pic1.jpg`,
                `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/5/prop_pic2.jpg`,
                `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/5/prop_pic3.jpg`
            ],
            "props_type": "装备",
            "props_price": (parseInt(propIndex)+1)*100000,
            "props_createtime": "2018-12-22 16:22:30",
            "props_rank": 3,
            "props_status": 1,
            "state": 1,
            "props_extra": {
                "attr1": "属性1",
                "attr2": "属性2",
            },
        };

        return prop;
    }

    /**
     * TX发货回调，属于腾讯支付流程中的第 7 步
     *
     * @note    参数名称        类型	    描述
     *          openid	        string	与APP通信的用户key，跳转到应用首页后，URL后会带该参数。由平台直接传给应用，应用原样传给平台即可。根据APPID以及QQ号码生成，即不同的appid下，同一个QQ号生成的OpenID是不一样的。
     *          appid	        string	应用的唯一ID。可以通过appid查找APP基本信息。
     *          ts	            string	linux时间戳。注意开发者的机器时间与腾讯计费开放平台的时间相差不能超过15分钟。 ？10位还是13位？先按10位处理
     *          payitem	        string	物品信息。
     *                                  （1）接收标准格式为ID*price*num，回传时ID为必传项。批量购买套餐物品则用“;”分隔，字符串中不能包含"|"特殊字符。
     *                                  （2）ID表示物品ID，price表示单价（以Q点为单位，单价最少不能少于2Q点，1Q币=10Q点。单价的制定需遵循道具定价规范），num表示最终的购买数量。
     *                                  示例：批量购买套餐，套餐中包含物品1和物品2。物品1的ID为G001，该物品的单价为10Q点，购买数量为1；物品2的ID为G008，该物品的单价为8Q点，购买数量为2，则payitem为：G001*10*1;G008*8*2 。
     *          token	        string	应用调用v3/pay/buy_goods接口成功返回的交易token。注意，交易token的有效期为15分钟，必须在获取到token后的15分钟内传递该token，否则将会返回token不存在的错误。
     *          billno	        string	支付流水号（64个字符长度。该字段和openid合起来是唯一的）。
     *          version	        string	协议版本号，由于基于V3版OpenAPI，这里一定返回“v3”。
     *          zoneid	        string	在支付营销分区配置说明页面，配置的分区ID即为这里的“zoneid”。如果应用不分区，则为0。回调发货的时候，根据这里填写的zoneid实现分区发货。注：2013年后接入的寄售应用，此参数将作为分区发货的重要参数，如果因为参数传错或为空造成的收入损失，由开发商自行承担。
     *          providetype	    string	发货类型，这里请传入0。0表示道具购买，1表示营销活动中的道具赠送，2表示交叉营销任务集市中的奖励发放。
     *          amt	            string	Q点/Q币消耗金额或财付通游戏子账户的扣款金额。可以为空，若传递空值或不传本参数则表示未使用Q点/Q币/财付通游戏子账户。允许游戏币、Q点、抵扣券三者混合支付，或只有其中某一种进行支付的情况。
     *                                  用户购买道具时，系统会优先扣除用户账户上的游戏币，游戏币余额不足时，使用Q点支付，Q点不足时使用Q币/财付通游戏子账户。这里的amt的值将纳入结算，参与分成。
     *                                  注意，这里以0.1Q点为单位。即如果总金额为18Q点，则这里显示的数字是180。请开发者关注，特别是对账的时候注意单位的转换。
     *          payamt_coins	string	扣取的游戏币总数，单位为Q点。可以为空，若传递空值或不传本参数则表示未使用游戏币。允许游戏币、Q点、抵扣券三者混合支付，或只有其中某一种进行支付的情况。
     *                                  用户购买道具时，系统会优先扣除用户账户上的游戏币，游戏币余额不足时，使用Q点支付，Q点不足时使用Q币/财付通游戏子账户。游戏币由平台赠送或由好友打赏，平台赠送的游戏币不纳入结算，即不参与分成；
     *                                  好友打赏的游戏币按消耗量参与结算（详见：货币体系与支付场景）。
     *          pubacct_payamt_coins
     *                          string	扣取的抵用券总金额，单位为Q点。可以为空，若传递空值或不传本参数则表示未使用抵扣券。允许游戏币、Q点、抵扣券三者混合支付，或只有其中某一种进行支付的情况。用户购买道具时，可以选择使用抵扣券进行一部分的抵扣，剩余部分使用游戏币/Q点。
     *                                  平台默认所有上线支付的应用均支持抵扣券。自2012年7月1日起，金券银券消耗将和Q点消耗一起纳入收益计算（详见：货币体系与支付场景）。
     *          sig	            string	请求串的签名，由需要签名的参数生成。
     *                                  （1）签名方法请见文档：腾讯开放平台第三方应用签名参数sig的说明。
     *                                  （2）按照上述文档进行签名生成时，需注意回调协议里多加了一个步骤：在构造源串的第3步“将排序后的参数(key=value)用&拼接起来，并进行URL编码”之前，需对value先进行一次编码 （编码规则为：除了 0~9 a~z A~Z !*() 之外其他字符按其ASCII码的十六进制加%进行表示，例如“-”编码为“%2D”）。
     *                                  （3）以每笔交易接收到的参数为准，接收到的所有参数除sig以外都要参与签名。为方便平台后续对协议进行扩展，请不要将参与签名的参数写死。
     *                                  （4）所有参数都是string型，进行签名时必须使用原始接收到的string型值。 开发商出于本地记账等目的，对接收到的某些参数值先转为数值型再转为string型，导致字符串部分被截断，从而导致签名出错。如果要进行本地记账等逻辑，建议用另外的变量来保存转换后的数值。
     */
    async txpay(req) {
        let data = {
            amt:                    req.amt,
            appid:                  req.appid,
            billno:                 req.billno,
            openid:                 req.openid,
            payamt_coins:           req.payamt_coins,
            payitem:                req.payitem,
            ts:                     req.ts,
            providetype:            req.providetype,
            pubacct_payamt_coins:   req.pubacct_payamt_coins,
            token:                  req.token,
            version:                req.version,
            zoneid:                 req.zoneid,
        };

        if(!this.core.service.txApi.checkPayCallbackSign(data, "/txpay")){
            return {ret: ReturnCode.illegalData, msg:"数据非法"};
        }

        //向玩家发放商品、下行通知 tradeNo, total_fee
        let result = await this.core.notifyEvent('user.orderPay', {data:{trade_no: data.billno, price: data.amt}});
        if(result.code == ReturnCode.Success) {
            //向第三方平台返回成功应答
            return {ret: result, msg:"OK"};
        } else {
            return {ret: result, msg:"Error"};
        }
    }

    /**
     * 360发货回调函数
     * @param {*} req 
     */
    async pay360(req) {
        let params = {
            game_key: this.core.options['360'].game_key, //采信己方预设值
            plat_user_id: req.plat_user_id,
            order_id: req.order_id,
            amount: req.amount,
            plat_order_id: req.plat_order_id,
            sign: req.sign
        };

        if(!params.sign == sign(params, this.core.options['360'].game_secret)){ //签名校验错误
            return "error.auth";
        }

        if(!!params.plat_user_id) {
            //向玩家发放商品、下行通知 tradeNo, total_fee
            let ret = await this.core.notifyEvent('user.orderPay', {data:{trade_no: params.order_id, price: params.amount}});
            if(ret.code == ReturnCode.Success){
                //向第三方平台返回成功应答
                return "ok";
            }
            else{
                return "exist.not.order";
            }
        }
        else{
            return "error.openid";
        }
    }    
}

//#region 供模拟系统使用的配置信息

let arrayGame = [
    {
        Type: 'PZL', 
        Title: '鸡小德历险记',
        Desc: '带领鸡小德以出神入化的跳跃技能破碎虚空',
        Provider: '原石互娱',
        Prop: {
            Name: '金箍棒',
            Desc: '东海龙宫镇宫之宝',
        },
    },
];

//#endregion

exports = module.exports = openapi;
