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
-- Records of our_block_cp_order
-- ----------------------------
INSERT INTO `our_block_cp_order` VALUES ('49', '1068', 'oHvae4rF-nfnTQVxuCw6PS9Y8vw0', 'tb1qptl9uy5truaqfvqhjp4qrn0jjlksr64a2exc87', 'skkcsh-022738', '60000', '1288', '屠龙刀', '178983672896', '50000', 'https://mini.gamegold.xin/cp/hwgl/prop/images/tulongdao.png', '0', '0', '1', '1543679893158', '0');
INSERT INTO `our_block_cp_order` VALUES ('50', '1068', 'oHvae4rF-nfnTQVxuCw6PS9Y8vw0', 'tb1qptl9uy5truaqfvqhjp4qrn0jjlksr64a2exc87', 'hshfw8-318376', '60000', '1288', '屠龙刀', '178983672896', '50000', 'https://mini.gamegold.xin/cp/hwgl/prop/images/tulongdao.png', '0', '0', '1', '1543681512901', '0');
INSERT INTO `our_block_cp_order` VALUES ('51', '1068', 'oHvae4rF-nfnTQVxuCw6PS9Y8vw0', 'tb1qptl9uy5truaqfvqhjp4qrn0jjlksr64a2exc87', '5i3bh6-439422', '60000', '1288', '屠龙刀', '178983672896', '50000', 'https://mini.gamegold.xin/cp/hwgl/prop/images/tulongdao.png', '0', '0', '1', '1543681562019', '0');
INSERT INTO `our_block_cp_order` VALUES ('52', '1068', 'oHvae4rF-nfnTQVxuCw6PS9Y8vw0', 'tb1qptl9uy5truaqfvqhjp4qrn0jjlksr64a2exc87', 'w48x57-081958', '80000', '1291', '葵花宝典', '518314212395', '50000', 'https://mini.gamegold.xin/cp/hwgl/prop/images/khbd.png', '0', '0', '1', '1543681634499', '0');
INSERT INTO `our_block_cp_order` VALUES ('53', '1068', 'oHvae4rF-nfnTQVxuCw6PS9Y8vw0', 'tb1qptl9uy5truaqfvqhjp4qrn0jjlksr64a2exc87', 'zkwdm2-485949', '70000', '1289', '倚天剑', '383999761644', '50000', 'https://mini.gamegold.xin/cp/hwgl/prop/images/tlj.png', '0', '0', '1', '1543916088624', '0');

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
-- Records of our_block_cp_prop
-- ----------------------------
INSERT INTO `our_block_cp_prop` VALUES ('1288', '50000', '60000', '178983672896', '1', '屠龙刀', 'https://mini.gamegold.xin/cp/hwgl/prop/images/tulongdao.png', '{\"battle\":{\"title\":\"战斗力\",\"value\":\"500\"},\"effect\":{\"title\":\"影响\",\"value\":\"1500\"},\"defense\":{\"title\":\"防御值\",\"value\":\"8500\"}}');
INSERT INTO `our_block_cp_prop` VALUES ('1289', '50000', '70000', '383999761644', '1', '倚天剑', 'https://mini.gamegold.xin/cp/hwgl/prop/images/tlj.png', '{\"battle\":{\"title\":\"战斗力\",\"value\":\"500\"},\"effect\":{\"title\":\"影响\",\"value\":\"1500\"},\"defense\":{\"title\":\"防御值\",\"value\":\"8500\"}}');
INSERT INTO `our_block_cp_prop` VALUES ('1291', '50000', '80000', '518314212395', '1', '葵花宝典', 'https://mini.gamegold.xin/cp/hwgl/prop/images/khbd.png', '{\"battle\":{\"title\":\"战斗力\",\"value\":\"500\"},\"effect\":{\"title\":\"影响\",\"value\":\"1500\"},\"defense\":{\"title\":\"防御值\",\"value\":\"8500\"}}');

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
-- Records of our_block_cp_user
-- ----------------------------
INSERT INTO `our_block_cp_user` VALUES ('1068', 'oHvae4rF-nfnTQVxuCw6PS9Y8vw0', 'tb1qptl9uy5truaqfvqhjp4qrn0jjlksr64a2exc87', 'n5zk_4480', null, '1543672823251');

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
-- Records of our_block_game_category
-- ----------------------------
INSERT INTO `our_block_game_category` VALUES ('1', '1001', '益智');
INSERT INTO `our_block_game_category` VALUES ('2', '1002', '消除');
INSERT INTO `our_block_game_category` VALUES ('3', '1003', '棋牌');
INSERT INTO `our_block_game_category` VALUES ('4', '1004', '休闲');
INSERT INTO `our_block_game_category` VALUES ('16', '1005', '射击');

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
-- Records of our_block_game_cp
-- ----------------------------
INSERT INTO `our_block_game_cp` VALUES ('1', '天宇互动', '林先生', '13900001111', '深圳深南大道111号', 'www.akakaoo.com', null, '1');

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
-- Records of our_block_game_prop
-- ----------------------------
INSERT INTO `our_block_game_prop` VALUES ('1', 'd756ea10-e3ea-11e8-96d3-37610724598b', 'd756ea10', '1', '小蓝车', 'http://www.gamegold.xin/props/che.jpg', 'http://www.gamegold.xin/props/che.png', '小蓝车，时速120KM/h。稳定系数高', '1541409916', '10000', '5000', '0');
INSERT INTO `our_block_game_prop` VALUES ('2', 'e1b8b0b0-e3ea-11e8-96d3-37610724598b', 'e1b8b0b', '1', '诸葛亮', 'http://www.gamegold.xin/props/zgl.jpg', 'http://www.gamegold.xin/props/zgl.png', '智力值：？？？,武力值：0', '1541410279', '10000', '5000', '0');
INSERT INTO `our_block_game_prop` VALUES ('3', '8b5c6cb0-e3eb-11e8-b8f0-2db9c0f3a1c1', '8b5c6cb0', '1', '坦克', 'http://www.gamegold.xin/props/tk.jpg', 'http://www.gamegold.xin/props/tk.png', '具有超远射程', '1541410620', '10000', '5000', '0');
INSERT INTO `our_block_game_prop` VALUES ('4', '35f67d50-e3f1-11e8-92d0-efbb5c339db4', '35f67d50', '1', '猪八戒', 'http://www.gamegold.xin/props/zbj.jpg', 'http://www.gamegold.xin/props/zbj.png', '特点：能吃，战斗力：50000', '1541410924', '10000', '5000', '0');
INSERT INTO `our_block_game_prop` VALUES ('5', '44516a90-e3f1-11e8-b8f0-2db9c0f3a1c1', '44516a90', '1', '妲己', 'http://www.gamegold.xin/props/dj.jpg', 'http://www.gamegold.xin/props/dj.png', '魅力值：？？？？', '1541411062', '10000', '5000', '0');
INSERT INTO `our_block_game_prop` VALUES ('6', '48482030-e3f1-11e8-b8f0-2db9c0f3a1c1', '48482030', '1', '仙女', 'http://www.gamegold.xin/props/fx.jpg', 'http://www.gamegold.xin/props/fx.png', '御剑飞行', '1541411296', '10000', '5000', '0');
INSERT INTO `our_block_game_prop` VALUES ('7', '9bd44680-e3eb-11e8-b8f0-2db9c0f3a1c1', '9bd44680', '1', '仙童', 'http://www.gamegold.xin/props/frxx.jpg', 'http://www.gamegold.xin/props/frxx.png', '战斗力：50000', '1541411450', '10000', '5000', '0');
INSERT INTO `our_block_game_prop` VALUES ('8', 'a4c00ef0-e3eb-11e8-b8f0-2db9c0f3a1c1', 'a4c00ef0', '1', '孙悟空', 'http://www.gamegold.xin/props/swk.jpg', 'http://www.gamegold.xin/props/swk.png', '上天入地，无所不能', '1542016210', '10000', '5000', '0');
INSERT INTO `our_block_game_prop` VALUES ('9', 'a96a3610-e3eb-11e8-b8f0-2db9c0f3a1c1', 'a96a361', '1', '关羽', 'http://www.gamegold.xin/props/gy.jpg', 'http://www.gamegold.xin/props/gy.png', '战斗力：？？？', '1542016269', '10000', '5000', '0');
INSERT INTO `our_block_game_prop` VALUES ('10', 'a03074b0-e3eb-11e8-b8f0-2db9c0f3a1c1', 'a03074b0', '1', 'AK47', 'http://www.gamegold.xin/props/AK47.jpg', 'http://www.gamegold.xin/props/AK47.png', '威力大，一个弹夹30发', '1542016475', '10000', '5000', '0');

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
-- Records of our_block_game_provider
-- ----------------------------
INSERT INTO `our_block_game_provider` VALUES ('1', '1001', '天宇互动', '林先生', '13900001111', '深圳深南大道111号', 'www.akakaoo.com', '1', '1');
INSERT INTO `our_block_game_provider` VALUES ('2', '1002', '红蝶游戏', '123', '13800888888', '福州市鼓楼区', 'www.microsoft.com', '1', '2');
INSERT INTO `our_block_game_provider` VALUES ('3', '1003', 'Microsoft Studios', '王先生', '12312312312', '广东省广州市', 'www.baidu.com', '1', '1');
INSERT INTO `our_block_game_provider` VALUES ('4', '1004', 'FYI游戏', '建行卡', '35135413', '阿斯顿撒点', 'wwwwwwwww', '5', '1');
INSERT INTO `our_block_game_provider` VALUES ('5', '1005', '原石互娱', 'asdsad', 'asdsad', 'asdsad', 'asdasd', '9', '5');

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
-- Records of our_block_games
-- ----------------------------
INSERT INTO `our_block_games` VALUES ('1', 'ty-yz-001', '1', '1001', '益智', '1002', '红蝶游戏', '孤胆车神：新奥尔良 - 在线开放世界游戏', '0', '0', '368', '0', '1', '1.2', 'Gameloft. Action & adventure', '1534757249', '1542627063', '1', 'd756ea10-e3ea-11e8-96d3-37610724598b', 'https://mini.gamegold.xin/cp/hwgl/index.html', 'tb1qlkfeg8hqe0d2tsj6h3fu8v5keptkg6q9uwanjf', 'cptest01', '孤胆车神', '', './static/img/game-1-1.jpg', '- 玩出真我风采！ • 大量自定义选项，按照自己的形象创建角色也毫无压力！ • 装备、融合以及进化数百种武器、交通工具、帮派成员和其他项，打造最符合您自身个性的独特帮派技能。从狙击手到爆破专家，选择丰富多样——那么，你会挑哪一种呢？', './static/img/game-1.png', './static/img/game-1-2-1.jpg,./static/img/game-1-2-2.jpg,./static/img/game-1-2-3.jpg', '开放沙盒式动作冒险游戏金牌标杆系列之作霸气归来。前往迷人的新奥尔良，打下一片新天地。在这座巨大的城市中，驾驶数百种交通工具、坐拥数量惊人的武器装备，来往自如，无法无天！ 在这里万事俱备，您也可以成为黑道传奇人物！');
INSERT INTO `our_block_games` VALUES ('2', 'ty-yz-002', '1', '1002', '消除', '1004', 'FYI游戏', ' 塔防三国志 塔防三国志', '0', '0', '308', '0', '0', '1.3', 'Gameloft. Action & adventure', '1535016987', '1542627089', '1', 'e1b8b0b0-e3ea-11e8-96d3-37610724598b', 'https://mini.gamegold.xin/cp/hwgl/index.html', 'tb1qjufl2dr86mz8atxr7pfy6h0l8mkje6t8sr727u', 'cptest02', ' 塔防三国志', '', './static/img/game-2-1.jpg', 'o 打造您独特的战斗风格：持续点击并滑动来施展所向无敌的连击，打得敌人溃不成军！ o 超凡特殊技能外加斩首和肢解等致命终结技！技能的释放：除了塔防之余，你还可以释放出武将的专有技能，让敌军闻风丧胆。 英雄的竞技：玩家可以利用自己的武将和对方PK战斗，看看谁主沉浮。 丰富的好友：邀请你的好友，一起体验三国时代吧，看看谁的关羽才是真正的“武圣”。', './static/img/game-2.jpg', './static/img/game-2-2-1.jpg,./static/img/game-2-2-2.jpg,./static/img/game-2-2-3.jpg,./static/img/game-2-2-4.jpg', '《塔防三国志》是一款三国题材的史诗策略塔防游戏。游戏以三国为背景，重现三国这段充满英雄豪气、波澜壮阔的历史剧情，画面清新、唯美、细腻，玩法新颖多样、乐趣无穷。500名史实武将华丽登场，90张历史地图生动重现，所有著名的三国人物和经典战役，在游戏中应有尽有，玩家可以把心仪的三国明星组织到一起，打造一支征战四方、攻城掠地的梦幻军队。');
INSERT INTO `our_block_games` VALUES ('3', 'ty-yz-003', '1', '1003', '棋牌', '1003', 'Microsoft Studios', '坦克大战：闪电突袭', '0', '0', '369', '0', '0', '1.4', 'Strategy、Role playing', '1535017095', '1542627108', '1', '8b5c6cb0-e3eb-11e8-b8f0-2db9c0f3a1c1', 'https://mini.gamegold.xin/cp/hwgl/index.html', 'tb1qlqqvmzl93an3cv53jgpfnm7k7aep9gxpfzqcaa', 'cptest03', '坦克大战', '', './static/img/game-3-1.jpg', '1.全民系列军事策略手游力作 2.世界征服国战开启，三大阵营酣战淋漓 2.装备新科技的坦克在历史战场完美再现 3.完美操控坦克部队，战场瞬息由你掌握', './static/img/game-3.jpg', './static/img/game-3-2-1.jpg,./static/img/game-3-2-2.jpg,./static/img/game-3-2-3.jpg,./static/img/game-3-2-4.jpg,./static/img/game-3-2-5.jpg,./static/img/game-3-2-6.jpg', '终于等到了！全新世界征服战资料片震撼开启！三大阵营重兵集结，打响国战第一炮！万千坦克同屏对决，铸造最热血的坦克手游！集合策略和国战经典玩法于一体的全民坦克游戏，传奇将领，万人国战，占领世界疆土，成就世界霸主梦');
INSERT INTO `our_block_games` VALUES ('4', 'ty-yz-004', '1', '1004', '休闲', '1001', '天宇互动', 'Halo Wars 2：喚醒夢魘試玩版', '0', '0', '33', '0', '0', '1.2', 'Microsoft Studios Strategy', '1535017226', '1542627126', '1', '35f67d50-e3f1-11e8-92d0-efbb5c339db4', 'https://mini.gamegold.xin/cp/hwgl/index.html', 'tb1qp702eg67av8ty6jl87hyfas8v6h9rzxugvz7su', 'cptest04', ' Halo Wars 2', '', './static/img/game-4-1.jpg', '「終站槍林彈雨」是「喚醒夢魘」擴充套件所提供的遊戲模式。如果您想要利用完整版的「終站槍林彈雨」來測試自己的戰技，以及進行「喚醒夢魘」所提供的全新刺激戰役，您必須擁有 Halo Wars 2。', './static/img/game-4.jpg', './static/img/game-4-2-1.jpg,./static/img/game-4-2-2.jpg,./static/img/game-4-2-3.jpg,./static/img/game-4-2-4.jpg,./static/img/game-4-2-5.jpg,./static/img/game-4-2-6.jpg', ' Halo Wars 2：喚醒夢魘試玩版 Microsoft Studios Strategy 游戏中心  33 Halo Wars 2：喚醒夢魘」提供能讓您體驗終極挑戰的全新遊戲模式，因為您將在其中保護自己的基地，抵擋敵軍一波波的攻擊。您可以在「終站槍林彈雨」遊戲模式中建立自己的軍隊、高塔及防禦工事，對抗您想像得到的各種 UNSC、流放者及蟲族敵人來奮勇求生。');
INSERT INTO `our_block_games` VALUES ('5', 'ty-yz-005', '1', '1005', '射击', '1004', 'FYI游戏', ' Mercs of Boom Mercs of Boom', '0', '0', '130', '0', '0', '1.2.1', 'GAME INSIGHT UAB Strategy', '1535017385', '1542627147', '1', '44516a90-e3f1-11e8-b8f0-2db9c0f3a1c1', 'https://mini.gamegold.xin/cp/hwgl/index.html', 'tb1q5fv084wylgg3rw2g2p2d3calctacem68gvajew', 'cptest05', ' Mercs of Boom', '', './static/img/game-5-1.jpg', '• Upgrade your base and research futuristic technology to gain access to advanced warfare. • Play anywhere, anytime, and even offline to stop the threat in an epic campaign.', './static/img/game-5.jpg', './static/img/game-5-2-1.jpg,./static/img/game-5-2-2.jpg,./static/img/game-5-2-3.jpg,./static/img/game-5-2-4.jpg,./static/img/game-5-2-5.jpg,./static/img/game-5-2-6.jpg', '• Experience turn-based tactical combat and deep strategic gameplay. • Supply elite soldiers with tons of equipment: hi-tech armor, deadly weapons, implants, and gadgets. • Upgrade your base and research futuristic technology to gain access to advanced wa');
INSERT INTO `our_block_games` VALUES ('6', 'ty-yz-006', '6', '1002', '消除', '1001', '天宇互动', ' Code of War Code of War', '0', '0', '206', '0', '0', '1.5.1', 'Extreme Developers Action & adventure', '1539165314', '1542627165', '1', '48482030-e3f1-11e8-b8f0-2db9c0f3a1c1', 'https://mini.gamegold.xin/cp/hwgl/index.html', 'tb1qh0n8cm9tu2l43m9sq3tcynsgd2f09jx9gpdhml', 'cptest06', 'Code of War', '', './static/img/game-6-1.jpg', '与您的朋友并肩作战，在现代在线动作游戏Code of War的排行榜中取得更高排名！ 邀请您的朋友，一起免费畅游！', './static/img/game-6.jpg', './static/img/game-6-2-1.jpg,./static/img/game-6-2-2.jpg,./static/img/game-6-2-3.jpg', '指挥在线枪战 – 纯粹的动作游戏！ Code of War是一款在线枪战游戏，拥有最佳3D图形、真实物理引擎以及海量真实枪支供您选择。 在与来自世界各地的其他玩家对战的动态在线动作游戏内试试您的技能和精通！');
INSERT INTO `our_block_games` VALUES ('7', 'ty-yz-007', '7', '1003', '棋牌', '1002', '红蝶游戏', 'Hunting Shark - Sea Monster 3D', '0', '0', '25', '0', '0', '1.1', 'Action & adventure', '1539165370', '1542627183', '1', '9bd44680-e3eb-11e8-b8f0-2db9c0f3a1c1', 'https://mini.gamegold.xin/cp/hwgl/index.html', 'tb1qddhp67w9vgc8xgqzs77lqkv3c6nz5nqhk2j0uh', 'cptest07', ' Hunting Shark', '', './static/img/game-7-1.jpg', '你的目的是吃别的鱼，完成任务，赚取金币！你还可以吃人。为鲨鱼人真好吃！ 玩法：在海洋移动，找你愿意吃的动物、人等。吃它们以后你的能源尺度将充满。祝你好运！吃个饱！', './static/img/game-7.jpg', './static/img/game-7-2-1.jpg,./static/img/game-7-2-2.jpg,./static/img/game-7-2-3.jpg,./static/img/game-7-2-4.jpg', '大家都知道鲨鱼是最危险的海洋猛兽！别的动物害怕鲨鱼。 认识一下这个鲨鱼！它总是饥饿！帮助它找到吃的东西，满足它的贪饥饿感！海底世界是丰富和细致，提供了大量的机会，让你喂鲨鱼。潜入破坏性的冒险哦！');
INSERT INTO `our_block_games` VALUES ('8', 'ty-yz-008', '8', '1004', '休闲', '1003', 'Microsoft Studios', 'Occupation VROccupation VR', '0', '0', '24', '0', '0', '1.1.1', 'the3daction Shooter', '1539165402', '1542627208', '1', 'a03074b0-e3eb-11e8-b8f0-2db9c0f3a1c1', 'https://mini.gamegold.xin/cp/hwgl/index.html', 'tb1qkgcl4wnlqjz40mtqgd50pagnzjlwl87laddg0k', 'cptest08', 'Occupation VR', '', './static/img/game-8-1.jpg', 'First and Third Person Shooter. Stop zombie invasion and save your girl from zombie\'s hands!', './static/img/game-8.jpg', './static/img/game-8-2-1.jpg,./static/img/game-8-2-2.jpg,./static/img/game-8-2-3.jpg,./static/img/game-8-2-4.jpg,./static/img/game-8-2-5.jpg,./static/img/game-8-2-6.jpg', '你好邻居你好邻居');
INSERT INTO `our_block_games` VALUES ('9', 'ty-yz-009', '1', '1001', '益智', '1005', '原石互娱', '猴王归来：仙界争霸', '0', '0', '6259', '0', '0', 'v1.6.2', 'Gameloft. Strategy', '1539167033', '1542627244', '1', 'a4c00ef0-e3eb-11e8-b8f0-2db9c0f3a1c1', 'https://monkey.gamegold.xin:9101/client/', 'tb1qg6yzv883gzawhtnsa22m4lrdjqt8kn9yeev4xd', 'cptest09', '奔跑的悟空', '', './static/img/game-9-1.jpg', '当整个世界饱受战乱之苦时，骁勇善战的将领们揭竿而起，率领他们的心腹大军赶赴世界战场！保家卫国，匹夫有责！你，准备好了吗？赶快拿起手机，来游戏中建立基地，带领军队在真实的世界地图上攻城掠地，征服世界成就霸业！', './static/img/game-9.jpg', './static/img/game-9-2-1.jpg,./static/img/game-9-2-2.jpg,./static/img/game-9-2-3.jpg,./static/img/game-9-2-4.jpg', '当整个世界饱受战乱之苦时，骁勇善战的将领们揭竿而起，率领他们的心腹大军赶赴世界战场！保家卫国，匹夫有责！你，准备好了吗？赶快拿起手机，来游戏中建立基地，带领军队在真实的世界地图上攻城掠地，征服世界成就霸业！');
INSERT INTO `our_block_games` VALUES ('10', 'ty-yz-010', '1', '1002', '消除', '1001', '天宇互动', '战争星球Online：世界争霸', '0', '0', '76', '0', '0', '1.8.1', 'Entertainment', '1539413588', '1542627265', '1', 'a96a3610-e3eb-11e8-b8f0-2db9c0f3a1c1', 'https://mini.gamegold.xin/cp/hwgl/index.html', 'tb1qfn2ase6s2a7pfxl998kz5u3ghxrdk0hqmeuwpe', 'cptest10', ' 无双真三国', '', './static/img/game-10-1.jpg', '强大的3D游戏引擎，轻触屏幕，极限流畅，让你感受强大的撞击力与震撼力。 华丽的技能特效 多人实时战斗，多重技能叠加，释放超级炫丽特效，会让你感受极致的视觉冲击。 丰富的三国英雄 近百位特性各异的武将，搭配独创的专属武器系统，让您从容指挥，决战千里。', './static/img/game-10.jpg', './static/img/game-10-2-1.jpg,./static/img/game-10-2-2.jpg,./static/img/game-10-2-3.jpg,./static/img/game-10-2-4.jpg,./static/img/game-10-2-5.jpg,./static/img/game-10-2-6.jpg', '全3D实时战斗手游，爽快的指尖微操，华丽的技能特效，奇妙的关卡剧情，丰富的三国豪杰，让您在全3D战斗中感受刺激与快乐。 数十万玩家同时在线，给予您极灵活的策略搭配，跨服战斗操作，带来您前所未有的震撼体验！');
INSERT INTO `our_block_games` VALUES ('11', 'ty-yz-011', '1', '1003', '棋牌', '1004', 'FYI游戏', '共和国保卫战共和国保卫战', '0', '0', '54', '0', '0', '1.5.12', 'Entertainment', '1539413784', '1541408382', '2', 'c3269670-d905-11e8-894e-eba90eccf044', 'https://mini.gamegold.xin/cp/hwgl/index.html', null, null, '共和国保卫战', '', './static/img/game-11-1.jpg', '重回二战！黑暗力量冲破时空枷锁，回到1939，妄图称霸世界！ 三大阵营重兵集结，未来科技助力二战，打响世界争夺战的第一炮！ 万千坦克同屏对决，欧洲战场浴血再战！击败法西斯，击败黑暗势力，重新建立和平世界的新秩序，谁来一同成就世界霸主梦想！', './static/img/game-11.jpg', './static/img/game-11-2-1.jpg,./static/img/game-11-2-2.jpg,./static/img/game-11-2-3.jpg,./static/img/game-11-2-4.jpg,./static/img/game-11-2-5.jpg,./static/img/game-11-2-6.jpg', '致敬红色警戒，黑化二战巅峰巨作！ 重回二战！黑暗力量冲破时空枷锁，回到1939，妄图称霸世界！ 三大阵营重兵集结，未来科技助力二战，打响世界争夺战的第一炮！');
INSERT INTO `our_block_games` VALUES ('12', 'ty-yz-012', '1', '1004', '休闲', '1001', '天宇互动', ' 三国演义：群雄逐鹿', '0', '0', '6253', '0', '0', '1.7.6', 'Gameloft. Strategy', '1539414021', '1541408389', '2', 'd9dd4120-d905-11e8-894e-eba90eccf044', 'https://mini.gamegold.xin/cp/hwgl/index.html', null, null, ' 三国演义', '', './static/img/game-12-1.jpg', '【超细腻的原画设定】 每个细节都力求细致完美，给玩家超美好精致的游戏视觉享受，让游戏拥有好莱坞大片质感！ 【超丰富的PVE玩法】 横扫千军、过关斩将、攻城拔寨、通天之塔……奇特玩法+PVE副本=无限乐趣，彻底告别传统的无脑刷图，让刷本不无聊，团队闯关更畅快！！', './static/img/game-12.jpg', './static/img/game-12-2-1.jpg,./static/img/game-12-2-2.jpg,./static/img/game-12-2-3.jpg,./static/img/game-12-2-4.jpg,./static/img/game-12-2-5.jpg,./static/img/game-12-2-6.jpg', '三国时代英雄豪杰为你而战，你可以自由的收集，按照自己的战斗策略来率领他们击败所有敌人，随心所欲打造不同的武将组合重新定义三国时代，颠覆传统的三国游戏。');
INSERT INTO `our_block_games` VALUES ('13', 'ty-yz-013', '1', '1001', '益智', '1003', 'Microsoft Studios', '奇迹觉醒-2018经典回归', '0', '0', '72', '0', '0', '1.6.9', 'HKpro Entertainment', '1539414112', '1541408397', '2', 'e4f38ab0-d905-11e8-894e-eba90eccf044', 'https://mini.gamegold.xin/cp/hwgl/index.html', null, null, ' 奇迹觉醒', '', './static/img/game-13-1.jpg', '突破傳統玩法 創新角色操控  戰士、魔法師、弓箭手等經典職業榮耀回歸，再度開啟「一轉」、「二轉」、「三轉」的實力試煉！突破傳統職業玩法，一人可同時操控多個角色，拒絕單角色的枯燥！最愛刷怪爆裝 難忘的艱辛+15 裝備掉落概率大力UP！人品再低也有機會爆出神裝！一起再度回味追求+15強化的血淚史，一起等待讓人期待的「叮叮」聲！', './static/img/game-13.jpg', './static/img/game-13-2-1.jpg,./static/img/game-13-2-2.jpg,./static/img/game-13-2-3.jpg,./static/img/game-13-2-4.jpg', '15年經典回憶 全新MU歷險 延續熱血回憶，奇蹟再度降臨！遊戲重現「勇者大陸」、「天空之城」、「冰風谷」等熟悉地圖， MU大陸再度淪落暗黑時代，勇士召集令響徹天際！');
INSERT INTO `our_block_games` VALUES ('14', 'ty-yz-014', '1', '1002', '消除', '1004', 'FYI游戏', '战争星球Online：世界争霸', '0', '0', '229', '0', '0', '1.4.3', 'MC-Studio Entertainment', '1539414167', '1541408406', '2', 'f20f4130-d905-11e8-894e-eba90eccf044', 'https://mini.gamegold.xin/cp/hwgl/index.html', null, null, '逐鹿皇城', '', './static/img/game-14-1.jpg', '【谋略为王 配将兵种环环相关】  名将技能丰富多样，多类型兵种齐上阵，相生相克环环相扣，搭配尽显策略。以为他拥有绝对最强阵容？错！总有一款能克他！  【逼真战场 亲临前线热血沸腾】  历史战役全方位写实还原，三英战吕布、官渡之战、火烧赤壁、水淹七军…… 亲身参与到历史经典战役中，重燃热血激情！', './static/img/game-14.jpg', './static/img/game-14-2-1.jpg,./static/img/game-14-2-2.jpg,./static/img/game-14-2-3.jpg,./static/img/game-14-2-4.jpg,./static/img/game-14-2-5.jpg', '【畅爽游玩 海量福利领到手软】  首日送赵云，推图神将七进七出！次日领甄姬，洛神降临奶量十足！前期更有万千元宝放送，畅爽十连抽，根本停不下来！  【宗族作战 王侯将相异姓相争】  游戏独创宗族系统，同姓氏玩家归属同一宗族，与“同根同源”的兄弟姐妹并肩作战，荣辱与共，天下都随我姓！');
INSERT INTO `our_block_games` VALUES ('15', 'ty-yz-015', '1', '1003', '棋牌', '1002', '红蝶游戏', ' 奇迹归来-大天使之剑', '0', '0', '263', '0', '0', '1.8.1', 'MC-Studio Entertainment', '1539414216', '1541408415', '2', 'fce610c0-d905-11e8-894e-eba90eccf044', 'https://mini.gamegold.xin/cp/hwgl/index.html', null, null, '奇迹归来', '', './static/img/game-15-1.jpg', '话说《大天使之剑》和之前页游差别真的很大，在手游版的制作时，有删改有添加，基本是重新开始。游戏画面我们坚持了端游奇迹MU的一些经典画风和设定，天空之城、冰封谷、仙踪林……都保留了下来，但是手游版本的画面酷的炫的太多了，我们不太一样，我们想要更“炫酷”更“好玩”，当然肯定有一些小创新，这里就先卖个小关子了。', './static/img/game-15.jpg', './static/img/game-15-2-1.jpg,./static/img/game-15-2-2.jpg,./static/img/game-15-2-3.jpg,./static/img/game-15-2-4.jpg', '大家好《奇迹归来-大天使之剑》是一款开局没有狗，也没一刀999，只有10秒下载、不肝不坑、离线升级、上班可玩、搭车也嗨、单手操作、肆意刷怪还挺爽快、非常魔性、一定“中毒”的奇迹手游。');
INSERT INTO `our_block_games` VALUES ('16', 'ty-yz-016', '1', '1001', '益智', '1001', '天宇互动', '3D西游修仙手游', '0', '0', '344', '0', '0', '1.5', 'MC-Studio Entertainment', '1539769153', '1540548859', '2', '0705ec60-d906-11e8-894e-eba90eccf044', 'https://mini.gamegold.xin/cp/hwgl/index.html', null, null, '神游记', '', './static/img/game-16-1.jpg', '1、轻松又愉快的奇遇任务，玩法简单而且奖励丰富; 2、收集和培养英雄可大量提升玩家的战斗力，为英雄升级进阶吧; 3、在熔炼界面中进行低级装备熔炼，有几率获得高品质装备; 4、多达十几种活动丰富玩家的游戏生活; 5、120个关卡boss等待强力的玩家来挑战。', './static/img/game-16.jpg', './static/img/game-16-2-1.jpg,./static/img/game-16-2-2.jpg,./static/img/game-16-2-3.jpg,./static/img/game-16-2-4.jpg', '《神游记》是一款大型多人同步即时战斗的3D游戏，将西游记、封神榜等众多古典名著重新解构，任你随意驰骋，快意恩仇。');
INSERT INTO `our_block_games` VALUES ('17', 'ty-yz-017', '1', '1004', '休闲', '1001', '天宇互动', ' 江山美人-模拟经营官斗手游', '0', '0', '236', '0', '0', '1.8.1', 'MC-Studio Entertainment', '1539769357', '1540548870', '2', '1374e820-d906-11e8-894e-eba90eccf044', 'https://mini.gamegold.xin/cp/hwgl/index.html', null, null, '江山美人', '', './static/img/game-17-1.jpg', '新服豪礼神器光武 奖励派送多倍优惠 成长计划助力升级 战力排行快速升级 等级排行神器降世 同伴与你并肩战斗 挂机战斗无需劳心 随时交友收获快乐 连续登陆成就富豪 神龙宝塔层层奖励', './static/img/game-17.jpg', './static/img/game-17-2-1.jpg,./static/img/game-17-2-2.jpg,./static/img/game-17-2-3.jpg,./static/img/game-17-2-4.jpg', '2018年后宫养成重磅巨制！ 写实画风，战斗畅爽炫酷！ 千万字原创游戏剧情，近千个原创角色！');
INSERT INTO `our_block_games` VALUES ('18', 'ty-yz-018', '1', '1005', '射击', '1001', '天宇互动', '青云飞仙诀青云飞仙诀', '0', '0', '23', '0', '0', '2.6', 'HKpro Entertainment', '1539769601', '1540548891', '2', '1d9d2830-d906-11e8-894e-eba90eccf044', 'https://mini.gamegold.xin/cp/hwgl/index.html', null, null, '青云飞仙诀', '', './static/img/game-18-1.jpg', '——千人同屏·万人跨服—— 千人激情同屏，5v5、3v3、神兽击杀、联盟约战，各类玩法等你来。更加入跨服出征等全新的玩法，海战、空战引爆激情，出征王者就是你！  ——神装羽翼·多样玩法—— 神装、羽翼、法宝、助你战力增长，玩转pk系统。更有千种装备搭配让你的人物与众不同！  ——婚恋玩法·社交新体验—— 无好友、不游戏，《青云飞仙诀》推出全新社交系统，更有婚恋玩法等你来，这里，可以与兄弟同战，也可以携手仙侣双人并肩！', './static/img/game-18.jpg', './static/img/game-18-2-1.jpg,./static/img/game-18-2-2.jpg,./static/img/game-18-2-3.jpg,./static/img/game-18-2-4.jpg', '游戏礼包登录即送、充值反馈、回归大礼，各种礼包领不停，助力仙途！');
INSERT INTO `our_block_games` VALUES ('19', 'ty-yz-019', '1', '1005', '射击', '1001', '天宇互动', '凡人修仙凡人修仙', '0', '0', '345', '0', '0', '1.6.2', 'MC-Studio Entertainment', '1539769743', '1540548904', '2', '2cf51310-d906-11e8-894e-eba90eccf044', 'https://mini.gamegold.xin/cp/hwgl/index.html', null, null, '凡人修仙', '', './static/img/game-19-1.jpg', '【法宝幻化，飞空斗法】 养成法宝，释放震撼大招，幻化飞行，行走天地之间。收集专属你的法宝，与各路道友切磋高低。 【自由空战，神兵交锋】 御空飞行不仅是游戏标配，还将实现空中战斗！游戏首创空战副本，玩家可自由飞行战斗，与魔物邪修决一生死。 【双武切换，拳拳入肉】 战斗系统上手简单，快感十足。四大职业，风格各异。双武器随时切换，华丽连招，轻松释放。支持单人和多人实时PVP，混战中体验超神的快感。 【创新副本，多重玩法】 化身韩立、南宫婉，独闯龙潭，体验主角团威力。另外，丰富的合作副本、日常玩法、门派争霸，让玩', './static/img/game-19.jpg', './static/img/game-19-2-1.jpg,./static/img/game-19-2-2.jpg,./static/img/game-19-2-3.jpg,./static/img/game-19-2-4.jpg', '转眼八年，好久不见！由《凡人修仙传》原作者忘语正版授权改编的首款3D飞仙空战同名手游重磅来袭，带领众仙友重回梦开始的地方！游戏秉承高度还原小说精髓为宗旨，再现原著“一世凡人，一世仙”的热血情怀。在这恢弘磅礴的修仙大世界，玩家将化身主角与原著众角色亲密互动并肩作战，亲历角');
INSERT INTO `our_block_games` VALUES ('20', 'ty-yz-020', '1', '1005', '射击', '1001', '天宇互动', '九州封神录-全民觉醒', '0', '0', '18', '0', '0', '1.6.2', 'HKpro Entertainment', '1539769885', '1540548915', '2', '3963c0b0-d906-11e8-894e-eba90eccf044', 'https://mini.gamegold.xin/cp/hwgl/index.html', null, null, '九州封神录', '', './static/img/game-20-1.jpg', '【PK爆装 热血攻沙】 自由PK，血战红名，杀人爆物，血性刺激！ 落霞夺宝、镖车护送、领地争夺、激情攻沙……丰富的PvP玩法，待你一战成名！  【千人同屏 精准击杀】 PK系统深度优化，UE体验创新设定，操作手感超畅爽， 千人同屏热血攻沙，一键锁定精准击杀，寻敌千里取敌首级。', './static/img/game-20.jpg', './static/img/game-20-2-1.jpg,./static/img/game-20-2-2.jpg,./static/img/game-20-2-3.jpg,./static/img/game-20-2-4.jpg', '《九州》以同名端游为基础，倾力打造的正版传世手游。作为经典端游移动化压轴之作，手游原版复刻端游经典元素，战法道枪多种职业、打宝、红名、PK爆物、行会攻沙……力求在移动端完美还原“传世经典”。绚丽多彩的画风，华丽的技能特效、创新的UE优化、畅爽的操作手感，打造2017年最受期待的热');

-- ----------------------------
-- Table structure for `our_block_user_base`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_user_base`;
CREATE TABLE `our_block_user_base` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `user_name` varchar(32) NOT NULL COMMENT '用户名',
  `password_hash` varchar(255) NOT NULL COMMENT '加密',
  `auth_key` varchar(32) DEFAULT NULL COMMENT '密钥 ',
  `registration_ip` varchar(45) DEFAULT NULL COMMENT '注册地址',
  `remember_token` varchar(32) DEFAULT NULL COMMENT '记住登录',
  `created_at` bigint(12) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updated_at` bigint(12) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间 ',
  `blocked_at` bigint(12) unsigned DEFAULT '0' COMMENT '封锁时间',
  `flags` int(1) unsigned NOT NULL DEFAULT '0' COMMENT '标识',
  `openid` varchar(32) DEFAULT NULL COMMENT 'openid',
  `user_type` int(2) NOT NULL DEFAULT '0' COMMENT '用户类型',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `user_unique_username` (`user_name`) USING BTREE,
  KEY `openid` (`openid`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of our_block_user_base
-- ----------------------------
INSERT INTO `our_block_user_base` VALUES ('16', 'bsrspy32_76609303', '235a24888087ba2be6e740ba2335ea7b', '235a24888087ba2be6e740ba2335ea7b', null, 'jysaksmxyimdjiitpzwykihp7kk7w75e', '1543389029827', '0', '0', '1', 'oHvae4rF-nfnTQVxuCw6PS9Y8vw0', '1');

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
-- Records of our_block_user_game
-- ----------------------------
INSERT INTO `our_block_user_game` VALUES ('3', '16', 'oHvae4rF-nfnTQVxuCw6PS9Y8vw0', '1');
INSERT INTO `our_block_user_game` VALUES ('4', '16', 'oHvae4rF-nfnTQVxuCw6PS9Y8vw0', '2');
INSERT INTO `our_block_user_game` VALUES ('5', '16', 'oHvae4rF-nfnTQVxuCw6PS9Y8vw0', '3');

-- ----------------------------
-- Table structure for `our_block_user_profile`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_user_profile`;
CREATE TABLE `our_block_user_profile` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `uid` int(8) unsigned NOT NULL COMMENT '用户编号',
  `nick` varchar(128) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '昵称',
  `phone` varchar(32) DEFAULT NULL COMMENT '手机',
  `email` varchar(128) DEFAULT NULL COMMENT '邮件',
  `gender` int(1) unsigned NOT NULL DEFAULT '0' COMMENT '性别',
  `birth` varchar(16) DEFAULT '0' COMMENT '生日',
  `country` varchar(32) DEFAULT NULL COMMENT '国家',
  `province` varchar(32) DEFAULT NULL COMMENT '省份',
  `city` varchar(32) DEFAULT NULL COMMENT '城市',
  `prop_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '道具数量',
  `current_prop_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '当前道具数量',
  `block_addr` varchar(64) DEFAULT NULL,
  `nlevel` int(1) unsigned NOT NULL DEFAULT '0' COMMENT '等级',
  `avatar` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '头像',
  `ranking` int(2) unsigned NOT NULL DEFAULT '0' COMMENT '排名',
  `star_level` int(2) unsigned NOT NULL DEFAULT '0' COMMENT '星级',
  `down_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '下载次数',
  `game_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '游戏数',
  `follow_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '关注数',
  `no_reading_msg_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '未读消息数',
  `comment_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '评论数',
  `buy_count` int(4) unsigned NOT NULL DEFAULT '0' COMMENT '消费次数',
  `games` varchar(255) DEFAULT NULL COMMENT '所有游戏，以","隔开',
  `avatar_uri` varchar(255) DEFAULT NULL COMMENT '头像uri',
  `desc` varchar(255) DEFAULT NULL COMMENT '个人描述',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  CONSTRAINT `our_block_user_profile_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `our_block_user_base` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of our_block_user_profile
-- ----------------------------
INSERT INTO `our_block_user_profile` VALUES ('9', '16', '一亩地', null, null, '1', '0', '中国', '福建', '福州', '0', '0', 'tb1qzu3p7azw6se3528yepvj4scy0jpjylskyhsl5z', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', null, 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqgmmKj2iaDiaan1lv0mQ1iaibbsNBs5cWZsXE4eqM8D7CeIeuwJX68PQDwgGbJd2zLfvwgy00QWLAOhw/132', null);

-- ----------------------------
-- Table structure for `our_block_user_token`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_user_token`;
CREATE TABLE `our_block_user_token` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `uid` int(8) unsigned NOT NULL COMMENT '用户编号',
  `token_type` int(1) unsigned NOT NULL COMMENT '令牌类型',
  `token_code` varchar(32) NOT NULL COMMENT '令牌码',
  `created_at` bigint(12) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_type_unique` (`uid`,`token_type`) USING BTREE,
  CONSTRAINT `our_block_user_token_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `our_block_user_base` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of our_block_user_token
-- ----------------------------

-- ----------------------------
-- Table structure for `our_block_user_unionid`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_user_unionid`;
CREATE TABLE `our_block_user_unionid` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增',
  `unionid` varchar(32) NOT NULL COMMENT '微信全局ID',
  `uid` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`) USING BTREE,
  CONSTRAINT `our_block_wechat_user_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `our_block_user_base` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of our_block_user_unionid
-- ----------------------------

-- ----------------------------
-- Table structure for `our_block_user_wallet`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_user_wallet`;
CREATE TABLE `our_block_user_wallet` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自动编号',
  `uid` int(8) unsigned NOT NULL COMMENT '用户编号',
  `cid` varchar(64) NOT NULL COMMENT 'cid',
  `addr` varchar(64) NOT NULL COMMENT '钱包地址',
  `cp_uid` varchar(32) NOT NULL COMMENT 'cp用户ID',
  `openid` varchar(32) NOT NULL COMMENT 'openid',
  `mnemonic_word` varchar(255) DEFAULT NULL COMMENT '助记词',
  `wallet_service_uri` varchar(255) DEFAULT NULL COMMENT '钱包服务URI',
  `remaining_coin` int(4) unsigned DEFAULT '0' COMMENT '账户虚拟币余额',
  `gift` int(4) DEFAULT NULL COMMENT '平台赠送礼品',
  `donate_count` int(4) unsigned DEFAULT '0' COMMENT '赠送次数',
  `buy_count` int(4) unsigned DEFAULT '0' COMMENT '消费次数',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `cid` (`cid`) USING BTREE,
  KEY `uid` (`uid`),
  CONSTRAINT `our_block_user_wallet_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `our_block_user_base` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of our_block_user_wallet
-- ----------------------------

-- ----------------------------
-- Table structure for `our_block_user_wechat`
-- ----------------------------
DROP TABLE IF EXISTS `our_block_user_wechat`;
CREATE TABLE `our_block_user_wechat` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT,
  `openid` varchar(32) NOT NULL COMMENT 'openid',
  `ntype` int(1) unsigned NOT NULL DEFAULT '0' COMMENT '类型（1公众号2客户端）',
  `uid` int(8) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `unionid` varchar(32) DEFAULT '' COMMENT 'unionid',
  `first_time` bigint(12) unsigned NOT NULL DEFAULT '0' COMMENT '第一次登陆时间',
  `last_time` bigint(12) unsigned NOT NULL DEFAULT '0' COMMENT '最后登陆时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `openid` (`openid`,`ntype`) USING BTREE,
  KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of our_block_user_wechat
-- ----------------------------
INSERT INTO `our_block_user_wechat` VALUES ('2', 'oHvae4rF-nfnTQVxuCw6PS9Y8vw0', '1', '16', '', '1543389029827', '1543389029827');
