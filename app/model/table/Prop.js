/*
 * @Author: jinghh 
 * @Date: 2018-11-26 23:07:21 
 * @Last Modified by: jinghh
 * @Last Modified time: 2018-12-20 16:20:40
 */
const facade = require('gamecloud');
let { Sequelize, seqconn } = facade.tools;

//建立数据库ORM模型
let Prop = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'Prop',
    {
        'props_id': Sequelize.STRING,
        'props_name': Sequelize.STRING,
        'props_type': Sequelize.STRING,
        'cid': Sequelize.STRING,
        'props_desc': Sequelize.TEXT,
        'icon_url': Sequelize.STRING,
        'icon_preview': Sequelize.TEXT,
        'status': Sequelize.INTEGER,
        'props_price': Sequelize.INTEGER,
        'props_rank': Sequelize.STRING,
        'propsAt': Sequelize.DATE,
        'createdAt': Sequelize.DATE,
        'updatedAt': Sequelize.DATE,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'prop',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.Prop = Prop;

