/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let CpType = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'CpType',
    {
        cp_type_id: Sequelize.STRING,
        cp_type_name: Sequelize.STRING,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'cp_type',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.CpType = CpType;
