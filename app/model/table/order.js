/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let order = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'order',
    {
        uid: Sequelize.INTEGER,
        order_sn: Sequelize.STRING,
        order_num: Sequelize.INTEGER,
        product_id: Sequelize.INTEGER,
        product_info: Sequelize.STRING,
        attach: Sequelize.STRING,
        quantity: Sequelize.INTEGER,
        order_status: Sequelize.INTEGER,
        pay_status: Sequelize.INTEGER,
        create_time: Sequelize.INTEGER,
        update_time: Sequelize.INTEGER,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_order',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.order = order;
