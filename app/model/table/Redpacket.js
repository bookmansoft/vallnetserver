/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let Redpacket = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'Redpacket',
    {
        act_name: Sequelize.STRING,
        act_sequence: Sequelize.STRING,
        total_gamegold: Sequelize.INTEGER,
        each_gamegold: Sequelize.INTEGER,
        total_num: Sequelize.INTEGER,
        each_num: Sequelize.INTEGER,
        act_desc: Sequelize.STRING,
        act_start_at: Sequelize.INTEGER,
        act_end_at: Sequelize.INTEGER,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_redpack_act',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.Redpacket = Redpacket;
