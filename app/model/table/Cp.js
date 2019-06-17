/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let Cp = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'Cp',
    {
        cp_id: Sequelize.STRING,
        cp_name: Sequelize.STRING,
        cp_text: Sequelize.STRING,
        cp_url: Sequelize.STRING,
        wallet_addr: Sequelize.STRING,
        cp_type: Sequelize.STRING,
        develop_name: Sequelize.STRING,
        cp_desc: Sequelize.STRING,
        cp_version: Sequelize.STRING,
        picture_url: Sequelize.STRING,
        cp_state: Sequelize.INTEGER,
        publish_time: Sequelize.INTEGER,
        update_time: Sequelize.INTEGER,
        update_content: Sequelize.STRING,
        invite_share: Sequelize.INTEGER,
        operator_id: Sequelize.INTEGER,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'cp',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.Cp = Cp;
