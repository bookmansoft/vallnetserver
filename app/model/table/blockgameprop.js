/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

/**
 * CP可售道具列表，从CP标准接口定期拉取刷新
 * @param {*} db 
 */
let blockgameprop = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'blockgameprop',
    {
        cpid: Sequelize.STRING,
        prop_id: Sequelize.INTEGER,
        oid: Sequelize.INTEGER,
        prop_name: Sequelize.STRING,
        icon_small: Sequelize.STRING,
        icon_large: Sequelize.STRING,
        prop_info: Sequelize.STRING,
        create_time: Sequelize.INTEGER,
        prop_price: Sequelize.INTEGER,
        prop_value: Sequelize.INTEGER,
        nstatus: Sequelize.INTEGER
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_game_prop',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.blockgameprop = blockgameprop;
