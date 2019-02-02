/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let UserProfile = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'UserProfile',
    {
        uid: Sequelize.INTEGER,
        nick: Sequelize.STRING,
        phone: Sequelize.STRING,
        email: Sequelize.STRING,
        gender: Sequelize.STRING,
        birth: Sequelize.STRING,
        country: Sequelize.STRING,
        province: Sequelize.STRING,
        city: Sequelize.STRING,
        prop_count: Sequelize.INTEGER,
        current_prop_count: Sequelize.INTEGER,
        block_addr: Sequelize.STRING,
        nlevel: Sequelize.INTEGER,
        avatar: Sequelize.INTEGER,
        ranking: Sequelize.INTEGER,
        wxopenid: Sequelize.STRING, 
        star_level: Sequelize.INTEGER,
        down_count: Sequelize.INTEGER,
        game_count: Sequelize.INTEGER,
        follow_count: Sequelize.INTEGER,
        no_reading_msg_count: Sequelize.INTEGER,
        comment_count: Sequelize.INTEGER,
        buy_count: Sequelize.INTEGER,
        games: Sequelize.STRING,
        avatar_uri: Sequelize.STRING,
        desc: Sequelize.STRING,
        unionid: Sequelize.STRING,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_user_profile',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.UserProfile = UserProfile;
