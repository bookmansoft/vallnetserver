/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let blockgamecomment = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'blockgamecomment',
    {
        cid: Sequelize.STRING,
        reply_id: Sequelize.INTEGER,
        uid: Sequelize.INTEGER,
        nick: Sequelize.STRING,
        avatar_url: Sequelize.STRING,
        ip: Sequelize.STRING,
        resp_count: Sequelize.INTEGER,
        point_up_count: Sequelize.INTEGER,
        create_at: Sequelize.INTEGER,
        title: Sequelize.STRING,
        content: Sequelize.STRING,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_game_comment',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.blockgamecomment = blockgamecomment;
