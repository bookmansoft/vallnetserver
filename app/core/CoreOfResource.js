let rp = require('request-promise');
let crypto = require('crypto');
let uuid = require('uuid');
let qr = require('qr-image');
let fetch = require('node-fetch');
let mysql = require('mysql');
let facade = require('gamecloud');
let CoreOfBase = facade.CoreOfBase;
let { stringify } = require('../util/stringUtil');

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

/**
 * 资源服对应的门面类
 */
class CoreOfResource extends CoreOfBase {
    /**
     * 构造函数
     * @param {*} $env 
     */
    constructor($env){
        super($env);
        this.orderMap = new Map();

        //载入用户自定义通用Service
        facade.config.filelist.mapPackagePath(`${__dirname}/../service/${this.constructor.name}`).map(srv=>{
            let srvObj = require(srv.path);
            this.service[srv.name.split('.')[0]] = new srvObj(this);
        });
    }

    async loadModel() {
        super.loadModel();

        //载入用户自定义Service
        facade.config.filelist.mapPath(`app/service/${this.constructor.name}`).map(srv=>{
            let srvObj = require(srv.path);
            this.service[srv.name.split('.')[0]] = new srvObj(this);
        });
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

    /**
     * 节点类型定义函数 - 映射自己的服务器类型数组，提供给核心类的类工厂使用
     */
    static get mapping() {
        this.$mapping = ['Resource'];
        return this.$mapping;
    }

    listenCP(app) {
        //模拟CP服务
        app.get('/mock/:cp_name', this.responseCPName.bind(this));

        //属性详情处理
        app.get('/mock/:cp_name/prop/:id', this.responseProp.bind(this));

        //我的道具列表【确权】
        app.get('/mock/:cp_name/myprops/:address', this.myProps.bind(this));
        
        //【订单】游戏客户端下单的post方法；除了cp_name以外，其他参数以JSON格式在request-body中提交
        app.post('/mock/:cp_name/order', this.order.bind(this));

        //【订单】回调通知
        app.post('/mock/:cp_name/testnet/order/confirm', this.orderConfirm.bind(this));
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
     * 我的道具列表【确权】 /mock/:cp_name/myprops/:address
     */
    async myProps(req, res) {
        try {
            //根据cp_name取cp完整信息，包括数据集采接口的url
            let cpParamArray = [
                req.params.cp_name,
            ];
            console.log('cp.byName 的参数:', cpParamArray);
            let cpInfo = await this.service.gamegoldHelper.execute('cp.byName', cpParamArray);
            if (!cpInfo) {
                res.json({ code: -200, msg: '查询我的道具失败，CP不存在' });
                return;
            }

            //通过url取道具列表等数据
            let propMap = new Map();
            let json = await (await fetch(cpInfo.url)).json();
            console.log("129:in", json.proplist);
            for (let i = 0; i < json.proplist.length; i++) {
                propMap.set(json.proplist[i].id, json.proplist[i]);
            }

            //查询指定地址上指定cp的道具
            let paramArray = [
                cpInfo.cid,
                req.params.address,
            ];
            let retProps = await this.service.gamegoldHelper.execute('queryProps', paramArray);

            //将来自CP的商品列表信息，和链上数据信息进行拼装
            let retData = [];
            for (let i = 0; i < retProps.length; i++) {
                let prop = propMap.get(retProps[i].oid);
                retData.push({
                    pid: retProps[i].pid,
                    oid: retProps[i].oid,
                    gold: retProps[i].gold,
                    props_price: prop.props_price,
                    props_name: prop.props_name,
                    props_rank: prop.props_rank,
                    icon: prop.icon,
                });
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
            "props_extra": [
                {
                    "attr1": "属性1",
                    "attr2": "属性2",
                }
            ]
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
        if (!!req.params.cp_name) {
            try {
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
    }

    responseProp(req, res) {
        try {
            res.json(this.createProp(req.params.id));
        }
        catch (e) {
            console.error(e);
            res.end();
        }        
    }

    /**
     * 通过 sys.notify 指令发送订单消息
     * @param {*} req 
     * @param {*} res 
     */
    async order(req, res) {
        console.log("游戏下单 order 时间:", new Date());
        //根据cp_name设置cpid备用
        let cpid = '';
        if (req.params.cp_name == 'cp0326') {
            cpid = '229a4970-4f77-11e9-b118-e3d1ba95e1a5';
        }
        //获取其他参数
        let oid = req.body.oid;//道具原始id
        let price = req.body.price;//道具价格
        let address = req.body.address;
        let url = req.body.url;//道具图标url
        let props_name = req.body.props_name;
        //生成订单sn并在本类中缓存订单数据
        let sn = uuid.v1();
        //订单即通知的内容
        let data = {
            cid: cpid,
            oid: oid,
            price: price,
            url: url,
            props_name: props_name,
            sn: sn,
            address: address
        };
        //添加到订单map中
        this.orderMap.set(sn, data);
        console.log("订单Map对象的长度：", this.orderMap.size);
        //发送消息
        let paramArray = [
            address,
            JSON.stringify(data),//此处必须是字符串
        ];
        console.log('sys.notify 的参数:', paramArray);
        let ret = await this.service.gamegoldHelper.execute('sys.notify', paramArray);
        console.log(ret);
        res.json({ code: 0 });
    }

    /**
     * 来自链的回调接口【认证】
     * @param {*} req 
     * @param {*} res 
     */
    async orderConfirm(req, res) {
        try {
            console.log(new Date());
            //根据cp_name获取cpid
            let cpid = '';
            let token = '';
            if (req.params.cp_name == 'cp0326') {
                cpid = '229a4970-4f77-11e9-b118-e3d1ba95e1a5';
                token = '0300234a91e4fad6b42d9ed7adeeac4d830a79ffe95c4520554e6265f317a154f8';
            }

            console.log('token: ', token);
            //解构路由上传来的数据
            let { data, sig } = req.body;
            console.log('回调的数据和令牌: ', data, sig);
            //利用业务数据作为令牌随机量，结合本地缓存的令牌固定量计算令牌
            const hmac = crypto.createHmac('sha256', stringify(data));
            let sim = hmac.update(token).digest('hex');
            console.log('line 36:', sim, ':', sig);
            //将计算令牌和传递令牌进行比对
            if (sim != sig) {
                console.log('令牌和期望值竟然不一样！此消息异常，忽略不处理');
                res.json({ code: 0 });
            }
            console.log("通知的数据：", data);
            //通知指定订单已经获得了几个确认，-1表示交易被清除
            // orderManager.confirm(data);
            // { oper: 'pay',
            // cid: 'c2162df0-0983-11e9-8a74-7b4599ff25f5',
            // uid: 'uid',
            // sn: '123456880000000000000000000000000000',
            // sum: 110000000,
            // addr: 'tb1qwlxgutpcgkvf9lhut6wac3s4xrgfl8yxhah93l',
            // gaddr: null,
            // hash: 'bdb56ea2912ac21281d76894a916be0dbcd79618840d8581c98858ea44332dd6',
            // height: 23113,
            // confirm: 0 } 
            console.log('发起道具制备等处理，根据收到的数据进一步开发');

            //特殊处理：从订单号中获取道具原始编码
            let prop_oid = 'prop_' + req.params.cp_name + '01';    //oid: prop_cp12270101
            let arraySN = data.sn.split('-new-');
            if (arraySN.length > 1) {
                prop_oid = arraySN[0];
            }
            else {
                //对于没有-new-分隔符的情况下，尝试从内部Map获得订单号
                console.log("orderMap集合的大小:", this.orderMap.size);
                let theOrder = this.orderMap.get(data.sn);
                if (theOrder != null) {
                    console.log("成功获取订单:", JSON.stringify(theOrder));
                    prop_oid = theOrder.oid;
                }
            }
            console.log('prop_oid', prop_oid);
            //步骤2：调用prop.order 订购该道具，即创建道具并发送到指定地址
            console.log("prop.order cid oid gold address: 创建道具 厂商编码 道具原始码 含金量 地址：");
            console.log('此处的默认使用default账户付款，需要更改！');
            let paramArray = [
                cpid,
                prop_oid,
                parseInt(data.sum * 0.2),//统一当成等级 3 ，含金量20%处理
                data.addr
            ];
            console.log('prop.order 的参数:', paramArray);
            let ret = await this.service.gamegoldHelper.execute('prop.order', paramArray);
            console.log('prop.order 的返回值:', ret);

            res.json({ code: 0 });
        }
        catch (e) {
            console.error(e);
            res.end();
        }
    }
}

exports = module.exports = CoreOfResource;