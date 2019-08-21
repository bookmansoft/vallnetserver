let rp = require('request-promise');
let crypto = require('crypto');
let uuid = require('uuid');
let qr = require('qr-image');
let fetch = require('node-fetch');
let mysql = require('mysql');
let facade = require('gamecloud');
let CoreOfBase = facade.CoreOfBase;
let { stringify } = require('../util/stringUtil');

//订单执行前需要达到的确认数
const confirmNum = 1;

/**
 * 资源节点类
 */
class CoreOfResource extends CoreOfBase {
    /**
     * 构造函数
     * @param {*} $env 
     */
    constructor($env){
        super($env);
        this.orderMap = new Map();
        this.cpToken = new Map();
        this.userMap = new Map();

        //一个简单的定时程序，对订单进行定时检测，已确认订单进行处理后删除，未确认订单如超时则主动查询状态
        setInterval(async () => {
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
        }, 3000);
    }

    /**
     * 节点类型定义函数 - 映射自己的服务器类型数组，提供给核心类的类工厂使用
     */
    static get mapping() {
        this.$mapping = ['Resource'];
        return this.$mapping;
    }

    /**
     * 启动函数
     * @param {*} app express 对象
     */
    async Start(app) {
        super.Start(app);

        //#region 设置各类路由的路径和句柄
        this.listenCP(app);
        this.listenQrCode(app);
        this.listenEChart(app);
        //#endregion

        //启动网络监听服务
        let hrv = this.options.UrlHead == "https" ? require(this.options.UrlHead).createServer(this.credentials, app) : require(this.options.UrlHead).createServer(app);
        hrv.listen(this.options.webserver.port, this.options.webserver.host, () => {
            console.log(`资源服务在端口 ${this.options.webserver.port} 上准备就绪`);
        });
    }

    listenCP(app) {
        //模拟CP服务
        app.get('/mock/:cp_name', this.responseCPName.bind(this));

        app.get('/mock/:cp_name/user/:uid', this.responseUser.bind(this));

        //属性详情处理
        app.get('/mock/:cp_name/prop/:id', this.responseProp.bind(this));

        //我的道具列表【确权】
        app.get('/mock/:cp_name/myprops/:uid', this.myProps.bind(this));
        
        //【订单】游戏内下单
        app.post('/mock/:cp_name/order', this.order.bind(this));

        //【订单】接收主网回调
        app.post('/mock/:cp_name/testnet/order/confirm', this.orderConfirm.bind(this));
    }

    /**
     * 处理客户端上行的道具购买指令，通过 sys.notify 向主网发送订单消息
     * @param {*} req 
     * @param {*} res 
     */
    async order(req, res) {
        //通过 uid 查询用户对象
        let user = this.userMap[req.body.uid];
        if(!!user) {
            //生成订单。对于以 sys.notify 模式发起的订单，游戏服务器不用承担订单状态监控、主动查询订单状态、再次发起订单支付的义务，简单说就是发射后不管
            let data = {
                cid: req.body.cid,                  //CP编码
                oid: req.body.oid,                  //道具原始编码
                price: req.body.price,              //价格，单位尘
                url: req.body.url,                  //道具图标URL
                props_name: req.body.props_name,    //道具名称
                sn: uuid.v1(),                      //订单编号
                address: user.address,              //用户地址
                confirmed: -1,                      //确认数，-1表示尚未被主网确认，而当确认数标定为0时，表示已被主网确认，只是没有上链而已
                time: Date.now()/1000,
            };
            
            //向主网发送消息
            let paramArray = [
                user.address,
                JSON.stringify(data),
            ];
            let ret = await this.service.gamegoldHelper.execute('sys.notify', paramArray);
            if(!!ret) {
                if(ret.code == 0) { //操作成功，本地缓存订单，以便在将来接收到回调时进行必要的比对
                    this.orderMap.set(data.sn, data);
                }
                res.json({ code: ret.code });
                return;
            }
        }

        res.json({ code: -1 });
    }
    
    /**
     * 订单支付回调接口，处理来自主网的订单支付确认通知
     * @param {*} req 
     * @param {*} res 
     */
    async orderConfirm(req, res) {
        try {
            let {data, sig} = req.body;

            // //查询订单列表中是否存在对应记录
            let theOrder = this.orderMap.get(data.sn);
            if (!theOrder) {
                console.log("订单不存在");
                res.json({ code: 0 });
                return;
            }

            //确认已获取正确签名密钥
            if(!this.cpToken[data.cid]) {
                let retAuth = await this.service.gamegoldHelper.execute('sys.createAuthToken', [data.cid]);
                if(retAuth.code == 0) {
                    let {aeskey, aesiv} = this.service.gamegoldHelper.remote.getAes();
                    this.cpToken[data.cid] = this.service.gamegoldHelper.remote.decrypt(aeskey, aesiv, retAuth.result[0].encry);
                } else {
                    res.json({ code: 0 });
                    return;
                }
            }
    
            //校验签名
            let dstr = stringify(data);
            let sim = crypto.createHmac('sha256', dstr).update(this.cpToken[data.cid]).digest('hex');
            if (sim != sig) {
                res.json({ code: 0 });
                return;
            }

            //更新订单信息
            data.time = Date.now()/1000;
            Object.keys(data).map(key=>{
                theOrder[key] = data[key];
            });

            this.orderMap.set(theOrder.sn, theOrder);

            res.json({ code: 0 });
        } catch (e) {
            console.error(e);
            res.end();
        }
    }

    /**
     * QRCode处理
     * @param {*} app 
     */
    listenQrCode(app) {
        app.get('/qrcode/:qrcode', (req, res) => {
            try {
                if (!!req.params.qrcode) {
                    let img = qr.image(req.params.qrcode, { size: 10 });
                    res.writeHead(200, { 'Content-Type': 'image/png' });
                    img.pipe(res);
                } else {
                    rp({ uri: decodeURIComponent(this.fileMap.DataConst.user.icon), headers: { 'User-Agent': 'Request-Promise', } }).pipe(res);
                }
            } catch (e) {
                console.error(e);
                res.end();
            }
        });
    }

    /**
     * k线图
     * @param {*} app 
     */
    listenEChart(app) {
        // cp_stock = {
        //     `id`             int(11),        'cp记录流水号'
        //     `cid`            varchar(255)    'cp编码',
        //     `stock_day`      varchar(10)     '发生交易的年月日',
        //     `stock_open`     int(11)         '开盘价',
        //     `stock_close`    int(11)         '收盘价',
        //     `stock_high`     int(11)         '最高价',
        //     `stock_low`      int(11)         '最低价',
        //     `total_num`      bigint(20)      '总成交数量（凭证数量）',
        //     `total_amount`   bigint(20)      '总成交金额（游戏金）',
        // }

        app.get('/chart/kline', (req, res) => {
            let connection = null;
            try {
                let dtData = new Array();
                let stockData = new Array();
                connection = mysql.createConnection({
                    host: this.options.mysql.host,
                    user: this.options.mysql.sa,
                    password: this.options.mysql.pwd,
                    port: this.options.mysql.port,
                    database: this.options.mysql.db,
                });
                connection.connect();
                connection.query('SELECT * FROM cp_stock where cid=? order by id asc', [req.query.cid], function (err, result) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }

                    //把上述结构设置到目标数据结构
                    for (let i = 0; i < result.length; i++) {
                        result[i] = JSON.parse(JSON.stringify(result[i]));
                        dtData[i] = result[i].stock_day;
                        stockData[i] = [
                            result[i].stock_open,
                            result[i].stock_close,
                            result[i].stock_low,
                            result[i].stock_high,
                        ];
                    }

                    let option = {
                        title: {
                            text: '众筹凭证指数'
                        },
                        tooltip: {
                            trigger: 'axis',
                            formatter: function (params) {
                                var res = params[0].seriesName + ' ' + params[0].name;
                                res += '<br/>  开盘 : ' + params[0].value[0] + '  最高 : ' + params[0].value[3];
                                res += '<br/>  收盘 : ' + params[0].value[1] + '  最低 : ' + params[0].value[2];
                                return res;
                            }
                        },
                        legend: {
                            data: []
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: false },
                                dataZoom: { show: false },
                                dataView: { show: false, readOnly: false },
                                magicType: { show: false, type: ['line', 'bar'] },
                                restore: { show: false },
                                saveAsImage: { show: true }
                            }
                        },
                        dataZoom: {
                            show: true,
                            realtime: true,
                            start: 0,
                            end: 100
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: true,
                                axisTick: { onGap: false },
                                splitLine: { show: false },
                                data: dtData,
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                scale: true,
                                boundaryGap: [0.01, 0.01]
                            }
                        ],
                        series: [
                            {
                                name: '众筹凭证指数',
                                type: 'k',
                                data: stockData,
                            }
                        ]
                    };
                    res.jsonp(option);
                });
            }
            catch (e) {
                console.error(e);
                res.end();
            }
            finally {
                try {
                    if(!!connection) {
                        connection.end();
                    }
                } catch (ex1) {
                }
            }
        });
    }

    /**
     * 我的道具列表【确权】 /mock/:cp_name/myprops/:uid
     */
    async myProps(req, res) {
        try {
            //根据cp_name取cp完整信息，包括数据集采接口的url
            let cpParamArray = [
                req.params.cp_name,
            ];
            let cpInfo = await this.service.gamegoldHelper.execute('cp.byName', cpParamArray);
            if (!cpInfo || !cpInfo.result) {
                res.json({ code: -200, msg: '查询我的道具失败，CP不存在' });
                return;
            }

            //通过url取道具列表等数据
            let propMap = new Map();
            let json = await (await fetch(cpInfo.result.url)).json();
            for (let i = 0; i < json.proplist.length; i++) {
                propMap.set(json.proplist[i].id, json.proplist[i]);
            }

            let user = this.userMap[req.params.uid];
            let retProps = await this.service.gamegoldHelper.execute('prop.list', [0, user.domainId, null, cpInfo.result.cid]);

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
            res.json({ code: 0, data: retData });
        } catch (e) {
            console.error(e);
            res.json({ code: -100, msg: '查询我的道具失败' });
        }
    }

    /**
     * 创建一个模拟游戏道具，其属性对 propid 具备确定性
     * @param {*} propid
     */
    createProp(propid) {
        let propIndexArray = propid.split('_prop_');
        let cp_name = propIndexArray[0];
        let propIndex = propIndexArray[propIndexArray.length - 1];

        let groupNum = 0;//默认为0
        try {
            groupNum = parseInt(cp_name.substr(4)) % 4;
            if (groupNum != 0 && groupNum != 1 && groupNum != 2 && groupNum != 3) {
                groupNum = 0;
            }
        } catch (error1) {
            groupNum = 0;
        }

        let prop = {
            "id": propid,
            "props_name": `${arrayPropName[groupNum]}-${propIndex}`,
            "icon": `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/prop_icon.jpg",
            "large_icon": `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/prop_large_icon.jpg",
            "more_icon": [`http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/prop_pic1.jpg",
            `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/prop_pic2.jpg",
            `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/prop_pic3.jpg"],
            "props_type": "装备",
            "props_desc": arrayPropDesc[groupNum],
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
     * 获取第4个字母起的所有数字（即规定只能有最多4个字母，不允许超过）。
     * 对该字符串parseInt 后 %4，取出的模，作为分组号
     * @param {*} req 
     * @param {*} res 
     */
    responseCPName(req, res) {
        try {
            if (!req.params.cp_name) {
                res.end();
            }

            let groupNum = 0;//默认为0
            try {
                groupNum = parseInt(req.params.cp_name.substr(4)) % 4;
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
                propArray.push(this.createProp(`${req.params.cp_name}_prop_${i}`));
            }

            //编组cpInfo
            let cpInfo = {
                "crowd": {
                    "funding_text": "有可能是最好玩的游戏",
                    "funding_project_text": "希望大家支持我们一哈",
                },
                "game": {
                    "cp_name": req.params.cp_name,
                    "game_title": `${arrayGameTitle[groupNum]}(${req.params.cp_name})`,
                    "cp_type": arrayCpTye[groupNum],
                    "icon_url": `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/${groupNum}/icon_img.jpg`,
                    "small_img_url": `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/small_img.jpg",
                    "large_img_url": `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/large_img.jpg",
                    "pic_urls": [`http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/pic1.jpg",
                    `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/pic2.jpg",
                    `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/pic3.jpg"],
                    "desc": arrayGameDesc[groupNum],
                    "provider": arrayProvider[groupNum],
                    "version": "V1.0",
                    "publish_time": 1545606613,
                    "update_time": 1545706613,
                    "update_content": "更新了最新场景和新的地图",
                    "state": 1,
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
            res.json(cpInfo);
        }
        catch (e) {
            console.error(e);
            res.end();
        }
    }

    async responseUser(req, res) {
        try {
            let rt = await this.service.gamegoldHelper.execute('token.user', [req.params.cp_name, req.params.uid, null, req.params.uid]);
            if(rt.code == 0) {
                this.userMap[req.params.uid] = {
                    domainId: req.params.uid,
                    address: rt.result.data.addr,
                };
            }
        } catch (e) {
            console.error(e);
            res.end();
        }        
    }

    responseProp(req, res) {
        try {
            res.json(this.createProp(req.params.id));
        } catch (e) {
            console.error(e);
            res.end();
        }        
    }
}

//#region 供模拟系统使用的属性配置数组
let arrayPropName = [
    'M416自动步枪',
    '北极50地狱行者',
    '超级跑车',
    'T10自行反坦克车',
];
let arrayPropDesc = [
    'M4虽然是很多的玩家喜爱的步枪，但是随着版本的改动现在已经垫底了，配件也是非常的多，没有配件的M4基本就是个烧火棍，但是满配了以后还是可以玩的，EatChicken的最佳武器之一',
    '北极50拥有极高的准确度，栓动射击大大的保证了武器的精度。狙击枪的盲射是所有武器中最差的，弹道散射大，即便贴身了，也难以击中。',
    '极其稀有的超级跑车，一旦拥有，便能上天入地。W12四涡轮增压喷气式引擎，配合极度流畅的车身线条，可以直接使角色上天与太阳肩并肩，轻松完成任何任务。',
    '仅支持金币购买的超值坦克，性价比超高，配合AP弹，轻松击穿同级其他坦克。需要配备驾驶成员4名，支持AP弹和HE弹。',
];
let arrayGameTitle = [
    'Code of War',
    'Mercs of Boom',
    '孤胆车神',
    '坦克大战',
];
let arrayCpTye = [
    'ACT', 'SHT', 'ACT', 'WAR',
];
let arrayGameDesc = [
    '指挥在线枪战 – 纯粹的动作游戏！ Code of War是一款在线枪战游戏，拥有最佳3D图形、真实物理引擎以及海量真实枪支供您选择。 在与来自世界各地的其他玩家对战的动态在线动作游戏内试试您的技能和精通！',
    'Supply elite soldiers with tons of equipment: hi-tech armor, deadly weapons, implants, and gadgets. ? Upgrade your base and research futuristic technology to gain access to advanced war',
    '开放沙盒式动作冒险游戏金牌标杆系列之作霸气归来。前往迷人的新奥尔良，打下一片新天地。在这座巨大的城市中，驾驶数百种交通工具、坐拥数量惊人的武器装备，来往自如，无法无天！ 在这里万事俱备，您也可以成为黑道传奇人物！',
    '终于等到了！全新世界征服战资料片震撼开启！三大阵营重兵集结，打响国战第一炮！万千坦克同屏对决，铸造最热血的坦克手游！集合策略和国战经典玩法于一体的全民坦克游戏，传奇将领，万人国战，占领世界疆土，成就世界霸主梦',
];
let arrayProvider = [
    'Extreme Developers Action & adventure',
    'GAME INSIGHT UAB Strategy',
    'Gameloft. Action & adventure',
    'Strategy、Role playing',
];
//#endregion

exports = module.exports = CoreOfResource;