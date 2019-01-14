/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let Vip = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'VipDraw',
    {
        uid: Sequelize.INTEGER,
        is_expired: Sequelize.INTEGER,
        vip_level: Sequelize.INTEGER,
        vip_start_time: Sequelize.INTEGER,
        vip_end_time: Sequelize.INTEGER,
        vip_last_get_time: Sequelize.INTEGER,
        vip_last_get_count: Sequelize.INTEGER,
        vip_usable_count: Sequelize.INTEGER,
        create_at: Sequelize.INTEGER,
        update_at: Sequelize.INTEGER
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_vip',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.Vip = Vip;
