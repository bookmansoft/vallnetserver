/**
 * Updated by Thomas on 2018-12-18
 */

let facade = require('gamecloud');
let { UserStatus, CommMode } = facade.const;
let CoreOfBase = facade.CoreOfBase;
let rp = require('request-promise');
const crypto = require('crypto');
let { stringify } = require('../util/stringUtil');
const uuid = require('uuid');//简单使用时间戳随机即可
let config = require('../../gameconfig.js');
const tableType = require('../util/tabletype')

/**
 * 资源服对应的门面类
 */
class CoreOfResource extends CoreOfBase {
    //游戏下单【订单】
    async order(req, res) {
        try {
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
            CoreOfResource.orderMap.set(sn, data);
            console.log("订单Map对象的长度：", CoreOfResource.orderMap.size);
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
        catch (e) {
            console.error(e);
            res.json({ code: -100, message: '游戏下单失败' });
        }
    }
    //我的道具列表【确权】 /mock/:cp_name/myprops/:address
    async myProps(req, res) {
        try {
            console.log("我的道具 myProps 时间:", new Date());
            //预处理：根据cp_name取cp完整信息，先在链上取url；然后通过url取数据
            let cpParamArray = [
                req.params.cp_name,
            ];
            console.log('cp.byName 的参数:', cpParamArray);
            let cpInfo = await this.service.gamegoldHelper.execute('cp.byName', cpParamArray);
            if (!cpInfo) {
                res.json({ code: -200, message: '查询我的道具失败，CP不存在' });
                return;
            }
            //获取url并把prop数据放在Map中备用
            console.log("120:", cpInfo.url);
            let propMap = new Map();
            const fetch = require('node-fetch');

            let json = await (await fetch(cpInfo.url)).json();
            console.log("129:in", json.proplist);
            for (let i = 0; i < json.proplist.length; i++) {
                propMap.set(json.proplist[i].id, json.proplist[i]);
            }
            console.log("131:", propMap);
            // fetch(cpInfo.url).then(function(response) {
            //     return response.json();
            // })
            // .then(function(json) {
            //     // 此处的 json 已经被处理为 json 对象
            //     //添加到propMap中
            //     console.log("129:in",json.proplist);
            //     for (let i=0;i<json.proplist.length;i++) {
            //         propMap.set(json.proplist[i].id,json.proplist[i]);
            //     }
            //     console.log("131:",propMap);
            // })
            // .catch(function(err) {
            //     // 捕获错误
            //     console.log('error 136');
            //     console.error(err);
            // });

            //获取其他参数，也从params中获取
            let address = req.params.address;
            //根据cp_name设置cpid备用
            let cpid = '';
            if (req.params.cp_name == 'cp0326') {
                cpid = '229a4970-4f77-11e9-b118-e3d1ba95e1a5';
            }

            //查询我的道具（指定cp）
            let paramArray = [
                cpid,
                address,
            ];
            console.log('queryProps 的参数:', paramArray);
            let retProps = await this.service.gamegoldHelper.execute('queryProps', paramArray);
            //console.log(ret);

            //拼装数据
            let retData = [];
            for (let i = 0; i < retProps.length; i++) {
                console.log("177:", retProps[i].oid);
                let prop = propMap.get(retProps[i].oid);
                console.log("179:", prop);
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



            res.json({ code: 0, data: retData });
        }
        catch (e) {
            console.error(e);
            res.json({ code: -100, message: '查询我的道具失败' });
        }
    }
    //来自链的回调接口【认证】
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
                console.log("orderMap集合的大小:", CoreOfResource.orderMap.size);
                let theOrder = CoreOfResource.orderMap.get(data.sn);
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
    // 定时触发证券值记录
    async stockJob(req, res) {
        console.log("stockJob触发:", req.params.id);
        try {
            //0、获取对象及cid
            let cpstockbase = this.core.GetObject(tableType.CpStockBaseEntity, parseInt(req.params.id));
            if (!!!cpstockbase) {
                console.log("cpstockbase不存在!", req.params.id);
                return;
            }
            let cid = cpstockbase.getAttr("cid");
            //1、先获取当前区块位置，再向前推144个（测试为1440个）区块取行情
            let retBlockCount = await this.service.gamegoldHelper.execute('block.count', []);
            if (retBlockCount - 1440 < 0) {
                console.log("无法取得当前区块，放弃执行stockJob定时任务。");
                return;
            }
            let firstBlockCount = retBlockCount - 1440;//144
            console.log('需要显示数据的区块为从: ', firstBlockCount, ' 到: ', retBlockCount);
            //2、查询指定区块至今的数据集
            let paramArray = [
                7,  //有偿转让凭证交易查询
                cid,
                firstBlockCount,
            ];
            console.log('stock.record 的参数:', paramArray);
            let stockRecordList = (await this.service.gamegoldHelper.execute('stock.record', paramArray)).list;
            console.log(stockRecordList);
            if (stockRecordList.length > 0) {
                let stock_open = stockRecordList[0].price;
                let stock_close = stockRecordList[stockRecordList.length - 1].price;
                //最高价最低价，先设置为开盘价
                let stock_high = stock_open;
                let stock_low = stock_open;
                let total_amount = 0;
                let total_num = 0;
                for (let stockInfo of stockRecordList) {
                    total_num = total_num + stockInfo.sum;
                    total_amount = total_amount + stockInfo.sum * stockInfo.price;
                    console.log('发现股票价格' + stockInfo.price);
                    if (stockInfo.price > stock_high) {
                        stock_high = stockInfo.price;
                    }
                    if (stockInfo.price < stock_low) {
                        stock_low = stockInfo.price;
                    }
                }
                //记录股票的开盘、收盘价等数据
                //..todo
                let today = new Date();
                console.log(
                    cpstockbase.getAttr("cid"),
                    cpstockbase.getAttr("cp_name"),
                    cpstockbase.getAttr("cp_text"),
                    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
                    stock_open,
                    stock_close,
                    stock_high,
                    stock_low,
                    total_num,
                    total_amount,
                );

                let cpstock = await this.core.GetMapping(tableType.CpStockEntity).Create(
                    cpstockbase.getAttr("cid"),
                    cpstockbase.getAttr("cp_name"),
                    cpstockbase.getAttr("cp_text"),
                    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
                    stock_open,
                    stock_close,
                    stock_high,
                    stock_low,
                    total_num,
                    total_amount,
                );
                console.log("保存cpstock成功");
            }

        } catch (error) {
            console.log(270, '定时任务stockJobBase出错');
        }
    }

    // 定时触发证券挂单情况查询及记录
    async stockJobBase(req, res) {
        console.log("stockJobBase触发:", req.params.id);
        try {
            //0、获取对象及cid
            let cpstockbase = this.core.GetObject(tableType.CpStockBaseEntity, parseInt(req.params.id));
            if (!!!cpstockbase) {
                console.log("cpstockbase不存在!", req.params.id);
                return;
            }
            let cid = cpstockbase.getAttr("cid");
            //1、先获取当前区块位置，再向前推144个（测试环境取最近一天的数据，实际可只需要1个区块）区块取行情
            let retBlockCount = await this.service.gamegoldHelper.execute('block.count', []);
            if (retBlockCount - 144 < 0) {
                console.log("无法取得当前区块，放弃执行stockJobBase定时任务。");
                return;
            }
            let firstBlockCount = retBlockCount - 144;//6或144
            console.log('需要显示数据的区块为从: ', firstBlockCount, ' 到: ', retBlockCount);
            //2、查询指定区块至今的数据集
            let paramArray = [
                6,  //有偿转让凭证挂单查询
                cid,
                firstBlockCount,
            ];
            console.log('stock.record 的参数:', paramArray);
            let stockRecordList = await this.service.gamegoldHelper.execute('stock.record', paramArray);
            console.log(stockRecordList);
            if (stockRecordList.count != 0) {
                //console.log('第一个元素',stockRecordList.list[0]);
                let sell_stock_amount = stockRecordList.list[0].price;
                let sell_stock_num = stockRecordList.list[0].sum;
                cpstockbase.setAttr('sell_stock_amount', sell_stock_amount);
                cpstockbase.setAttr('sell_stock_num', sell_stock_num);
                console.log("302 更新到数据库中");
                cpstockbase.Save();
                console.log("304 更新完成");
            }


        } catch (error) {
            console.log(317, '定时任务stockJobBase出错');
        }
    }

    async Start(app) {
        this.orderMap = new Map();
        //Image Server构造比较简单，此处也没有调用父类的Start

        let hrv = this.options.UrlHead == "https" ?
            require(this.options.UrlHead).createServer(this.credentials, app) :
            require(this.options.UrlHead).createServer(app);
        //启动网络服务
        hrv.listen(this.options.webserver.port, this.options.webserver.host, () => {
            console.log(`资源服务在端口 ${this.options.webserver.port} 上准备就绪`);
        });

        //QRCode处理
        app.get('/qrcode/:qrcode', (req, res) => {
            let qr = require('qr-image');
            if (!!req.params.qrcode) {
                try {
                    let img = qr.image(req.params.qrcode, { size: 10 });
                    res.writeHead(200, { 'Content-Type': 'image/png' });
                    img.pipe(res);
                }
                catch (e) {
                    console.error(e);
                    res.end();
                }
            }
            else {
                try {
                    rp({ uri: decodeURIComponent(facade.config.fileMap.DataConst.user.icon), headers: { 'User-Agent': 'Request-Promise', } }).pipe(res);
                }
                catch (e) {
                    console.error(e);
                    res.end();
                }
            }
        });
        //k线图
        app.get('/chart/kline', (req, res) => {
            let connection = null;
            try {
                console.log("302", req.query.cid);
                let dtData = new Array();
                let stockData = new Array();
                connection = require('mysql').createConnection({
                    host: this.options.mysql.host,
                    user: this.options.mysql.sa,
                    password: this.options.mysql.pwd,
                    port: this.options.mysql.port,
                    database: this.options.mysql.db,
                });
                console.log(311);
                connection.connect();
                console.log("conn ok!");
                var select = 'SELECT * FROM cp_stock where cid=? order by id asc';//暂不考虑最多多少条，全部输出有数据
                //查 query
                connection.query(select, [req.query.cid], function (err, result) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }
                    console.log(result);
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
                            text: '众筹凭证指数(游戏金本位)'
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
                            data: []//'众筹凭证指数(游戏金本位)'
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
                                // data: [
                                //     '2019-05-07', '2019-05-07'
                                // ]
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
                                // data: [
                                //     [80,100,70,110],
                                //     [80,100,70,110],
                                // ],
                            }
                        ]
                    };
                    //发送k线图的数据，采用JSONP协议，即callback(option);
                    res.jsonp(option);
                });


            }
            catch (e) {
                console.error(e);
                res.end();
            }
            finally {
                try {
                    //关闭连接
                    connection.end();
                } catch (ex1) {
                }
            }
        });

        //模拟CP服务————/cp0104 /cp0107 /cp010802
        //获取第4个字母起的所有数字（即规定只能有最多4个字母，不允许超过）。
        //对该字符串parseInt 后 %4，取出的模，作为分组号
        app.get('/mock/:cp_name', (req, res) => {
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
                    let arrayPropName = [
                        'M416自动步枪',
                        '北极50地狱行者',
                        '超级跑车',
                        'T10自行反坦克车',
                    ];
                    //定义道具列表的一项（即模板）
                    let propTemplate = {
                        "id": null,
                        "props_name": arrayPropName[groupNum],
                    }
                    //随机生成0-99个道具并添加到数组中
                    let propArray = new Array();
                    let propCount = 5;//Math.floor(Math.random() * 100);
                    for (let i = 0; i < propCount; i++) {
                        let prop = {};
                        Object.assign(prop, propTemplate);
                        prop.id = req.params.cp_name + "_prop_" + i;
                        prop.props_name = prop.props_name + "-" + i;
                        prop.props_price = 100001 + parseInt(i) * 10000,//非标准参数，仅供模拟cp客户端使用
                            prop.icon = "http://114.116.148.48:9701/image/" + groupNum + "/prop_icon.jpg",//非标准参数，仅供模拟cp客户端使用
                            prop.props_rank = 3,//非标准参数，仅供模拟cp客户端使用
                            propArray.push(prop);
                    }

                    //分组
                    let arrayGameTitle = [
                        'Code of War',
                        'Mercs of Boom',
                        '孤胆车神',
                        '坦克大战',
                    ];
                    let arrayCpTye = [
                        'ACT', 'SHT', 'ACT', 'WAR',
                    ];
                    let arrayDesc = [
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
                    let arrayUC = [
                        '与您的朋友并肩作战，在现代在线动作游戏Code of War的排行榜中取得更高排名！ 邀请您的朋友，一起免费畅游！',
                        'Upgrade your base and research futuristic technology to gain access to advanced warfare. ? Play anywhere, anytime, and even offline to stop the threat in an epic campaign.',
                        '玩出真我风采！ ? 大量自定义选项，按照自己的形象创建角色也毫无压力！ ? 装备、融合以及进化数百种武器、交通工具、帮派成员和其他项，打造最符合您自身个性的独特帮派技能。从狙击手到爆破专家，选择丰富多样——那么，你会挑哪一种呢？',
                        '1.全民系列军事策略手游力作 2.世界征服国战开启，三大阵营酣战淋漓 2.装备新科技的坦克在历史战场完美再现 3.完美操控坦克部队，战场瞬息由你掌握',
                    ];
                    // 编组cpInfo
                    let cpInfo = {
                        "game": {
                            "cp_name": req.params.cp_name,
                            "game_title": `${arrayGameTitle[groupNum]}(${req.params.cp_name})`,
                            "cp_type": arrayCpTye[groupNum],
                            "icon_url": "http://114.116.148.48:9701/image/" + groupNum + "/icon_img.jpg",
                            "small_img_url": "http://114.116.148.48:9701/image/" + groupNum + "/small_img.jpg",
                            "large_img_url": "http://114.116.148.48:9701/image/" + groupNum + "/large_img.jpg",
                            "pic_urls": ["http://114.116.148.48:9701/image/" + groupNum + "/pic1.jpg",
                            "http://114.116.148.48:9701/image/" + groupNum + "/pic2.jpg",
                            "http://114.116.148.48:9701/image/" + groupNum + "/pic3.jpg"],
                            "desc": arrayDesc[groupNum],
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
        });
        //特殊处理，给予错误提示
        app.get('/mock', (req, res) => {
            try {
                let result = { code: -1, message: "format is: http://host/:cp_name" };
                res.json(result);
            }
            catch (e) {
                console.error(e);
                res.end();
            }
        });
        //特殊处理，给予错误提示
        app.get('/mock/:cp_name/prop', (req, res) => {
            try {
                let result = { code: -2, message: "format is: http://host/:cp_name/prop/:id" };
                res.json(result);
            }
            catch (e) {
                console.error(e);
                res.end();
            }
        });
        //属性详情处理
        app.get('/mock/:cp_name/prop/:id', (req, res) => {
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
                let propIndexArray = req.params.id.split('_prop_');
                let propIndex = propIndexArray[propIndexArray.length - 1];
                //设置数组
                let arrayPropName = [
                    'M416自动步枪',
                    '北极50地狱行者',
                    '超级跑车',
                    'T10自行反坦克车',
                ];
                let arrayDesc = [
                    'M4虽然是很多的玩家喜爱的步枪，但是随着版本的改动现在已经垫底了，配件也是非常的多，没有配件的M4基本就是个烧火棍，但是满配了以后还是可以玩的，EatChicken的最佳武器之一',
                    '北极50拥有极高的准确度，栓动射击大大的保证了武器的精度。狙击枪的盲射是所有武器中最差的，弹道散射大，即便贴身了，也难以击中。',
                    '极其稀有的超级跑车，一旦拥有，便能上天入地。W12四涡轮增压喷气式引擎，配合极度流畅的车身线条，可以直接使角色上天与太阳肩并肩，轻松完成任何任务。',
                    '仅支持金币购买的超值坦克，性价比超高，配合AP弹，轻松击穿同级其他坦克。需要配备驾驶成员4名，支持AP弹和HE弹。',

                ];

                let prop = {
                    "id": req.params.id,
                    "props_name": arrayPropName[groupNum] + propIndex,
                    "icon": "http://114.116.148.48:9701/image/" + groupNum + "/prop_icon.jpg",
                    "large_icon": "http://114.116.148.48:9701/image/" + groupNum + "/prop_large_icon.jpg",
                    "more_icon": ["http://114.116.148.48:9701/image/" + groupNum + "/prop_pic1.jpg",
                    "http://114.116.148.48:9701/image/" + groupNum + "/prop_pic2.jpg",
                    "http://114.116.148.48:9701/image/" + groupNum + "/prop_pic3.jpg"],
                    "props_type": "装备",
                    "props_desc": arrayDesc[groupNum],
                    "props_price": 100001 + parseInt(propIndex) * 10000,
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
                res.json(prop);
            }
            catch (e) {
                console.error(e);
                res.end();
            }
        });

        //我的道具列表【确权】
        app.get('/mock/:cp_name/myprops/:address', this.myProps);
        //【订单】游戏客户端下单的post方法；除了cp_name以外，其他参数以JSON格式在request-body中提交
        app.post('/mock/:cp_name/order', this.order);
        //【认证】回调通知
        app.post('/mock/:cp_name/testnet/order/confirm', this.orderConfirm);
        //cp_stock自动触发行情计算和入库
        app.get('/stockJob/:id', this.stockJob);
        //cp_stock_base自动触发证券挂单信息查询和入库
        app.get('/stockJobBase/:id', this.stockJobBase);

        //静态页面
        app.get('/', (req, res) => {
            res.redirect('index.html');
        });
        app.get('/:filename', (req, res) => {
            var options = {
                root: __dirname + '../../../web/dist/',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            let filename = req.params.filename;
            filename = filename.replace(/#/g, '');
            res.sendFile(filename, options, function (err) {
                // console.log(req.params.filename);
                if (err) {
                    console.log(err);
                } else {
                    // console.log('Sent OK');
                }
            });

        });
        app.get('/static/:filename', (req, res) => {
            var options = {
                root: __dirname + '../../../web/dist/static/',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            let filename = req.params.filename;
            filename = filename.replace(/#/g, '');
            res.sendFile(filename, options, function (err) {
                // console.log(req.params.filename);
                if (err) {
                    console.log(err);
                } else {
                    // console.log('Sent OK');
                }
            });

        });
        //图片资源，虽然放在web下，但是不属于start.js启动的静态内容，而是9701端口
        //即实际上9101只有索引服作用；9901端口只有认证服作用；
        //静态内容、二维码动态生成以及模拟游戏服务器都归入9701
        app.get('/image/:filename', (req, res) => {
            var options = {
                root: __dirname + '../../../web/image/',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            //发送图片
            res.sendFile(req.params.filename, options, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log('Sent OK');
                }
            });

        });
        //子目录
        app.get('/image/:group/:filename', (req, res) => {
            var options = {
                root: __dirname + '../../../web/image/' + req.params.group + '/',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            //发送图片
            res.sendFile(req.params.filename, options, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log('Sent OK');
                }
            });

        });

        //---------------------------------------------------------------
        //模拟游戏客户端
        app.get('/cp-client/:filename', (req, res) => {
            var options = {
                root: __dirname + '../../../web/cp-client/',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            //发送图片
            res.sendFile(req.params.filename, options, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log('Sent OK');
                }
            });

        });
        //子目录
        app.get('/cp-client/:group/:filename', (req, res) => {
            var options = {
                root: __dirname + '../../../web/cp-client/' + req.params.group + '/',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            //发送图片
            res.sendFile(req.params.filename, options, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log('Sent OK');
                }
            });

        });
        //孙目录
        app.get('/cp-client/:group/:group2/:filename', (req, res) => {
            var options = {
                root: __dirname + '../../../web/cp-client/' + req.params.group + '/' + req.params.group2 + '/',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            //发送图片
            res.sendFile(req.params.filename, options, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log('Sent OK');
                }
            });

        });



        //---------------------------------------------------------------
        //K线图静态资源
        app.get('/echart/:filename', (req, res) => {
            var options = {
                root: __dirname + '../../../web/echart/',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            //发送图片
            res.sendFile(req.params.filename, options, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log('Sent OK');
                }
            });

        });
        //子目录
        app.get('/echart/:group/:filename', (req, res) => {
            var options = {
                root: __dirname + '../../../web/echart/' + req.params.group + '/',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            //发送图片
            res.sendFile(req.params.filename, options, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log('Sent OK');
                }
            });

        });
        //孙目录
        app.get('/echart/:group/:group2/:filename', (req, res) => {
            var options = {
                root: __dirname + '../../../web/echart/' + req.params.group + '/' + req.params.group2 + '/',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            //发送图片
            res.sendFile(req.params.filename, options, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log('Sent OK');
                }
            });

        });
        //曾孙目录
        app.get('/echart/:group/:group2/:group3/:filename', (req, res) => {
            var options = {
                root: __dirname + '../../../web/echart/' + req.params.group + '/' + req.params.group2 + '/' + req.params.group3 + '/',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            //发送图片
            res.sendFile(req.params.filename, options, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log('Sent OK');
                }
            });

        });
    }

    static get orderMap() {
        if (!this.$orderMap) {
            console.log("764 初始化");
            this.$orderMap = new Map();
        }
        console.log(JSON.stringify(this.$orderMap));
        return this.$orderMap;
    }
    static set orderMap(val) {
        console.log("770 设置值，此方法可能不会使用")
        this.$orderMap = val;
    }

    /**
     * 映射自己的服务器类型数组，提供给核心类的类工厂使用
     */
    static get mapping() {
        if (!this.$mapping) {
            this.$mapping = ['Resource'];
        }
        return this.$mapping;
    }
    static set mapping(val) {
        this.$mapping = val;
    }
}

exports = module.exports = CoreOfResource;

