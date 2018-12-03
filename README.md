# 后台管理系统服务端(gamegold-mgr-server)

## 概述

gamegold-mgr-server 是一个基于游戏云服务器(gamecloud, https://github.com/bookmansoft/gamecloud)的脚手架项目，一个基于 Restful / Websocket 的服务端系统
gamegold-mgr-server 可作为单页应用 gamegold-mgr (https://github.com/bookmansoft/gamegold-mgr) 的配套服务端，共同实现一个全功能后台管理系统

补充说明文档请参见 ./docs 目录

## 搭建运行环境

1. 安装系统软件，如已经具备条件请跳过

- 安装 mysql 数据库软件，默认排序规则选择 utf8_general_ci

- 安装 python@2.7

- 安装 git@2.19.1

- 安装 node@10.13

- 安装 node-gyp

```bash
npm i -g node-gyp
```

- Windows环境下补充安装

```bash
npm i -g --production windows-build-tools
```

2. 下载脚手架、安装依赖包

```bash
git clone https://github.com/bookmansoft/gamegold-mgr-server
cd gamegold-mgr-server
npm i
```

3. 创建并初始化数据库，要为每一台数据库服务器单独执行如下流程

**如何快速执行**
如果当前服务器已安装mysql，且用户名密码对为 root / helloworld 时，可直接执行如下指令，并跳过 3.1 3.2 3.3 各步骤
```bash
npm run dbinit
```

- 3.1 配置数据库连接参数，用于本地数据库的数据迁移流程

    修改配置文件 ./config/migrations/gamecloud.json , 修改其中 password 等字段

    **该配置文件在集群中不同服务器上独立配置**
    ```json
    {
    "dev": {
        "driver": "mysql",
        "user": "root",
        "password": "helloworld",
        "host": "localhost",
        "database": "gamecloud",
        "multipleStatements": true
    }
    }
    ```

- 3.2 手动创建数据库，**执行此步骤后请跳过 3.3**

    - 创建数据库 gamecloud , 建议使用此默认名称，如修改则需相应调整各配置文件

    - 数据库初始化

    ```bash
    npm run commit
    ```

- 3.3 自动创建数据库

    - 配置数据库连接参数，用于本地数据库的创建流程

    修改配置文件 ./config/database.json , 修改其中 password host 字段

    **该配置文件在集群中不同服务器上独立配置**
    ```json
    {
    "dev": {
        "driver": "mysql",
        "user": "root",
        "password": "helloworld",
        "host": "localhost"
    }
    }
    ```

    - 创建并初始化数据库

    ```bash
    npm run dbinit
    ```

## 运行后台管理系统

1. 配置数据库连接参数，用于各节点的数据库连接串

修改 ./game.config.js 文件中 sa pwd host 字段

```js
/**
 * 统一的数据库连接串，如果不同服务器连接不同数据库，需要改写 config 中各个 mysql 字段
 */
let mysql = {
    "logging" : false,          //是否开启日志
    "db": "gamecloud",          //数据库名称    
    "sa": "root",               //数据库用户名
    "pwd": "helloworld",        //数据库用户密码
    "host": "127.0.0.1",        //数据库服务器IP地址
    "port": 3306                //数据库服务器端口号
};
```

2. 启动服务

**该步骤使用了 PM2 进程管理软件，一次性启动所有当前服务器上已配置节点**
```bash
npm start
```

3. 运行单元测试

```bash
npm run test
```

4. 停止服务

```bash
npm stop
```

## 调试代码

建议使用 vs code 进行代码调试工作，

- 在 vs code 中配置 launch.json：

```js
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "启动程序",
            "program": "${workspaceFolder}\\app\\start.js"
        }
    ]
}
```

- 按下 F5 运行，设置合适的断点

- 运行单元测试，触发断点，进入单步跟踪模式

```bash
npm run test
```

## 部署网站

gamegold-mgr-server 作为游戏服务端引擎的同时，也可以承担静态网站服务器功能：

```js
//在启动节点的同时，设置静态资源映射
facade.boot({
    static: [['/client/', './web/client']],
});
```

服务器启动后，可以通过浏览器访问 http://localhost:9901/client 访问工作目录的子目录 web/client 中的静态资源

典型的工作场景为：
1. 架设 gamegold-mgr-server 作为 JSONP 服务器，并设置静态资源映射
2. 使用 React / AngularJs / VUE / CocosCreator 开发单页面应用，打包并拷贝到已映射目录中，即可对外提供服务

## 对 HTTPS 的支持

1. 修改 game.config.js 中的协议配置

```js
let config = {
    "servers":{
        "Index":{
            "1":{
                "UrlHead": "https",  //将协议由 http 修改为 https
            }
        }
    }
}
```

2. 将制作好的证书拷贝至 config/cert 目录下

3. 重新启动系统

```bash
npm start
```

**注意该配置将作用于当前服务器部署的所有节点，并不仅限于门户节点**
