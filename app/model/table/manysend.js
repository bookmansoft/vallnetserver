/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let ManySend = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'ManySend',
    {
        // CREATE TABLE `our_many_red_send` (
        //     `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '红包id',
        //     `total_amount` int(11) NOT NULL DEFAULT '0' COMMENT '红包总金额',
        //     `actual_amount` int(11) NOT NULL DEFAULT '0' COMMENT '已领取的实际金额',
        //     `total_num` int(3) NOT NULL DEFAULT '1' COMMENT '红包总个数',
        //     `send_uid` varchar(255) NOT NULL COMMENT '发送人uid',
        //     `send_nickname` varchar(255) NOT NULL COMMENT '发送人昵称',
        //     `send_headimg` varchar(255) NOT NULL COMMENT '头像',
        //     `wishing` varchar(255) NOT NULL COMMENT '祝福语',
        //     `modify_date` int DEFAULT NULL COMMENT '发送时间',
        //     PRIMARY KEY (`id`)
        //   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        total_amount: Sequelize.INTEGER,
        actual_amount: Sequelize.INTEGER,
        total_num: Sequelize.INTEGER,
        send_uid: Sequelize.INTEGER,
        send_nickname: Sequelize.STRING,
        send_headimg: Sequelize.STRING,
        wishing: Sequelize.STRING,
        modify_date: Sequelize.INTEGER,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_many_red_send',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.ManySend = ManySend;
