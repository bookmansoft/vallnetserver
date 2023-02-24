let config = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    "apps" : [
        // {
        //     "name"      : "Wallet_1",
        //     "script"    : "app/start.js",
        //     "cwd"         : "./",  // pm2运行目录相对main.js的路径
        //     //"out_file"   : "./logs/ios1/app-out.log",  // 普通日志路径
        //     "error_file" : "./logs/ios1/app-err.log",  // 错误日志路径
        //     "env": {
        //         "NODE_ENV": "production",
        //         "sys":{
        //             "serverType": "Wallet",
        //             "serverId": 1,
        //             "portal": true //指示该服务器兼任门户
        //         }
        //     }
        // },
        // { //gamegold全节点配置
        //     "name"      : "gamegold",
        //     "script"    : "app/gamegold.js",
        //     "cwd"         : "./",  // pm2运行目录相对main.js的路径
        //     //"out_file"   : "./logs/gamegold/app-out.log",  // 普通日志路径
        //     "error_file" : "./logs/gamegold/app-err.log"     // 错误日志路径
        // },
        {
            "name"      : "Chick_1",
            "script"    : "app/start.js",
            "cwd"         : "./",  // pm2运行目录相对main.js的路径
            "out_file"   : "./logs/chick1/app-out.log",  // 普通日志路径
            "error_file" : "./logs/chick1/app-err.log",  // 错误日志路径
            "env": {
                "NODE_ENV": "production",
                "sys":{
                    "serverType": "IOS",
                    "serverId": 1,
                    "portal": true //指示该服务器兼任门户
                }
            }
        }
    ]
}

module.exports = config;