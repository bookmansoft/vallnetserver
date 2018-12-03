/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let UserWechat = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'UserWechat',
    {
        openid: Sequelize.STRING,
        ntype: Sequelize.INTEGER,
        uid: Sequelize.INTEGER,
        unionid: Sequelize.STRING,
        first_time: Sequelize.BIGINT,
        last_time: Sequelize.BIGINT
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_user_wechat',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.UserWechat = UserWechat;
