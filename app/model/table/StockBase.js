/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let StockBase = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'StockBase',
    {
        cid: Sequelize.STRING,
        cp_name: Sequelize.STRING,
        cp_text: Sequelize.STRING,
        total_num: Sequelize.INTEGER,
        sell_stock_amount: Sequelize.INTEGER,
        sell_stock_num: Sequelize.INTEGER,
        base_amount: Sequelize.INTEGER,

        large_img_url: Sequelize.STRING,
        small_img_url: Sequelize.STRING,
        icon_url: Sequelize.STRING,
        pic_urls: Sequelize.STRING,
        cp_desc: Sequelize.STRING,
        funding_text: Sequelize.STRING,
        funding_project_text: Sequelize.STRING,
        stock_money: Sequelize.INTEGER,
        supply_people_num: Sequelize.INTEGER,
        supply_money: Sequelize.INTEGER,
        funding_residue_day: Sequelize.INTEGER,
        funding_target_amount: Sequelize.INTEGER,
        funding_done_amount: Sequelize.INTEGER,
        provider: Sequelize.STRING,
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