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
        //             "serverType": "CoreOfWallet",
        //             "serverId": 1,
        //             "portal": false //指示该服务器兼任门户
        //         }
        //     }
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
                    "serverType": "CoreOfChickIOS", //一定要是对应类mapping方法中返回的类型之一
                    "serverId": 1,
                    "portal": true //指示该服务器兼任门户
                }
            }
        }
    ]
}

module.exports = config;