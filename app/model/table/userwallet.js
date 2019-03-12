/**
 * Created by Administrator on 2017-03-21.
 */

const facade = require('gamecloud');
let {Sequelize, seqconn} = facade.tools;

//建立数据库ORM模型
let UserWallet = (db, sa, pwd) => seqconn.seqConnector(db, sa, pwd).define(
    'UserWallet',
    {
        uid: Sequelize.INTEGER,
        cid: Sequelize.STRING,
        addr: Sequelize.STRING,
        user_id: Sequelize.STRING,
        account: Sequelize.STRING,
        mnemonic_word: Sequelize.STRING,
        wallet_service_uri: Sequelize.STRING,
        remaining_coin: Sequelize.INTEGER,
        gift: Sequelize.INTEGER,
        donate_count: Sequelize.INTEGER,
        buy_count: Sequelize.INTEGER
    },
    {
        'timestamps': false,    // 是否需要增加createdAt、updatedAt、deletedAt字段
        'tableName': 'our_block_user_wallet',    // 实际使用的表名
        'paranoid': false       // true表示删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    }
);
exports.UserWallet = UserWallet;
