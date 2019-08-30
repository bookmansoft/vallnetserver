let facade = require('gamecloud')
let {EntityType, IndexType, ReturnCode} = facade.const
let mysql = require('mysql');

/**
 * 游戏提供的对外接口：查询K线数据
 */
class kline extends facade.Control
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
            [`/chart/kline`, 'listenEChart'],
        ];
    }

    /**
     * k线图
     * @param {*} params 
     */
    listenEChart(params) {
        let connection = null;
        try {
            let dtData = new Array();
            let stockData = new Array();
            connection = mysql.createConnection({
                host: this.core.options.mysql.host,
                user: this.core.options.mysql.sa,
                password: this.core.options.mysql.pwd,
                port: this.core.options.mysql.port,
                database: this.core.options.mysql.db,
            });
            connection.connect();
            connection.query('SELECT * FROM cp_stock where cid=? order by id asc', [params.cid], function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }

                //把上述结构设置到目标数据结构
                for (let i = 0; i < result.length; i++) {
                    result[i] = JSON.parse(JSON.stringify(result[i]));
                    /**
                    {
                        `id`             int(11),        'cp记录流水号'
                        `cid`            varchar(255)    'cp编码',
                        `stock_day`      varchar(10)     '发生交易的年月日',
                        `stock_open`     int(11)         '开盘价',
                        `stock_close`    int(11)         '收盘价',
                        `stock_high`     int(11)         '最高价',
                        `stock_low`      int(11)         '最低价',
                        `total_num`      bigint(20)      '总成交数量（凭证数量）',
                        `total_amount`   bigint(20)      '总成交金额（游戏金）',
                    }
                    */                    
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
        } catch (e) {
            console.error(e);
        } finally {
            if(!!connection) {
                connection.end();
            }
        }
    }

    /**
     * 返回对应CP的结构化信息
     */
    getInfo(params) {
        if (!params.cp_name) {
            return {code: -1};
        }

        let groupNum = 0;//默认为0
        try {
            groupNum = parseInt(params.cp_name.substr(4)) % 4;
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
                "game_title": `${arrayGameTitle[groupNum]}(${params.cp_name})`,
                "cp_type": arrayCpTye[groupNum],
                "icon_url": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/${groupNum}/icon_img.jpg`,
                "small_img_url": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/small_img.jpg",
                "large_img_url": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/large_img.jpg",
                "pic_urls": [`http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/pic1.jpg",
                `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/pic2.jpg",
                `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/pic3.jpg"],
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
        return {code:0, data: cpInfo};
    }
}

exports = module.exports = kline;
