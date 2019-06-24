let facade = require('gamecloud')
let {RankType, EntityType, ReturnCode} = facade.const
let UserEntity = facade.entities.UserEntity

/**
 * 排行榜控制器
 */
class rank extends facade.Control
{
    /**
     * 获取总榜信息
     * @param user
     * @param objData
     * @returns {Promise.<*>}
     */
    async 9000(user, objData){
        let dt = {
            rank: this.core.GetRanking(UserEntity).result(user.id, RankType.total).rank,
            list: this.core.GetRanking(UserEntity).list(RankType.total),
        }
        return {code:ReturnCode.Success, data:dt};
    }

    /**
     * 获取每日排行榜
     * @param {UserEntity} user
     * @param objData
     * @returns {Promise.<{code: number, data: {}}>}
     */
    async 9001(user, objData){
        return {code:ReturnCode.Success, data:{
            rank: this.core.GetRanking(UserEntity).result(user.id, RankType.daily).rank,
            list: this.core.GetRanking(UserEntity).list(RankType.daily),
        }};
    }

    /**
     * 获取好友排行榜
     * @param {UserEntity} user
     * @param objData
     * @returns {Promise.<{code: number, data: {}}>}
     */
    async 9002(user, objData){
        try{
            let list = await user.getTxFriendMgr().refreshSocialNetwork();
            if(list.length > 0){
                return {code: ReturnCode.Success, data:{list: this.core.GetRanking(UserEntity).Init(RankType.friend).list(RankType.friend)}};
            }
            else{
                return {code: ReturnCode.Success, data:{list: []}};
            }
        }catch(e){}
    }
    
    /**
     * 获取好友排行榜
     * @param user
     * @param objData
     * @returns {Promise.<*>}
     */
    async 9003(user, objData){
        return this.core.GetRankInfo(UserEntity, user.id, RankType.friend);
    }

    /**
     * 获取活动排行信息
     */
    async 9005(user){
        return this.core.service.activity.getList(user);
    }

    /**
     * 获取排行榜信息
     * @param {UserEntity} user
     * @param rType
     * @param id
     * @returns {{code: number, data: {}}}
     * @constructor
     */
    GetRankData(user, objData, rType = RankType.total) {
        let ret = {code: ReturnCode.Success, data:{}};

        ret.data.list = this.core.GetRanking(UserEntity).list(rType);

        for(let item of ret.data.list){
            /**
             * @type {UserEntity}
             */
            let usr = this.core.GetObject(EntityType.User, item.id);
            if(!!usr){
                item.icon = usr.getInfoMgr().GetHeadIcon();
            }
        }

        ret.data.rank = this.core.GetRankInfo(UserEntity, user.id, rType).rank;

        return ret;
    }
}

exports = module.exports = rank;
