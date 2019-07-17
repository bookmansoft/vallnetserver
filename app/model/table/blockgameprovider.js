/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let blockgameprovider = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'blockgameprovider',
    {
        provider_id: Sequelize.INTEGER,
        provider_name: Sequelize.STRING,
        contact: Sequelize.STRING,
        phone: Sequelize.STRING,
        addr: Sequelize.STRING,
        uri: Sequelize.STRING,
        game_number: Sequelize.INTEGER,
        comprehensive_grade: Sequelize.INTEGER
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_game_provider',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.blockgameprovider = blockgameprovider;
