/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let UserBase = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'UserBase',
    {
        user_name: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        auth_key: Sequelize.STRING,
        registration_ip: Sequelize.STRING,
        remember_token: Sequelize.STRING,
        openid: Sequelize.STRING,
        created_at: Sequelize.BIGINT,
        updated_at: Sequelize.BIGINT,
        blocked_at: Sequelize.BIGINT,
        flags: Sequelize.INTEGER,
        user_type: Sequelize.INTEGER
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_user_base',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);

exports.UserBase = UserBase;
