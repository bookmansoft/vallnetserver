let fetch = require('node-fetch')
let crypto = require('crypto');
let uuid = require('uuid');
let facade = require('gamecloud')
let toolkit = require('gamerpc')
let { stringify, hashInt } = require('../../../util/stringUtil');
let remoteSetup = facade.ini.servers["Index"][1].node; //全节点配置信息
 
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
            [`/mock/:cp_name/info`, 'getInfo'],                                     //获取游戏基本描述信息
            ['/mock/:cp_name/prop/:id', 'responseProp'],                            //获取指定道具模板信息
            [`/mock/:cp_name/${remoteSetup.type}/myprops/:addr`, 'myProps'],        //获取指定地址上的确权道具
            [`/mock/:cp_name/${remoteSetup.type}/auth`, 'auth'],                    //验证玩家身份信息
            [`/mock/:cp_name/${remoteSetup.type}/order/confirm`, 'confirmOrder'],   //订单完成回调接口
            [`/mock/:cp_name/${remoteSetup.type}/order/notify`, 'notifyOrder'],     //游戏服务端通过该接口接收游戏客户端提交的订单，缓存并以通告模型广播至至主网。主网将进一步将订单信息通知到钱包
            [`/mock/:cp_name/${remoteSetup.type}/order/add`, 'addOrder'],           //游戏服务端通过该接口接收钱包提交的订单，只缓存但不做进一步处理。钱包以此方式提交订单后，会进一步执行订单支付流程
        ];
    }

    /**
     * 游戏客户端上行订单，游戏服务端进一步通告主网
     * @param {*} params
     */
    async notifyOrder(params) {
        let user = this.core.userMap[params.uid];
        if(!user) {
            return {code: -1};
        }

        //以 sys.notify 模式发起订单
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
            if(ret.code == 0) { 
                //缓存订单信息，以便在将来接收到回调时进行必要的比对
                this.core.orderMap.set(data.sn, data);
            }
            return { code: ret.code };
        }

        return { code: -1 };
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

            //缓存订单信息
            this.core.orderMap.set(theOrder.sn, theOrder);

            return { code: 0 };
        } catch (e) {
            console.error(e);
            return { code: 0 };
        }
    }
    
    /**
     * 我的道具列表【根据地址进行道具确权】 /mock/:cp_name/testnet/myprops/:addr
     * @param {*} params    {cp_name:"CP名称", addr:"确权的地址"}
     */
    async myProps(params) {
        //根据cp_name取cp完整信息，包括数据集采接口的url
        let cpParamArray = [
            params.cp_name,
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
     * 校验客户端从钱包获取的认证报文
     * @param {*} params 
     * @description 这不是必备的游戏开放接口，而是游戏服务服务端为游戏客户端提供的功能性接口，用于身份信息校验/缓存
     */
    async auth(params) {
        let json = JSON.parse(params.data);
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
            //缓存认证报文
            this.core.userMap[json.uid] = json;
            return {code: 0};
        } else {
            return {code: -1};
        }
    }

    /**
     * 返回对应CP的描述信息对象，同时也返回道具模板列表
     * @param {*} params {cp_name:"CP名称"}
     */
    getInfo(params) {
        if (!params.cp_name) {
            return {code: -1};
        }

        let groupNum = 0;//默认为0
        try {
            groupNum = hashInt(params.cp_name) % 4;
            if (groupNum != 0 && groupNum != 1 && groupNum != 2 && groupNum != 3) {
                groupNum = 0;
            }
        } catch (error1) {
            groupNum = 0;
        }

        //随机生成若干道具并添加到数组中
        let propArray = new Array();
        let propCount = 5;
        for (let i = 0; i < propCount; i++) {
            propArray.push(this.createProp(`${params.cp_name}_prop_${i}`));
        }

        //编组cpInfo
        let cpInfo = {
            "crowd": {
                "funding_text": "有可能是最好玩的游戏",
                "funding_project_text": "希望大家支持我们一哈",
            },
            "game": {
                "cp_name": params.cp_name,
                "game_title": `${arrayGame[groupNum].Title}(${params.cp_name})`,
                "cp_type": arrayGame[groupNum].Type,
                "desc": arrayGame[groupNum].Desc,
                "provider": arrayGame[groupNum].Provider,
                "icon_url": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/${groupNum}/icon_img.jpg`,
                "small_img_url": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/small_img.jpg",
                "large_img_url": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/large_img.jpg",
                "pic_urls": [`http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/pic1.jpg",
                `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/pic2.jpg",
                `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/pic3.jpg"],
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
        let cp_name = propIndexArray[0];
        let propIndex = propIndexArray[propIndexArray.length - 1];

        let groupNum = 0;//默认为0
        try {
            groupNum = hashInt(cp_name) % 4;
            if (groupNum != 0 && groupNum != 1 && groupNum != 2 && groupNum != 3) {
                groupNum = 0;
            }
        } catch (error1) {
            groupNum = 0;
        }

        let prop = {
            "id": propid,
            "props_name": `${arrayGame[groupNum].Prop.Name}-${propIndex}`,
            "props_desc": arrayGame[groupNum].Prop.Desc,
            "icon": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/prop_icon.jpg",
            "large_icon": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/prop_large_icon.jpg",
            "more_icon": [`http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/prop_pic1.jpg",
            `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/prop_pic2.jpg",
            `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/prop_pic3.jpg"],
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
}

//#region 供模拟系统使用的配置信息

let arrayGame = [
    {
        Type: 'FPS', 
        Title: 'Code of War',
        Desc: '指挥在线枪战 – 纯粹的动作游戏！ Code of War是一款在线枪战游戏，拥有最佳3D图形、真实物理引擎以及海量真实枪支供您选择。 在与来自世界各地的其他玩家对战的动态在线动作游戏内试试您的技能和精通！',
        Provider: 'Extreme Developers Action & adventure',
        Prop: {
            Name: 'M416自动步枪',
            Desc: 'M4虽然是很多的玩家喜爱的步枪，但是随着版本的改动现在已经垫底了，配件也是非常的多，没有配件的M4基本就是个烧火棍，但是满配了以后还是可以玩的，EatChicken的最佳武器之一',
        },
    },
    {
        Type: 'SHT', 
        Title: 'Mercs of Boom',
        Desc: 'Supply elite soldiers with tons of equipment: hi-tech armor, deadly weapons, implants, and gadgets. ? Upgrade your base and research futuristic technology to gain access to advanced war',
        Provider: 'GAME INSIGHT UAB Strategy',
        Prop: {
            Name: '北极50地狱行者',
            Desc: '北极50拥有极高的准确度，栓动射击大大的保证了武器的精度。狙击枪的盲射是所有武器中最差的，弹道散射大，即便贴身了，也难以击中。',
        },
    },
    {
        Type: 'ACT', 
        Title: '孤胆车神',
        Desc: '开放沙盒式动作冒险游戏金牌标杆系列之作霸气归来。前往迷人的新奥尔良，打下一片新天地。在这座巨大的城市中，驾驶数百种交通工具、坐拥数量惊人的武器装备，来往自如，无法无天！ 在这里万事俱备，您也可以成为黑道传奇人物！',
        Provider: 'Gameloft. Action & adventure',
        Prop: {
            Name: '超级跑车',
            Desc: '极其稀有的超级跑车，一旦拥有，便能上天入地。W12四涡轮增压喷气式引擎，配合极度流畅的车身线条，可以直接使角色上天与太阳肩并肩，轻松完成任何任务。',
        },
    },
    {
        Type: 'WAR',
        Title: '坦克大战',
        Desc: '终于等到了！全新世界征服战资料片震撼开启！三大阵营重兵集结，打响国战第一炮！万千坦克同屏对决，铸造最热血的坦克手游！集合策略和国战经典玩法于一体的全民坦克游戏，传奇将领，万人国战，占领世界疆土，成就世界霸主梦',
        Provider: 'Strategy、Role playing',
        Prop: {
            Name: 'T10自行反坦克车',
            Desc: '仅支持金币购买的超值坦克，性价比超高，配合AP弹，轻松击穿同级其他坦克。需要配备驾驶成员4名，支持AP弹和HE弹。',
        },
    },
];

//#endregion

exports = module.exports = openapi;
