
const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let StockBulletin = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'StockBulletin',
    {
        cid: Sequelize.STRING,
        cp_name: Sequelize.STRING,
        cp_text: Sequelize.STRING,
        stock_day: Sequelize.STRING,
        stock_open: Sequelize.INTEGER,
        stock_close: Sequelize.INTEGER,
        stock_high: Sequelize.INTEGER,
        stock_low: Sequelize.INTEGER,
        total_num: Sequelize.INTEGER,
        total_amount: Sequelize.INTEGER,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_stock_bulletin',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.StockBulletin = StockBulletin;
