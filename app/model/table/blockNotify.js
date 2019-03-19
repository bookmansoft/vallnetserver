/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let BlockNotify = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'BlockNotify',
    {
        sn: Sequelize.STRING,
        h: Sequelize.INTEGER,
        status: Sequelize.INTEGER,
        content: Sequelize.STRING,
        type: Sequelize.STRING,
        uid: Sequelize.INTEGER,
        create_time: Sequelize.INTEGER,
        update_time: Sequelize.INTEGER
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_notify',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.BlockNotify = BlockNotify;
