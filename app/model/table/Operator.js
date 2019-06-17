/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let Operator = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'Operator',
    {
        login_name: Sequelize.STRING,
        password: Sequelize.STRING,
        cid: Sequelize.STRING,
        token: Sequelize.STRING,
        state:Sequelize.INTEGER,
        remark: Sequelize.STRING,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'operator',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.Operator = Operator;
