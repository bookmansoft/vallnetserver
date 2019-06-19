/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let ManyReceive = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'ManyReceive',
    {
        // CREATE TABLE `our_many_red_receive` (
        //     `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '接收id',
        //     `send_id` int(11) NOT NULL COMMENT '对应的红包组id，即发送时留存的记录',
        //     `receive_amount` int(11) NOT NULL COMMENT '接收金额',
        //     `send_uid` int NOT NULL COMMENT '发送人uid，冗余用于查询',
        //     `send_nickname` varchar(255) NOT NULL COMMENT '发送人昵称，冗余用于查询',
        //     `send_headimg` varchar(255) NOT NULL COMMENT '头像',
        //     `receive_uid` int DEFAULT NULL COMMENT '接收人uid',
        //     `receive_nickname` varchar(255) DEFAULT NULL COMMENT '接收人昵称',
        //     `receive_headimg` varchar(255) DEFAULT NULL COMMENT '接收人头像',
        //     `modify_date` int DEFAULT NULL COMMENT '发送时间',
        //     PRIMARY KEY (`id`)
        //   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        send_id: Sequelize.INTEGER,
        receive_amount: Sequelize.INTEGER,
        send_uid: Sequelize.INTEGER,
        send_nickname: Sequelize.STRING,
        send_headimg: Sequelize.STRING,
        receive_uid: Sequelize.INTEGER,
        receive_nickname: Sequelize.STRING,
        receive_headimg: Sequelize.STRING,
        modify_date: Sequelize.INTEGER,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_many_red_receive',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.ManyReceive = ManyReceive;
