let facade = require('gamecloud');
let {TableType} = facade.const;
let tableField = require('../../util/tablefield');

/**
 * 游戏接口
 * Create by gamegold Fuzhou on 2018-11-27
 */
class game extends facade.Control
{
    //游戏类别
    async GameCateList(user, params)  {
        let gamecateList = this.core.GetMapping(TableType.blockgamecate).groupOf().records(tableField.blockgamecate);
        return {code: 0, data: {length:gamecateList.length, data:gamecateList}};
    };

    //游戏列表
    async GameList(user, params)  {
        let gameList = this.core.GetMapping(TableType.blockgame).groupOf().records(tableField.blockgame);
        return {code: 0, data: {length:gameList.length, data:gameList}};
    }

    //所有游戏
    async GameAll(user, params)  {
        let gameList = this.core.GetMapping(TableType.blockgame).groupOf().records(tableField.blockgame);
        return {code: 0, data: {length:gameList.length, data:gameList}};
    }

    //游戏道具
    async GameProp(user, params) {
        let cpid = params.cpid;
        let gameProps = this.core.GetMapping(TableType.blockgameprop).groupOf().where([['cpid','==',cpid]]).records(tableField.blockgameprop);
        return {code: 0, data: {length:gameProps.length, data:gameProps}};
    }

    //游戏首页
    async GameHome(user, params) {
        let gameCates = this.core.GetMapping(TableType.blockgamecate).groupOf().records(tableField.blockgamecate);
        let hotGame = this.core.GetMapping(TableType.blockgame).groupOf().where([['player_count','>',1000]]).records(tableField.blockgame);
        let games = this.core.GetMapping(TableType.blockgame).groupOf().where([['store_status','==',1]]).records(tableField.blockgame);
        return {
            code: 0,
            data: {
                hotGame: hotGame.length>0 ? hotGame[0] : null, 
                gameCates: gameCates,
                games: games
            }, 
        };
    }

    //游戏详情
    async GameInfo(user, params) {
        let id = params.id;
        let gameInfo = this.core.GetObject(TableType.blockgame, id);
        return {code: 0, data: tableField.record(gameInfo, tableField.blockgame)};
    }
}

exports = module.exports = game;
