/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let sharedredpack_receive = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'sharedredpack_receive',
    {
        send_id: Sequelize.INTEGER,
        receive_amount: Sequelize.INTEGER,
        receive_uid: Sequelize.INTEGER,
        modify_date: Sequelize.INTEGER,
        hash: Sequelize.STRING,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_shared_redpack_receive',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.sharedredpack_receive = sharedredpack_receive;
