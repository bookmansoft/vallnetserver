let facade = require('gamecloud');
let {EntityType, TableField} = facade.const;

/**
 * 游戏接口
 * Create by gamegold Fuzhou on 2018-11-27
 */
class comments extends facade.Control
{
    //评论列表
    async GameCommentList(user, params)  {
        let cid = params.cid
        let dataList = this.core.GetMapping(EntityType.blockgamecomment).groupOf()
            .where([['cid', '==', cid]])
            .records(TableField.blockgamecomment);

        return {code: 0, data:dataList};
    };

    //添加评论
    async GameCommentAdd(user, params)  {
        let current_time = parseInt(new Date().getTime() / 1000)
        let commentItem = {
            uid: user.id,
            cid: params.cid,
            reply_id: params.reply_id,
            nick: params.nick,
            avatar_url: params.avatar_url,
            title: params.title,
            content: params.content,
            ip: "",
            resp_count: 0,
            point_up_count: 0,
            create_at: current_time,
        };
        this.core.GetMapping(EntityType.blockgamecomment).Create(commentItem);
        return {code: 0};
    }
}

exports = module.exports = comments;
