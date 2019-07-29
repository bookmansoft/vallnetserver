/*
Navicat MySQL Data Transfer

Source Server         : local
Source Server Version : 50724
Source Host           : localhost:3306
Source Database       : wechat-wallet

Target Server Type    : MYSQL
Target Server Version : 50724
File Encoding         : 65001

Date: 2018-12-04 18:02:28
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `our_block_cp_order`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_cp_order`;
CREATE TABLE `our_block_cp_order` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `uid` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `openid` varchar(128) NOT NULL COMMENT 'openid',
  `user_addr` varchar(128) NOT NULL COMMENT '用户地址',
  `order_sn` varchar(128) NOT NULL COMMENT '订单编号',
  `order_num` int(8) DEFAULT '0' COMMENT '支付金额',
  `prop_id` int(8) DEFAULT '0' COMMENT '道具编号',
  `prop_name` varchar(32) DEFAULT NULL COMMENT '道具名称',
  `prop_oid` varchar(32) DEFAULT NULL COMMENT '道具原始编号',
  `prop_value` varchar(32) DEFAULT NULL COMMENT '道具含金量',
  `prop_icon` varchar(255) DEFAULT '0' COMMENT '道具图标',
  `order_status` int(1) unsigned DEFAULT '0' COMMENT '订单状态',
  `prop_status` int(1) DEFAULT NULL COMMENT '道具发送状态',
  `pay_status` int(1) unsigned DEFAULT '0' COMMENT '支付状态',
  `create_time` bigint(12) unsigned DEFAULT '0' COMMENT '创建时间',
  `update_time` bigint(12) unsigned DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `order_sn` (`order_sn`),
  KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `our_block_cp_prop`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_cp_prop`;
CREATE TABLE `our_block_cp_prop` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户编号',
  `gold` bigint(18) unsigned NOT NULL DEFAULT '0' COMMENT 'gold',
  `price` bigint(18) unsigned NOT NULL DEFAULT '0' COMMENT 'price',
  `oid` varchar(128) DEFAULT NULL COMMENT 'oid',
  `prop_id` varchar(128) DEFAULT NULL COMMENT 'prop_id',
  `prop_name` varchar(64) DEFAULT NULL COMMENT 'prop_name',
  `prop_icon` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT 'prop_icon',
  `prop_info` varchar(255) DEFAULT NULL COMMENT 'prop_info',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `oid` (`oid`)
) ENGINE=InnoDB AUTO_INCREMENT=1292 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `our_block_cp_user`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_cp_user`;
CREATE TABLE `our_block_cp_user` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户编号',
  `openid` varchar(128) DEFAULT NULL COMMENT 'openid',
  `addr` varchar(255) DEFAULT NULL COMMENT '区块链地址',
  `nick` varchar(128) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '昵称',
  `avatar_uri` varchar(255) DEFAULT NULL COMMENT '头像uri',
  `created_at` bigint(12) unsigned NOT NULL DEFAULT '0' COMMENT '注册时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `openid` (`openid`)
) ENGINE=InnoDB AUTO_INCREMENT=1069 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `our_block_game_category`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_game_category`;
CREATE TABLE `our_block_game_category` (
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `category_id` int(2) unsigned NOT NULL DEFAULT '0' COMMENT '类别ID',
  `category_title` varchar(32) DEFAULT '' COMMENT '类别名',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `our_block_game_cp`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_game_cp`;
CREATE TABLE `our_block_game_cp` (
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `cid` varchar(64) DEFAULT '' COMMENT 'cid',
  `name` varchar(32) DEFAULT '' COMMENT '名称',
  `url` varchar(128) DEFAULT '' COMMENT '网址',
  `ip` varchar(32) DEFAULT '' COMMENT 'ip地址',
  `address` varchar(64) DEFAULT '' COMMENT '地址',
  `hash` varchar(128) DEFAULT '' COMMENT 'hash',
  `status` int(1) DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `cid` (`cid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `our_block_game_prop`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_game_prop`;
CREATE TABLE `our_block_game_prop` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `cpid` varchar(64) NOT NULL COMMENT 'cpid',
  `oid` varchar(32) DEFAULT '' COMMENT '道具原始ID',
  `prop_id` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '道具id',
  `prop_name` varchar(64) DEFAULT '' COMMENT '名称',
  `icon_small` varchar(255) DEFAULT '' COMMENT '图标',
  `icon_large` varchar(255) DEFAULT NULL,
  `prop_info` varchar(255) DEFAULT NULL COMMENT '详情',
  `create_time` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `prop_price` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '道具价格',
  `prop_value` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '道具含金量',
  `nstatus` int(1) unsigned NOT NULL DEFAULT '0' COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `cpid` (`cpid`),
  KEY `oid` (`oid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for `our_block_game_provider`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_game_provider`;
CREATE TABLE `our_block_game_provider` (
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `provider_id` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '供应商ID',
  `provider_name` varchar(32) DEFAULT '' COMMENT '供应商名',
  `contact` varchar(32) DEFAULT '' COMMENT '联系人',
  `phone` varchar(32) DEFAULT '' COMMENT '联系人电话',
  `addr` varchar(255) DEFAULT '' COMMENT '地址',
  `uri` varchar(255) DEFAULT '' COMMENT '网址',
  `game_number` int(2) unsigned NOT NULL DEFAULT '0' COMMENT '游戏数量',
  `comprehensive_grade` int(2) unsigned NOT NULL DEFAULT '0' COMMENT '综合等级',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `provider_name` (`provider_name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `our_block_games`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_games`;
CREATE TABLE `our_block_games` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `game_code` varchar(32) NOT NULL COMMENT '编码',
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
  `cpid` varchar(64) DEFAULT NULL COMMENT 'cpid',
  `cpurl` varchar(255) DEFAULT NULL COMMENT 'cpurl',
  `cp_addr` varchar(64) DEFAULT NULL COMMENT 'cp地址',
  `cp_name` varchar(32) DEFAULT NULL COMMENT 'cp_name',
  `game_title` varchar(64) NOT NULL COMMENT '标题',
  `game_link_url` varchar(255) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '游戏链接',
  `game_ico_uri` varchar(255) DEFAULT '' COMMENT '图标URI',
  `update_desc` varchar(255) DEFAULT NULL COMMENT '更新描述',
  `game_resource_uri` varchar(255) DEFAULT '' COMMENT '资源URI',
  `game_screenshots` varchar(255) DEFAULT NULL COMMENT '游戏截图',
  `game_desc` varchar(255) DEFAULT '' COMMENT '描述',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `sort` (`sort`) USING BTREE,
  KEY `game_title` (`game_title`) USING BTREE,
  KEY `category_id` (`category_id`) USING BTREE,
  KEY `provider_id` (`provider_id`) USING BTREE,
  KEY `cpid` (`cpid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `our_block_user_game`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_user_game`;
CREATE TABLE `our_block_user_game` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `uid` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `openid` varchar(64) NOT NULL COMMENT 'openid',
  `game_id` int(8) unsigned NOT NULL COMMENT 'game_id',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `our_block_user_wallet`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_user_wallet`;
CREATE TABLE `our_block_user_wallet` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自动编号',
  `cid` varchar(64) NOT NULL COMMENT 'cid',
  `user_id` varchar(32) NOT NULL COMMENT 'cp用户ID',
  `addr` varchar(64) NOT NULL COMMENT '钱包地址',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `cid` (`cid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of our_block_user_wallet
-- ----------------------------
