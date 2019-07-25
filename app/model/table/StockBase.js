/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let StockBase = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'StockBase',
    {
        cid: Sequelize.STRING,
        total_num: Sequelize.INTEGER,
        sell_stock_amount: Sequelize.INTEGER,
        sell_stock_num: Sequelize.INTEGER,
        base_amount: Sequelize.INTEGER,
        funding_text: Sequelize.STRING,
        funding_project_text: Sequelize.STRING,
        stock_money: Sequelize.INTEGER,
        supply_people_num: Sequelize.INTEGER,
        supply_money: Sequelize.INTEGER,
        funding_residue_day: Sequelize.INTEGER,
        funding_target_amount: Sequelize.INTEGER,
        funding_done_amount: Sequelize.INTEGER,
        history_text: Sequelize.STRING,
        now_sale: Sequelize.STRING,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_stock_base',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.StockBase = StockBase;
