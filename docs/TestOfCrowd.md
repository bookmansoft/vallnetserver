# 众筹一级市场调测方案

## 调测流程

1. 将主网本地节点恢复到初始阶段，高度调整为100
2. 操作员登录CRM，创建CP并发布众筹
3. 管理员登录CRM，批准该众筹
4. Alice登录钱包，获取收款地址
5. 管理员为Alice转账
6. Alice收到款项后，购买凭证
7. 管理员后台模拟发起一笔消费
8. Alice通过钱包查询到消费分成

## 问题和解决方案

1. CRM和钱包都是直接从主网查询一级市场交易信息，缺乏一个中间层，这对提高并发性、累计汇总信息、信息管控带来诸多不便

解决方案如下：
- 重新启用 our_stock_base 表作为缓冲层
- 系统启动时，查询所有处于发行期的众筹项目，和库表中记录比对，主网有而库表没有的添加到库表，库表有而主网没有的从库表删除
- 对新增条目，联合查询 our_block_games 记录，没有的需要调用CP接口进行数据集采
- 对库表中所有条目，查询主网流水记录，更新汇总信息
- 监听CP发行消息，及时更新库表信息
- 以库表数据为准，面向客户端开放查询接口

2. 众筹支付

首先解决配置表问题。目前支付信息是直接配置在客户端的，这样很容易和服务端产生数据不一致性

解决方案如下：
- 在 GLOBAL 中统一设置一个配置表管理对象 ConfigMgr
- 当需要名为 fileName 的配置表时，检测本地缓存，必要时向服务端拉取再缓存于 ConfigMgr 中
- 页面检测并引用 ConfigMgr['fileName']

## 相关数据结构

1. 流水查询结果
```json
{
    "list": [
        {
            "height": 104,
            "txid": "b217739878cca6b6435e5ae48b26772be738475164e250c5bf5d7ce371f32e09",
            "type": 7,                                                //交易类型
            "cid": "628e5800-a585-11e9-8d3d-5b0483df26be",            //CP编码
            "sum": 200,                                               //数量
            "price": 20,                                              //价格
            "addr": "tb1qk7qafkrkghdszmtkz3qftskhrfzu9087rrasgn",
            "to": "tb1qz4aesprvtz36rhjml78ls5z4yx05lv7j25vz3s",
            "sn": 3334850194
        }
    ],
    "count":1,
    "page":1,
    "cur":1,
    "countCur":1
}
```

2. 交易流水类型
```js
{
    Offer: 1,           //发行凭证
    Purchase: 2,        //购买发行的凭证
    Send: 3,            //无偿转让凭证
    Bonus: 4,           //凭证分成
    Ads: 5,             //媒体分成
    Bid: 6,             //有偿转让凭证
    Auction: 7,         //购买有偿转让的凭证
}
```

3. CP接口提供的信息
```js
{
    "large_img_url": `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/large_img.jpg",
    "desc": arrayDesc[groupNum],
    "provider": arrayProvider[groupNum],
    "cp_name": req.params.cp_name,
    "game_title": `${arrayGameTitle[groupNum]}(${req.params.cp_name})`,
    "cp_type": arrayCpTye[groupNum],
    "icon_url": `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/${groupNum}/icon_img.jpg`,
    "small_img_url": `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/small_img.jpg",
    "pic_urls": [`http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/pic1.jpg",
    `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/pic2.jpg",
    `http://${this.options.webserver.mapping}:${this.options.webserver.port}/image/` + groupNum + "/pic3.jpg"],
    "version": "V1.0",
    "publish_time": 1545606613,
    "update_time": 1545706613,
    "update_content": "更新了最新场景和新的地图",
    "state": 1,
}
```

4. stockbase 提供的内容
```js
{
    //众筹列表页使用 Start
    `large_img_url` VARCHAR(255) NULL DEFAULT NULL COMMENT '游戏主图',
    `funding_text` VARCHAR(500) NULL DEFAULT NULL COMMENT '众筹简介',
    `provider` VARCHAR(255) NULL DEFAULT NULL COMMENT '游戏开发商',
    `stock_money` INT(11) NULL DEFAULT NULL COMMENT '众筹单份价格（人民币：分）', - 使用 众筹价格 填充
    `supply_people_num` INT(11) NULL DEFAULT NULL COMMENT '支持人数', - 使用 买单数量 填充
    `funding_done_amount` BIGINT(20) NULL DEFAULT NULL COMMENT '众筹已完成金额', - 使用 买单总额 填充
    `funding_target_amount` BIGINT(20) NULL DEFAULT NULL COMMENT '众筹目标金额', - 使用 众筹总量 填充
    //众筹列表页使用 End
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `cid` VARCHAR(50) NOT NULL COMMENT '链数据库cid',
    `cp_name` VARCHAR(255) NOT NULL COMMENT '游戏简称',
    `cp_text` VARCHAR(255) NOT NULL COMMENT '游戏中文名',
    `total_num` BIGINT(20) NULL DEFAULT NULL COMMENT '流通凭证总数量',
    `sell_stock_amount` BIGINT(20) NULL DEFAULT NULL COMMENT '最新挂单价格（游戏金）',
    `sell_stock_num` INT(11) NULL DEFAULT NULL COMMENT '挂单数量（15单在售）',
    `base_amount` INT(11) NULL DEFAULT NULL COMMENT '发行价格（游戏金，作为比较基准替代昨日价格）',
    `small_img_url` VARCHAR(255) NULL DEFAULT NULL COMMENT '游戏小图',
    `icon_url` VARCHAR(255) NULL DEFAULT NULL COMMENT '游戏图标',
    `pic_urls` VARCHAR(2000) NULL DEFAULT NULL COMMENT '游戏组图JSON',
    `cp_desc` VARCHAR(2000) NULL DEFAULT NULL COMMENT '游戏详情',
    `funding_project_text` VARCHAR(2000) NULL DEFAULT NULL COMMENT '项目介绍',
    `supply_money` INT(11) NULL DEFAULT NULL COMMENT '支持金额(分)',
    `funding_residue_day` INT(11) NULL DEFAULT NULL COMMENT '剩余天数',
    `history_text` VARCHAR(2000) NULL DEFAULT '' COMMENT '历史业绩信息JSON数组',
    `now_sale` VARCHAR(2000) NULL DEFAULT NULL COMMENT '现在挂单卖出的JSON字符串',
}
```

5. 主网提供的内容
```json
{
    "list": [
        {
        "cid": "c8a0f5c0-aac2-11e9-a161-79eeb2900306",
        "name": "cp010063",
        "url": "http://localhost:9701/mock",
        "ip": "",
        "cls": "",
        "grate": 15,
        "current": {
            "hash": "60b878b946c8f95a95ecfeda003a18e8f5f03c7547f7b399f3ff65782824d669",
            "index": 0,
            "address": "tb1quqkf9g5fv5uk8a9snqtqlx9hrspfsf3lr4vw40"
        },
        "stock": {
            "hHeight": 13912,
            "hSum": 0,
            "hPrice": 0,
            "hBonus": 0,
            "hAds": 0,
            "sum": 10000,          // 众筹数量
            "price": 5000,         // 众筹价格
            "height": 13912        // 众筹高度
        },
        "height": 13476,
        "status": 0
        }
    ],
    "count": 1,
    "page": 1,
    "cur": 1,
    "countCur": 1
}
```

6. our_block_games 提供的内容
```js
{
	`id` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增',
	`game_code` VARCHAR(32) NOT NULL COMMENT '编码',
	`sort` INT(4) UNSIGNED NOT NULL DEFAULT '0' COMMENT '排序',
	`category_id` INT(2) UNSIGNED NOT NULL DEFAULT '0' COMMENT '游戏类别',
	`category_title` VARCHAR(32) NULL DEFAULT '' COMMENT '类别名',
	`provider_id` INT(4) UNSIGNED NOT NULL DEFAULT '0' COMMENT '供应商ID',
	`provider_name` VARCHAR(32) NULL DEFAULT '' COMMENT '供应商名',
	`ad_title` VARCHAR(32) NULL DEFAULT '' COMMENT '推广标题',
	`ranking` INT(2) UNSIGNED NOT NULL DEFAULT '0' COMMENT '排名',
	`star_level` INT(2) UNSIGNED NOT NULL DEFAULT '0' COMMENT '星级',
	`player_count` INT(4) UNSIGNED NOT NULL DEFAULT '0' COMMENT '玩家人数',
	`down_count` INT(4) UNSIGNED NOT NULL DEFAULT '0' COMMENT '下载次数',
	`comment_count` INT(4) UNSIGNED NOT NULL DEFAULT '0' COMMENT '评论数',
	`game_version` VARCHAR(16) NULL DEFAULT NULL COMMENT '版本号',
	`developer` VARCHAR(64) NULL DEFAULT NULL COMMENT '开发者',
	`create_time` INT(8) UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
	`update_time` INT(8) UNSIGNED NOT NULL DEFAULT '0' COMMENT '更新时间',
	`store_status` INT(1) UNSIGNED NOT NULL DEFAULT '0' COMMENT '状态',
	`cpid` VARCHAR(64) NULL DEFAULT NULL COMMENT 'cpid',
	`cpurl` VARCHAR(255) NULL DEFAULT NULL COMMENT 'cpurl',
	`cp_addr` VARCHAR(64) NULL DEFAULT NULL COMMENT 'cp地址',
	`cp_name` VARCHAR(32) NULL DEFAULT NULL COMMENT 'cp_name',
	`game_title` VARCHAR(64) NOT NULL COMMENT '标题',
	`game_link_url` VARCHAR(255) NULL DEFAULT '' COMMENT '游戏链接' COLLATE 'utf8mb4_general_ci',
	`game_ico_uri` VARCHAR(255) NULL DEFAULT '' COMMENT '图标URI',
	`update_desc` VARCHAR(255) NULL DEFAULT NULL COMMENT '更新描述',
	`game_resource_uri` VARCHAR(255) NULL DEFAULT '' COMMENT '资源URI',
	`game_screenshots` VARCHAR(255) NULL DEFAULT NULL COMMENT '游戏截图',
	`game_desc` VARCHAR(255) NULL DEFAULT '' COMMENT '描述',
}
```
