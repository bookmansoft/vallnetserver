/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let cpprop = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'cpprop',
    {
        oid: Sequelize.STRING,
        prop_id: Sequelize.STRING,
        prop_name: Sequelize.STRING,
        prop_icon: Sequelize.STRING,
        prop_info: Sequelize.STRING,
        gold: Sequelize.BIGINT,
        price: Sequelize.BIGINT
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_cp_prop',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.cpprop = cpprop;
