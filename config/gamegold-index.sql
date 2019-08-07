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

-- 导出 gamegold-index 的数据库结构
CREATE DATABASE IF NOT EXISTS `gamegold-index` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `gamegold-index`;

-- 导出  表 gamegold-index.activity 结构
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


-- 导出  表 gamegold-index.ally_news 结构
CREATE TABLE IF NOT EXISTS `ally_news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) DEFAULT '0',
  `newstype` int(11) DEFAULT '0',
  `content` varchar(500) DEFAULT NULL,
  `buildTime` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 gamegold-index.ally_object 结构
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


-- 导出  表 gamegold-index.buylogs 结构
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


-- 导出  表 gamegold-index.login 结构
CREATE TABLE IF NOT EXISTS `login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 gamegold-index.mails 结构
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


-- 导出  表 gamegold-index.migrations 结构
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `run_on` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。


-- 导出  表 gamegold-index.m_player 结构
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

-- 导出  表 gamegold-index.our_shared_redpack_receive 结构
CREATE TABLE IF NOT EXISTS `our_shared_redpack_receive` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '接收id',
  `send_id` int(11) NOT NULL COMMENT '对应的红包组id，即发送时留存的记录',
  `receive_amount` int(11) NOT NULL COMMENT '接收金额',
  `receive_uid` int(11) DEFAULT NULL COMMENT '接收人uid',
  `modify_date` int(11) DEFAULT NULL COMMENT '发送时间',
  `hash` char(64) NULL COMMENT '交易哈希',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 gamegold-index.our_shared_redpack 结构
CREATE TABLE IF NOT EXISTS `our_shared_redpack` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '红包id',
  `total_amount` int(11) NOT NULL DEFAULT '0' COMMENT '红包总金额',
  `total_num` int(3) NOT NULL DEFAULT '1' COMMENT '红包总个数',
  `send_uid` int(11) NOT NULL COMMENT '发送人uid',
  `wishing` varchar(255) NOT NULL COMMENT '祝福语',
  `modify_date` int(11) DEFAULT NULL COMMENT '发送时间',
  `state_id` int(1) NOT NULL DEFAULT '1' COMMENT '1-正常 2-已抢完 3-已过期',
  `hash` char(64) NULL COMMENT '交易哈希',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 gamegold-index.system 结构
CREATE TABLE IF NOT EXISTS `system` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activity` varchar(500) DEFAULT NULL,
  `dailyactivity` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
