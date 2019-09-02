/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let blockgame = (db) => seqconn.seqConnector(db.db, db.sa, db.pwd, db.host, db.port).define(
    'blockgame',
    {
        game_title: Sequelize.STRING,
        game_resource_uri: Sequelize.STRING,
        small_img_url: Sequelize.STRING,
        game_ico_uri: Sequelize.STRING,
        game_link_url: Sequelize.STRING,
        game_desc: Sequelize.STRING,
        sort: Sequelize.INTEGER,
        category_id: Sequelize.INTEGER,
        category_title: Sequelize.STRING,
        provider_id: Sequelize.INTEGER,
        provider_name: Sequelize.STRING,
        ad_title: Sequelize.STRING,
        ranking: Sequelize.INTEGER,
        star_level: Sequelize.INTEGER,
        down_count: Sequelize.INTEGER,
        comment_count: Sequelize.INTEGER,
        create_time: Sequelize.INTEGER,
        update_time: Sequelize.INTEGER,
        store_status: Sequelize.INTEGER,
        game_version: Sequelize.STRING,
        developer: Sequelize.STRING,
        update_desc: Sequelize.STRING,
        game_screenshots: Sequelize.STRING,
        player_count: Sequelize.INTEGER,
        cpid: Sequelize.STRING,
        cpurl: Sequelize.STRING,
        cp_addr: Sequelize.STRING,
        cp_name: Sequelize.STRING,
        stock_price: Sequelize.INTEGER,
        stock_sum: Sequelize.INTEGER,
        grate: Sequelize.INTEGER,
        hHeight: Sequelize.INTEGER,
        hBonus: Sequelize.INTEGER,
        hAds: Sequelize.INTEGER,
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_games',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.blockgame = blockgame;
