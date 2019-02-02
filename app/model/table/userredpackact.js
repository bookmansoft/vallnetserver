/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let UserRedPackAct = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'UserRedPackAct',
    {
        uid: Sequelize.INTEGER,
        act_id: Sequelize.INTEGER,
        act_name: Sequelize.STRING,
        act_count: Sequelize.INTEGER,
        amount_all: Sequelize.INTEGER,
        last_act_at: Sequelize.INTEGER,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_user_redpack_act',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.UserRedPackAct = UserRedPackAct;
