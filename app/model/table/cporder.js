/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let CpOrder = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'CpOrder',
    {
        uid: Sequelize.INTEGER,
        openid: Sequelize.STRING,
        user_addr: Sequelize.STRING,
        order_sn: Sequelize.STRING,
        order_num: Sequelize.INTEGER,
        prop_id: Sequelize.INTEGER,
        prop_name: Sequelize.STRING,
        prop_oid: Sequelize.STRING,
        prop_value: Sequelize.STRING,
        prop_icon: Sequelize.STRING,
        order_status: Sequelize.STRING,
        prop_status: Sequelize.INTEGER,
        pay_status: Sequelize.INTEGER,
        create_time: Sequelize.BIGINT,
        update_time: Sequelize.BIGINT
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_cp_order',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.CpOrder = CpOrder;
