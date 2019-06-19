/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let UserProp = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'UserProp',
    {
        uid: Sequelize.INTEGER,
        openid: Sequelize.STRING,
        cid: Sequelize.STRING,
        oid: Sequelize.STRING,
        pid: Sequelize.STRING,
        oper: Sequelize.STRING,
        current_hash: Sequelize.STRING,
        current_index: Sequelize.INTEGER,
        current_rev: Sequelize.STRING,
        current_height: Sequelize.BIGINT,
        time: Sequelize.BIGINT,
        gold: Sequelize.BIGINT,
        status: Sequelize.INTEGER,
        cp_url: Sequelize.STRING,
        cp_name: Sequelize.STRING,
        cp_ip: Sequelize.STRING,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_user_prop',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.UserProp = UserProp;
