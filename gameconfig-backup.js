/**
 * Created by liub on 2017-04-03.
 */

/**
 * 数据库连接信息：用于 vallnetserver
 */
let sqlOfCRM = {
    "logging" : false,                  //记录日志
    "db": "gamecloud",                  //数据库名称    
    "sa": "root",                       //数据库用户名
    "pwd": "",                          //数据库用户密码
    "host": "127.0.0.1",                //数据库服务器IP地址
    "port": 3306                        //数据库服务器端口号
};

let sqlOfChick = {
    "logging" : false,                  //记录日志
    "db": "chick_ios_1",                //数据库名称    
    "sa": "root",                       //数据库用户名
    "pwd": "",                          //数据库用户密码
    "host": "127.0.0.1",                //数据库服务器IP地址
    "port": 3306                        //数据库服务器端口号
};

/**
 * 数据库连接信息：用于 vallnetserver
 */
let sqlOfWallet = {
    "logging" : false,                  //记录日志
    "db": "wechat-wallet",              //数据库名称    
    "sa": "root",                       //数据库用户名
    "pwd": "",                          //数据库用户密码
    "host": "127.0.0.1",                //数据库服务器IP地址
    "port": 3306                        //数据库服务器端口号
};

let smsConfig = {
    realUrl: 'https://api.rtc.huaweicloud.com:10443/sms/batchSendSms/v1', //APP接入地址+接口访问URI
    appKey: '', //APP_Key
    appSecret: '', //APP_Secret
    templates: {
        test: {
            templateId: '',//模板ID
            signature: "", //条件必填,国内短信关注,当templateId指定的模板类型为通用模板时生效且必填,必须是已审核通过的,与模板类型一致的签名名称 国际/港澳台短信不用关注该参数
            sender: '', //国内短信签名通道号或国际/港澳台短信通道号
        }
    },
    statusCallBack: '', //选填,短信状态报告接收地址,推荐使用域名,为空或者不填表示不接收状态报告
};

let mailConfig = {
    user: '',
    pass: '',
    host: '',
    port: 25,
};

//系统管理员设定 todo 如何对多个分服精准配置系统管理员
let masterConfig = [
];

/**
 * 特约核心节点连接信息
 */
let vallnet = {
    type:   'testnet',
    ip:     '127.0.0.1',          //管理后台服务器的gamegoldnode地址
    head:   'http',               //远程服务器通讯协议，分为 http 和 https
    id:     'primary',            //默认访问的钱包编号
    apiKey: 'bookmansoft',        //远程服务器基本校验密码
    cid:    'xxxxxxxx-game-gold-root-xxxxxxxxxxxx', //授权节点编号，用于访问远程钱包时的认证
    token:  '03aee0ed00c6ad4819641c7201f4f44289564ac4e816918828703eecf49e382d08', //授权节点令牌固定量，用于访问远程钱包时的认证
    structured: true,             //返回结构化的参数
};

/**
 * 微信社交网络连接信息
 */
let wechat = {
    grant_type: '',
    mch_id: '',
    mch_key: '',
    appid: '',
    secret: '',
    noncestr: '',
    accessTokenUrl:'https://api.weixin.qq.com/cgi-bin/token',
    ticketUrl:'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
    cache_duration: 3600*2, //缓存时长为2小时
    miniAppId: '',
    miniAppSecret: '',
    miniBgwAppId: '',
    miniBgwAppSecret: '',
    /**
     * 必填，需要使用的JS接口列表，
     */
    jsApiList: [
        'checkJsApi',
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'
    ],
};

/**
 * 所有可用节点配置列表
 */
let config = {
    "servers":{
        "CoreOfIndex":{
            "1":{
                "debug": true,              //！！！上线时一定要修改为false！！！ 本地测试模式
                "UrlHead": "http",          //协议选择: http/https
                "MaxConnection": 3000,      //最大并发连接
                "MaxRegister": 12000,       //单服最大注册用户数
                "PoolMax": 500,             //最大数据库并发连接
                "game_secret": "",
                "game_name": "游戏云",
                "mysql": sqlOfWallet,
                "node": vallnet,
                "wechat": wechat,
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9901
                },
                "admin":{
                    "role":{
                        "default": "server",
                        "system": "server"
                    },
                    "game_secret": "123"
                },
                "authwx":{
                    "game_secret": "123"
                },
                'auth2step':{
                    "game_secret": "123"
                }
            }
        },
        "CoreOfImage":{ //新增图片服务器
            "1":{
                "mysql": sqlOfWallet,
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9501
                }
            }
        },
        "CoreOfAuth":{ //新增验证服务器
            "1":{
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9601
                }
            }
        },
        "CoreOfWallet":{
            "1":{
                "mysql": sqlOfWallet,
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9101
                }
            }
        },
        "CoreOfCRM":{ //新增CRM管理服务器
            "1":{
                "mysql": sqlOfCRM,
                "sms": smsConfig,
                "mail": mailConfig,
                "master": masterConfig,
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9801
                }
            }
        },
        "CoreOfChickIOS":{ //新增游戏服务器
            "1":{
                "mysql": sqlOfChick,
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9201
                }
            }
        }
    }
}

module.exports = config;