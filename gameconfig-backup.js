/**
 * Created by liub on 2017-04-03.
 */

/**
 * 统一的数据库连接串，如果不同服务器连接不同数据库，需要改写 config 中各个 mysql 字段
 */
let mysql = {
    "logging" : false,                  //记录日志
    "db": "wechat-wallet",              //数据库名称    
    "sa": "root",                       //数据库用户名
    "pwd": "",                          //数据库用户密码
    "host": "119.3.201.58",             //数据库服务器IP地址
    "port": 3306                        //数据库服务器端口号
};

let redis = {
    "host": "127.0.0.1",
    "port": 6379,
    "opts": {}
};

let node = {
    type:   'testnet',
    ip:     '114.116.148.48',     //管理后台服务器的gamegoldnode地址
    //ip:     '114.116.14.176',     //原来的：远程服务器地址
    head:   'http',               //远程服务器通讯协议，分为 http 和 https
    id:     'primary',            //默认访问的钱包编号
    apiKey: 'bookmansoft',        //远程服务器基本校验密码
    cid:    'xxxxxxxx-game-gold-root-xxxxxxxxxxxx', //授权节点编号，用于访问远程钱包时的认证
    token:  '03aee0ed00c6ad4819641c7201f4f44289564ac4e816918828703eecf49e382d08', //授权节点令牌固定量，用于访问远程钱包时的认证
    structured: true,           //结构化参数
};

let node_cp = {
    type:   'testnet',
    ip:     '114.116.12.248',     //远程服务器地址
    head:   'http',               //远程服务器通讯协议，分为 http 和 https
    id:     'primary',            //默认访问的钱包编号
    apiKey: 'bookmansoft',        //远程服务器基本校验密码
    cid:    'xxxxxxxx-game-gold-root-xxxxxxxxxxxx', //授权节点编号，用于访问远程钱包时的认证
    token:  '03aee0ed00c6ad4819641c7201f4f44289564ac4e816918828703eecf49e382d08', //授权节点令牌固定量，用于访问远程钱包时的认证
};

let config = {
    "servers":{
        "Index":{
            "1":{
                "debug": true,              //本地测试模式
                "UrlHead": "http",          //协议选择: http/https
                "MaxConnection": 3000,      //最大并发连接
                "MaxRegister": 12000,       //单服最大注册用户数
                "PoolMax": 500,             //最大数据库并发连接
                "game_secret": "",
                "game_name": "游戏云",
                "redis": redis,
                "mysql": mysql,
                "node": node,
                "node_cp": node_cp,
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9901
                },
                "auth": {
                    "openid": "18681223392",
                    "openkey": "18681223392",
                    "domain": "tx.IOS",
                    "tokenExp": 600,
                    "sessionExp": 7200,
                    "pf": "wanba_ts"
                },
                "admin":{
                    "role":{
                        "default": "chick.server",
                        "system": "chick.server"
                    },
                    "game_secret": ""
                },
                "tx": {
                    "appid": "1105943531",
                    "appkey": "",
                    "pay_appid": "",
                    "pay_appkey": "",
                    "reportApiUrl": "http://tencentlog.com",
                    "openApiUrl": "https://api.urlshare.cn",
                    "openApiUrlWithPay":"https://api.urlshare.cn"
                },
                "360":{
                    "appid":"203500811",
                    "game_key": "",
                    "game_secret": ""
                }
            }
        },
        "Image":{ //新增图片服务器
            "1":{
                "mysql": mysql,
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9401
                }
            }
        },
        "IOS":{
            "1":{
                "mysql": mysql,
                "webserver": {
                    "mapping": "127.0.0.1",
                    "host": "127.0.0.1",
                    "port": 9101
                }
            }
        }
    },
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    "apps" : [
        {
            "name"      : "Chick_IOS_1",
            "script"    : "app/start.js",
            "cwd"         : "./",  // pm2运行目录相对main.js的路径
            //"out_file"   : "./logs/ios1/app-out.log",  // 普通日志路径
            "error_file" : "./logs/ios1/app-err.log",  // 错误日志路径
            "env": {
                "NODE_ENV": "production",
                "sys":{
                    "serverType": "IOS",
                    "serverId": 1,
                    "portal": true //指示该服务器兼任门户
                }
            }
        }
        // ,{ //gamegold全节点配置
        //     "name"      : "gamegold",
        //     "script"    : "app/gamegold.js",
        //     "cwd"         : "./",  // pm2运行目录相对main.js的路径
        //     //"out_file"   : "./logs/gamegold/app-out.log",  // 普通日志路径
        //     "error_file" : "./logs/gamegold/app-err.log"     // 错误日志路径
        // }
    ]
}

module.exports = config;