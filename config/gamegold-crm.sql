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

-- 导出 gamegold-crm 的数据库结构
CREATE DATABASE IF NOT EXISTS `gamegold-crm` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `gamegold-crm`;

-- 导出  表 gamegold-crm.activity 结构
CREATE TABLE IF NOT EXISTS `activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lastTime` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lastTime` (`lastTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。


-- 导出  表 gamegold-crm.ally_news 结构
CREATE TABLE IF NOT EXISTS `ally_news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) DEFAULT '0',
  `newstype` int(11) DEFAULT '0',
  `content` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `buildTime` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。


-- 导出  表 gamegold-crm.ally_object 结构
CREATE TABLE IF NOT EXISTS `ally_object` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `experience` int(11) DEFAULT '0',
  `uid` int(11) DEFAULT '0',
  `Name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Energy` int(11) DEFAULT '0',
  `Target` int(11) DEFAULT '0',
  `BattleGrade` int(11) DEFAULT '0',
  `aSetting` int(11) DEFAULT '0',
  `Users` varchar(8000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sloganInner` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sloganOuter` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。


-- 导出  表 gamegold-crm.buylogs 结构
CREATE TABLE IF NOT EXISTS `buylogs` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`domainid` VARCHAR(128) NOT NULL,
	`trade_no` VARCHAR(128) NOT NULL,
	`third_no` VARCHAR(128) NULL DEFAULT NULL,
	`product` VARCHAR(128) NULL DEFAULT NULL,
	`product_desc` VARCHAR(255) NULL DEFAULT NULL,
	`total_fee` BIGINT(20) NULL DEFAULT NULL,
	`fee_type` VARCHAR(50) NULL DEFAULT NULL,
	`result` SMALLINT(6) NOT NULL DEFAULT '0',
	`createdAt` DATETIME NULL DEFAULT NULL,
	`updatedAt` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `trade_no` (`trade_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。


-- 导出  表 gamegold-crm.cp 结构
CREATE TABLE IF NOT EXISTS `cp` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '数字索引',
  `cp_id` varchar(500) CHARACTER SET utf8mb4 NOT NULL COMMENT '游戏再链上的id',
  `cp_name` varchar(500) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '游戏名称',
  `cp_text` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '游戏中文名',
  `cp_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL，存入到链上的重要字段',
  `wallet_addr` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '该游戏的收款地址',
  `cp_type` varchar(500) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '游戏类别',
  `develop_name` varchar(500) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '开发者',
  `cp_desc` varchar(2000) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '游戏简介',
  `cp_version` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '游戏版本',
  `picture_url` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '图片URL（JSON格式）',
  `cp_state` int(11) DEFAULT '0' COMMENT '审核状态--保留暂不使用，也不删除',
  `publish_time` int(11) DEFAULT '0' COMMENT '发布时间（创建时间）',
  `update_time` int(11) DEFAULT '0' COMMENT '审核时间',
  `update_content` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invite_share` int(11) DEFAULT '0' COMMENT '邀请人分成比例，为0-15；如果为0，则表示不存在邀请人分成。',
  `operator_id` int(11) DEFAULT NULL COMMENT '操作员ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。


-- 导出  表 gamegold-crm.cp_funding 结构
CREATE TABLE IF NOT EXISTS `cp_funding` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stock_num` int(11) NOT NULL COMMENT '凭证数量',
  `total_amount` bigint(20) NOT NULL COMMENT '总金额（筹款目标）',
  `stock_amount` int(11) NOT NULL COMMENT '单份凭证金额-游戏金，单位是尘',
  `stock_rmb` int(11) NOT NULL COMMENT '单份凭证金额-人民币，单位是分',
  `audit_state_id` int(1) NOT NULL COMMENT '审核状态1-未审核；2-审核通过；3-审核拒绝',
  `audit_text` varchar(255) DEFAULT NULL COMMENT '审核文本内容',
  `modify_date` int(11) DEFAULT NULL,
  `cp_name` varchar(255) DEFAULT NULL COMMENT '游戏简称',
  `cp_text` varchar(255) DEFAULT NULL COMMENT '游戏中文名',
  `cp_type` varchar(20) DEFAULT NULL COMMENT '游戏类型',
  `cp_url` varchar(255) DEFAULT NULL COMMENT 'url',
  `develop_name` varchar(255) DEFAULT '' COMMENT '开发者名称',
  `develop_text` varchar(2000) DEFAULT NULL COMMENT '开发者介绍',
  `user_id` int(11) DEFAULT NULL COMMENT '操作员的用户id',
  `cid` varchar(50) DEFAULT NULL COMMENT '链数据库cid',
  `operator_id` int(11) DEFAULT NULL COMMENT '当前操作的操作员ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 gamegold-crm.cp_stock 结构
CREATE TABLE IF NOT EXISTS `cp_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` varchar(255) DEFAULT NULL COMMENT 'cp在区块链上的唯一识别码',
  `cp_name` varchar(255) DEFAULT NULL,
  `cp_text` varchar(255) DEFAULT NULL,
  `stock_day` varchar(10) DEFAULT NULL COMMENT '发生交易的年月日',
  `stock_open` int(11) DEFAULT NULL COMMENT '开盘价',
  `stock_close` int(11) DEFAULT NULL COMMENT '收盘价',
  `stock_high` int(11) DEFAULT NULL COMMENT '最高价',
  `stock_low` int(11) DEFAULT NULL COMMENT '最低价',
  `total_num` bigint(20) DEFAULT NULL COMMENT '总成交数量（凭证数量）',
  `total_amount` bigint(20) DEFAULT NULL COMMENT '总成交金额（游戏金）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 gamegold-crm.cp_type 结构
CREATE TABLE IF NOT EXISTS `cp_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `cp_type_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cp_type_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '游戏类型中文描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 gamegold-crm.login 结构
CREATE TABLE IF NOT EXISTS `login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `time` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。


-- 导出  表 gamegold-crm.mails 结构
CREATE TABLE IF NOT EXISTS `mails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `src` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dst` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。


-- 导出  表 gamegold-crm.migrations 结构
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `run_on` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。


-- 导出  表 gamegold-crm.m_player 结构
CREATE TABLE IF NOT EXISTS `m_player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'official',
  `uuid` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activity` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dailyactivity` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Tollgate` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `login` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `diamond` int(11) DEFAULT '0',
  `status` int(11) DEFAULT '0',
  `refreshTime` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `score` int(11) DEFAULT '0',
  `setting` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hisGateNo` int(11) DEFAULT '1',
  `role` int(11) DEFAULT '1001',
  `info` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pet` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `txinfo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `txBule` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vip` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `friend` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `txFriend` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `potential` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `execInfo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pocket` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shopInfo` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aid` int(11) DEFAULT '0',
  `invite` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `domanId` (`domain`,`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。


-- 导出  表 gamegold-crm.operator 结构
CREATE TABLE IF NOT EXISTS `operator` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '操作员流水',
  `login_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '登录名',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '登录密码',
  `cid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '登录全节点使用的cid',
  `token` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '登录全节点的token',
  `state` int(1) DEFAULT '1' COMMENT '状态：1-有效；0-已删除。',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '该操作员的备注信息',
  PRIMARY KEY (`id`),
  UNIQUE KEY `operator_index1` (`login_name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 gamegold-crm.our_block_redpack 结构
CREATE TABLE IF NOT EXISTS `our_block_redpack` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
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


-- 导出  表 gamegold-crm.our_block_redpack_act 结构
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
  PRIMARY KEY (`id`),
  KEY `act_sequence` (`act_sequence`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。


-- 导出  表 gamegold-crm.our_block_user_redpack 结构
CREATE TABLE IF NOT EXISTS `our_block_user_redpack` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `uid` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `act_id` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '活动编号',
  `act_name` varchar(32) DEFAULT NULL COMMENT '活动名称',
  `gamegold` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '支出游戏金',
  `amount` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '抽中金额',
  `act_at` int(8) DEFAULT '0' COMMENT '抽奖时间',
  PRIMARY KEY (`id`),
  KEY `act_id` (`act_id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。


-- 导出  表 gamegold-crm.our_block_user_redpack_act 结构
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


-- 导出  过程 gamegold-crm.survive 结构
DELIMITER //
CREATE DEFINER=`gamecloud`@`%` PROCEDURE `survive`(IN `time` VARCHAR(50), OUT `r1` FLOAT, OUT `r3` FLOAT, OUT `r7` FLOAT)
BEGIN 
  declare a int; 
  declare b1 int; 
  declare b3 int; 
  declare b7 int; 
  select count(id) into a from users where createdAt >= time and createdAt < DATE_ADD(time,INTERVAL 1 DAY); 
  IF (a = 0) THEN 
    set r1 = 0; 
    set r3 = 0; 
    set r7 = 0; 
  ELSE 
    select count(*) into b1 from login where type = 1 and uid in (select id from users where createdAt >= time and createdAt < DATE_ADD(time, INTERVAL 1 DAY)); 
    select count(*) into b3 from login where type = 3 and uid in (select id from users where createdAt >= time and createdAt < DATE_ADD(time, INTERVAL 1 DAY)); 
    select count(*) into b7 from login where type = 7 and uid in (select id from users where createdAt >= time and createdAt < DATE_ADD(time, INTERVAL 1 DAY)); 
    set r1 = b1 / a; 
    set r3 = b3 / a; 
    set r7 = b7 / a; 
  END IF; 
  select r1, r3, r7; 
END//
DELIMITER ;


-- 导出  表 gamegold-crm.system 结构
CREATE TABLE IF NOT EXISTS `system` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activity` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dailyactivity` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。


-- 导出  表 gamegold-crm.test 结构
CREATE TABLE IF NOT EXISTS `test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
