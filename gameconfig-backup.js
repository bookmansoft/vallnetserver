/**
 * Created by liub on 2017-04-03.
 */

/**
 * 数据库连接信息：用于 gamegold-mgr-server
 */
let sqlOfCRM = {
    "logging" : false,                  //记录日志
    "db": "gamecloud",                  //数据库名称    
    "sa": "root",                       //数据库用户名
    "pwd": "",                          //数据库用户密码
    "host": "127.0.0.1",                //数据库服务器IP地址
    "port": 3306                        //数据库服务器端口号
};

/**
 * 数据库连接信息：用于 gamegold-wechat-server
 */
let sqlOfWallet = {
    "logging" : false,                  //记录日志
    "db": "wechat-wallet",              //数据库名称    
    "sa": "root",                       //数据库用户名
    "pwd": "",                          //数据库用户密码
    "host": "127.0.0.1",                //数据库服务器IP地址
    "port": 3306                        //数据库服务器端口号
};

/**
 * 缓存服务器连接信息
 */
let redis = {
    "host": "127.0.0.1",
    "port": 6379,
    "opts": {}
};

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
    notifyUrl: '',
    grant_type: '',
    mch_id: '',
    mch_key: '',
    appid: '',
    secret: '',
    noncestr: '',
    accessTokenUrl:'https://api.weixin.qq.com/cgi-bin/token',
    ticketUrl:'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
    cache_duration:1000*60*60*24, //缓存时长为24小时
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
        "Index":{
            "1":{
                "debug": true,              //！！！上线时一定要修改为false！！！ 本地测试模式
                "UrlHead": "http",          //协议选择: http/https
                "MaxConnection": 3000,      //最大并发连接
                "MaxRegister": 12000,       //单服最大注册用户数
                "PoolMax": 500,             //最大数据库并发连接
                "game_secret": "",
                "game_name": "游戏云",
                "redis": redis,
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
        "Image":{ //新增图片服务器
            "1":{
                "mysql": sqlOfWallet,
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9501
                }
            }
        },
        "Auth":{ //新增验证服务器
            "1":{
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9601
                }
            }
        },
        "IOS":{
            "1":{
                "mysql": sqlOfWallet,
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9101
                }
            }
        },
        "Resource":{ //新增资源管理服务器
            "1":{
                "mysql": sqlOfCRM,
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9701
                }
            }
        },
        "CRM":{ //新增CRM管理服务器
            "1":{
                "mysql": sqlOfCRM,
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9801
                }
            }
        }
    },
}

module.exports = config;