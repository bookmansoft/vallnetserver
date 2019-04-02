/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let RedPack = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'RedPack',
    {
        user_redpack_id: Sequelize.INTEGER,
        uid: Sequelize.INTEGER,
        act_id: Sequelize.INTEGER,
        act_name: Sequelize.STRING,
        mch_billno: Sequelize.STRING,
        nick_name: Sequelize.STRING,
        re_openid: Sequelize.STRING,
        remark: Sequelize.STRING,
        send_name: Sequelize.STRING,
        total_amount: Sequelize.INTEGER,
        total_num: Sequelize.INTEGER,
        wishing: Sequelize.STRING,
        return_msg: Sequelize.STRING,
        order_status: Sequelize.INTEGER,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_redpack',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.RedPack = RedPack;
