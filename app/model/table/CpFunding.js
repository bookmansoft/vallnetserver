/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let CpFunding = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'CpFunding',
    {
        stock_num: Sequelize.INTEGER,
        total_amount: Sequelize.INTEGER,
        stock_amount: Sequelize.INTEGER,
        stock_rmb: Sequelize.INTEGER,
        audit_state_id: Sequelize.INTEGER,
        audit_text: Sequelize.STRING,
        modify_date: Sequelize.INTEGER,
        cp_name: Sequelize.STRING,
        cp_text: Sequelize.STRING,
        cp_type: Sequelize.STRING,
        cp_url: Sequelize.STRING,
        develop_name: Sequelize.STRING,
        develop_text: Sequelize.STRING,
        user_id: Sequelize.INTEGER,
        cid: Sequelize.STRING,
        operator_id:Sequelize.INTEGER,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'cp_funding',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.CpFunding = CpFunding;
