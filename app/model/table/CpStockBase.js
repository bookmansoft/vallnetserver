/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let CpStockBase = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'CpStockBase',
    {
        cpid: Sequelize.INTEGER,
        cid: Sequelize.STRING,
        cp_name: Sequelize.STRING,
        cp_text: Sequelize.STRING,
        total_num: Sequelize.INTEGER,
        sell_stock_amount: Sequelize.INTEGER,
        sell_stock_num: Sequelize.INTEGER,
        base_amount: Sequelize.INTEGER,
        operator_id: Sequelize.INTEGER,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'cp_stock_base',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.CpStockBase = CpStockBase;
