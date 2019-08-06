-- --------------------------------------------------------
-- 主机:                           localhost
-- 服务器版本:                        5.5.15 - MySQL Community Server (GPL)
-- 服务器操作系统:                      Win32
-- HeidiSQL 版本:                  8.2.0.4675
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 导出 wechat-wallet 的数据库结构
CREATE DATABASE IF NOT EXISTS `wechat-wallet` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `wechat-wallet`;


-- 导出  表 wechat-wallet.activity 结构
CREATE TABLE IF NOT EXISTS `activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lastTime` varchar(50) DEFAULT NULL,
  `content` varchar(2000) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lastTime` (`lastTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.ally_news 结构
CREATE TABLE IF NOT EXISTS `ally_news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) DEFAULT '0',
  `newstype` int(11) DEFAULT '0',
  `content` varchar(500) DEFAULT NULL,
  `buildTime` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.ally_object 结构
CREATE TABLE IF NOT EXISTS `ally_object` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `experience` int(11) DEFAULT '0',
  `uid` int(11) DEFAULT '0',
  `Name` varchar(50) DEFAULT NULL,
  `Energy` int(11) DEFAULT '0',
  `Target` int(11) DEFAULT '0',
  `BattleGrade` int(11) DEFAULT '0',
  `aSetting` int(11) DEFAULT '0',
  `Users` varchar(8000) DEFAULT NULL,
  `sloganInner` varchar(500) DEFAULT NULL,
  `sloganOuter` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.buylogs 结构
CREATE TABLE IF NOT EXISTS `buylogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL,
  `user` varchar(50) DEFAULT NULL,
  `trade_no` varchar(50) DEFAULT NULL,
  `domain` varchar(50) DEFAULT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `total_fee` varchar(50) DEFAULT NULL,
  `notify_time` varchar(50) DEFAULT NULL,
  `product_name` varchar(50) DEFAULT NULL,
  `request_count` varchar(50) DEFAULT NULL,
  `result` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trade_no` (`trade_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.login 结构
CREATE TABLE IF NOT EXISTS `login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.mails 结构
CREATE TABLE IF NOT EXISTS `mails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `src` varchar(100) DEFAULT NULL,
  `dst` varchar(100) DEFAULT NULL,
  `content` varchar(500) DEFAULT NULL,
  `time` varchar(500) DEFAULT NULL,
  `state` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.migrations 结构
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `run_on` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.m_player 结构
CREATE TABLE IF NOT EXISTS `m_player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(50) DEFAULT 'official',
  `uuid` varchar(50) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `activity` varchar(500) DEFAULT NULL,
  `dailyactivity` varchar(500) DEFAULT NULL,
  `Tollgate` varchar(500) DEFAULT NULL,
  `login` varchar(200) DEFAULT NULL,
  `diamond` int(11) DEFAULT '0',
  `status` int(11) DEFAULT '0',
  `refreshTime` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `score` int(11) DEFAULT '0',
  `setting` varchar(500) DEFAULT NULL,
  `hisGateNo` int(11) DEFAULT '1',
  `role` int(11) DEFAULT '1001',
  `info` varchar(500) DEFAULT NULL,
  `pet` varchar(500) DEFAULT NULL,
  `txinfo` varchar(500) DEFAULT NULL,
  `txBule` varchar(500) DEFAULT NULL,
  `item` varchar(500) DEFAULT NULL,
  `vip` varchar(500) DEFAULT NULL,
  `friend` varchar(500) DEFAULT NULL,
  `task` varchar(500) DEFAULT NULL,
  `txFriend` varchar(500) DEFAULT NULL,
  `potential` varchar(2000) DEFAULT NULL,
  `execInfo` varchar(500) DEFAULT NULL,
  `pocket` varchar(500) DEFAULT NULL,
  `shopInfo` varchar(2000) DEFAULT NULL,
  `aid` int(11) DEFAULT '0',
  `invite` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `domanId` (`domain`,`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 wechat-wallet.our_block_cp_user 结构
CREATE TABLE IF NOT EXISTS `our_block_cp_user` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户编号',
  `openid` varchar(128) DEFAULT NULL COMMENT 'openid',
  `addr` varchar(255) DEFAULT NULL COMMENT '区块链地址',
  `nick` varchar(128) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '昵称',
  `avatar_uri` varchar(255) DEFAULT NULL COMMENT '头像uri',
  `created_at` bigint(12) unsigned NOT NULL DEFAULT '0' COMMENT '注册时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `openid` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.our_block_games 结构
CREATE TABLE IF NOT EXISTS `our_block_games` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `sort` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `category_id` int(2) unsigned NOT NULL DEFAULT '0' COMMENT '游戏类别',
  `category_title` varchar(32) DEFAULT '' COMMENT '类别名',
  `provider_id` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '供应商ID',
  `provider_name` varchar(32) DEFAULT '' COMMENT '供应商名',
  `ad_title` varchar(32) DEFAULT '' COMMENT '推广标题',
  `ranking` int(2) unsigned NOT NULL DEFAULT '0' COMMENT '排名',
  `star_level` int(2) unsigned NOT NULL DEFAULT '0' COMMENT '星级',
  `player_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '玩家人数',
  `down_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '下载次数',
  `comment_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '评论数',
  `game_version` varchar(16) DEFAULT NULL COMMENT '版本号',
  `developer` varchar(64) DEFAULT NULL COMMENT '开发者',
  `create_time` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `store_status` int(1) unsigned NOT NULL DEFAULT '0' COMMENT '状态',
  `stock_price` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '资产价格',
  `stock_sum` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '资产数量',
	`grate` int(8) NULL DEFAULT '0' COMMENT '媒体分成',
	`hHeight` int(8) NULL DEFAULT '0' COMMENT '初次高度',
	`hBonus` int(11) NULL DEFAULT '0' COMMENT '历史分红',
	`hAds` int(11) NULL DEFAULT '0' COMMENT '历史分成',
  `cpid` varchar(64) DEFAULT NULL COMMENT 'cpid',
  `cpurl` varchar(255) DEFAULT NULL COMMENT 'cpurl',
  `cp_addr` varchar(64) DEFAULT NULL COMMENT 'cp地址',
  `cp_name` varchar(32) DEFAULT NULL COMMENT 'cp_name',
  `game_title` varchar(64) NOT NULL COMMENT '标题',
  `game_link_url` varchar(255) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '游戏链接',
  `game_ico_uri` varchar(255) DEFAULT '' COMMENT '图标URI',
  `update_desc` varchar(255) DEFAULT NULL COMMENT '更新描述',
  `game_resource_uri` varchar(255) DEFAULT '' COMMENT '资源URI',
  `small_img_url` varchar(255) DEFAULT '' COMMENT '资源URI',
  `game_screenshots` varchar(255) DEFAULT NULL COMMENT '游戏截图',
  `game_desc` varchar(255) DEFAULT '' COMMENT '描述',
  PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `cpid` (`cpid`) USING BTREE,
  INDEX `sort` (`sort`) USING BTREE,
  INDEX `game_title` (`game_title`) USING BTREE,
  INDEX `category_id` (`category_id`) USING BTREE,
  INDEX `provider_id` (`provider_id`) USING BTREE,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。

-- 导出  表 wechat-wallet.our_block_game_comment 结构
CREATE TABLE IF NOT EXISTS `our_block_game_comment` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `cid` varchar(64) NOT NULL DEFAULT '' COMMENT 'cid',
  `reply_id` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '回复ID',
  `uid` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `nick` varchar(32) NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar_url` varchar(255) DEFAULT NULL COMMENT '图标',
  `ip` varchar(32) NOT NULL DEFAULT '' COMMENT 'ip地址',
  `resp_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '回复数量',
  `point_up_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '点赞数',
  `create_at` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '时间',
  `title` varchar(128) NOT NULL DEFAULT '' COMMENT '标题',
  `content` varchar(512) NOT NULL DEFAULT '' COMMENT '内容',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `cid` (`cid`) USING BTREE,
  KEY `reply_id` (`reply_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。

-- 导出  表 wechat-wallet.our_block_notify 结构
CREATE TABLE IF NOT EXISTS `our_block_notify` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `sn` varchar(128) NOT NULL COMMENT '通知编号',
  `uid` int(8) DEFAULT '0' COMMENT 'uid',
  `h` int(8) DEFAULT '0' COMMENT '高度',
  `status` int(8) DEFAULT '0' COMMENT '状态',
  `content` varchar(500) DEFAULT NULL COMMENT '内容',
  `type` varchar(32) DEFAULT '0' COMMENT '类型',
  `create_time` int(8) unsigned DEFAULT '0' COMMENT '创建时间',
  `update_time` int(8) unsigned DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `order_sn` (`sn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。

-- 导出  表 wechat-wallet.our_block_redpack 结构
CREATE TABLE IF NOT EXISTS `our_block_redpack` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `uid` int(8) unsigned DEFAULT '0' COMMENT '用户编号',
  `act_id` int(4) unsigned DEFAULT '0' COMMENT '活动编号',
  `user_redpack_id` int(8) unsigned DEFAULT '0' COMMENT '用户红包抽奖ID',
  `act_name` varchar(32) DEFAULT NULL COMMENT '红包名称',
  `mch_billno` varchar(64) DEFAULT NULL COMMENT '红包订单号',
  `nick_name` varchar(32) DEFAULT '0' COMMENT '昵称',
  `re_openid` varchar(32) DEFAULT NULL COMMENT '接收openid',
  `remark` varchar(32) DEFAULT NULL COMMENT '备注',
  `send_name` varchar(32) DEFAULT NULL COMMENT '发送名字',
  `total_amount` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '红包金额',
  `total_num` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '红包数量',
  `wishing` varchar(128) DEFAULT NULL COMMENT '祝福语',
  `return_msg` varchar(64) DEFAULT NULL COMMENT '返回消息',
  `order_status` int(1) DEFAULT '0' COMMENT '订单状态',
  PRIMARY KEY (`id`),
  KEY `re_openid` (`re_openid`),
  KEY `mch_billno` (`mch_billno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.our_block_redpack_act 结构
CREATE TABLE IF NOT EXISTS `our_block_redpack_act` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `act_name` varchar(32) DEFAULT NULL COMMENT '活动名称',
  `act_sequence` varchar(16) DEFAULT NULL COMMENT '活动序号',
  `total_gamegold` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '总共支出游戏金',
  `each_gamegold` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '每个红包抽中游戏金',
  `total_num` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '红包总数量',
  `each_num` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '每个用户红包数量',
  `act_desc` varchar(160) DEFAULT NULL COMMENT '活动详情',
  `act_start_at` int(8) DEFAULT '0' COMMENT '活动开始时间',
  `act_end_at` int(8) DEFAULT '0' COMMENT '活动结束时间',
  `status` int(1) unsigned DEFAULT '0' COMMENT '状态',
  `cid` varchar(64) DEFAULT NULL COMMENT '用来收取游戏金的CP',
  PRIMARY KEY (`id`),
  KEY `act_sequence` (`act_sequence`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。

-- 导出  表 wechat-wallet.our_block_user_redpack 结构
CREATE TABLE IF NOT EXISTS `our_block_user_redpack` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `uid` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `act_id` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '活动编号',
  `act_name` varchar(32) DEFAULT NULL COMMENT '活动名称',
  `gamegold` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '支出游戏金',
  `amount` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '抽中金额',
  `act_at` int(8) DEFAULT '0' COMMENT '抽奖时间',
  `order_sn` varchar(32) DEFAULT NULL COMMENT '游戏金订单号',
  `cid` varchar(64) DEFAULT NULL COMMENT '接收游戏金支付的cp',
  `status` int(1) DEFAULT '0' COMMENT '状态',
  PRIMARY KEY (`id`),
  KEY `act_id` (`act_id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.our_block_user_redpack_act 结构
CREATE TABLE IF NOT EXISTS `our_block_user_redpack_act` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `uid` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `act_id` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '活动编号',
  `act_name` varchar(32) DEFAULT NULL COMMENT '活动名称',
  `act_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '累计抽奖次数',
  `amount_all` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '累计抽中金额',
  `last_act_at` int(8) DEFAULT '0' COMMENT '最后一次抽奖时间',
  PRIMARY KEY (`id`),
  KEY `act_id` (`act_id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。

-- 导出  表 wechat-wallet.our_block_user_wallet 结构
CREATE TABLE IF NOT EXISTS `our_block_user_wallet` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自动编号',
  `cid` varchar(64) NOT NULL COMMENT 'cid',
  `user_id` varchar(32) NOT NULL COMMENT 'cp用户ID',
  `addr` varchar(64) NOT NULL COMMENT '钱包地址',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `cid` (`cid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。

-- 导出  表 wechat-wallet.our_shared_redpack_receive 结构
CREATE TABLE IF NOT EXISTS `our_shared_redpack_receive` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '接收id',
  `send_id` int(11) NOT NULL COMMENT '对应的红包组id，即发送时留存的记录',
  `receive_amount` int(11) NOT NULL COMMENT '接收金额',
  `receive_uid` int(11) DEFAULT NULL COMMENT '接收人uid',
  `modify_date` int(11) DEFAULT NULL COMMENT '发送时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.our_shared_redpack 结构
CREATE TABLE IF NOT EXISTS `our_shared_redpack` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '红包id',
  `total_amount` int(11) NOT NULL DEFAULT '0' COMMENT '红包总金额',
  `actual_amount` int(11) NOT NULL DEFAULT '0' COMMENT '已领取的实际金额',
  `total_num` int(3) NOT NULL DEFAULT '1' COMMENT '红包总个数',
  `send_uid` int(11) NOT NULL COMMENT '发送人uid',
  `wishing` varchar(255) NOT NULL COMMENT '祝福语',
  `modify_date` int(11) DEFAULT NULL COMMENT '发送时间',
  `state_id` int(1) NOT NULL DEFAULT '1' COMMENT '1-正常 2-已抢完 3-已过期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.our_stock_base 结构
CREATE TABLE IF NOT EXISTS `our_stock_base` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` varchar(50) NOT NULL COMMENT '链数据库cid',
  `funding_text` varchar(500) DEFAULT NULL COMMENT '众筹简介',
  `funding_project_text` varchar(2000) DEFAULT NULL COMMENT '项目介绍',
  `supply_people_num` int(11) DEFAULT NULL COMMENT '支持人数',
  `height` int(11) DEFAULT NULL COMMENT '发行高度',
	`sum` int(11) NULL DEFAULT NULL COMMENT '发行数量',
	`sum_left` int(11) NULL DEFAULT NULL COMMENT '剩余数量',
	`price` int(11) NULL DEFAULT NULL COMMENT '发行价格, 单位尘',
  `history_text` varchar(2000) DEFAULT '' COMMENT '历史业绩信息JSON数组',
  `now_sale` varchar(2000) DEFAULT NULL COMMENT '现在挂单卖出的JSON字符串',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.our_stock_bulletin 结构
CREATE TABLE IF NOT EXISTS `our_stock_bulletin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` varchar(255) DEFAULT NULL COMMENT 'cp在区块链上的唯一识别码',
  `cp_name` varchar(255) DEFAULT NULL,
  `cp_text` varchar(255) DEFAULT NULL,
  `stock_day` varchar(10) DEFAULT NULL COMMENT '发生交易的年月日',
  `stock_open` int(11) DEFAULT NULL COMMENT '开盘价',
  `stock_close` int(11) DEFAULT NULL COMMENT '收盘价',
  `stock_high` int(11) DEFAULT NULL COMMENT '最高价',
  `stock_low` int(11) DEFAULT NULL COMMENT '最低价',
  `total_num` bigint(20) DEFAULT NULL COMMENT '总成交数量',
  `total_amount` bigint(20) DEFAULT NULL COMMENT '总成交金额（游戏金）',
  `sum` bigint(20) DEFAULT NULL COMMENT '总流通量',
  `price` bigint(20) DEFAULT NULL COMMENT ' 持有成本（游戏金）',
  `bonus` bigint(20) DEFAULT NULL COMMENT '总分成（游戏金）',
	PRIMARY KEY (`id`),
	UNIQUE INDEX `uniq` (`cid`, `stock_day`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.system 结构
CREATE TABLE IF NOT EXISTS `system` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activity` varchar(500) DEFAULT NULL,
  `dailyactivity` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 wechat-wallet.test 结构
CREATE TABLE IF NOT EXISTS `test` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `item` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
