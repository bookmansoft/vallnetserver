let facade = require('gamecloud');
let {TableType, TableField} = facade.const;
const stringRandom = require('string-random');
let wechatcfg = facade.ini.servers["Index"][1].wechat; //全节点配置信息

/**
 * 管理后台
 */
class manage extends facade.Control
{
    //活动列表
    async RedPackActCurrent(user, params) {
        let redpackActList = await this.core.GetMapping(TableType.redpackact).groupOf().where([['status', '==', 1]]).records(TableField.redpackact)
        if(redpackActList.length >0 ) {
            let redPacetAct = redpackActList[0];
            return {code: 0, data: redPacetAct};
        }
        return {code: -1, msg: '无红包活动'};
    }

    //用户红包汇中
    async UserRedPackAct(user, params) {
        let uid = user.id;
        let act_id = params.act_id;
        let userRedPactActs = await this.core.GetMapping(TableType.userredpackact).groupOf()
            .where([
                ['uid', '==', uid],
                ['act_id', '==', act_id]
            ]).records(TableField.userredpackact);
        
        if(userRedPactActs.length > 0 ) {
            return {code: 0, data: userRedPactActs[0]};
        }
        return {code: -1, msg: '未参与红包活动'};
    }

    //用户红包记录
    async UserRedPack(user, params) {
        let uid = user.id
        let act_id = params.act_id
        let userRedPacts = await this.core.GetMapping(TableType.userredpack).groupOf()
            .where([
                ['uid', '==', uid],
                ['act_id', '==', act_id]
            ]).records(TableField.userRedpack)
        
        if(userRedPacts.length >0 ) {
            return {code: 0, data: userRedPacts};
        }
        return {code: -1, msg: '无红包参与记录'};
    }

    //用户抽中红包
    async UserRedPackAdd(user, params)  {
        let uid = user.id
        let act_id = params.act_id
        let act_name = params.act_name
        let gamegold = params.gamegold
        let amount = params.amount

        let redpackAct = this.core.GetObject(TableType.redpackact, act_id); 
        if(!!!redpackAct ) {
            return {code: -1, msg: '无红包活动'};
        }

        let current_time = parseInt(new Date().getTime() / 1000)

        let userRedpackItem = {
            uid: uid,
            act_id: act_id,
            act_name: act_name,
            gamegold: gamegold,
            amount: amount,
            act_at: current_time,
            cid: redpackAct.orm.cid,
            status: 0
        }
        await this.core.GetMapping(TableType.userredpack).Create(userRedpackItem)

        let userRedPactActs = await this.core.GetMapping(TableType.userredpackact).groupOf()
        .where([
            ['uid', '==', uid],
            ['act_id', '==', act_id]
        ]).records()

        if(userRedPactActs.length >0 ) {
            let userRedPactAct = userRedPactActs[0]
            userRedPactAct.setAttr('act_count', userRedPactAct.orm.act_count+1);
            userRedPactAct.setAttr('amount_all', userRedPactAct.orm.amount_all+amount);
            userRedPactAct.setAttr('last_act_at', current_time);
        } else {
            let userRedpackActItem = {
                uid: uid,
                act_id: act_id,
                act_name: act_name,
                act_count: 1,
                amount_all: amount,
                last_act_at: current_time
            }
            await this.core.GetMapping(TableType.userredpackact).Create(userRedpackActItem)
        }

        return {code: 0};
        
    };

    //用户红包发送
    async UserRedPackSend(user, params)  {
        let id = params.id
        let uid = user.id
        let act_id = params.act_id
        let openid = params.openid
        let userRedPact = this.core.GetObject(TableType.userredpack, id);     //根据上行id查找userRedPact表中记录
        if( !!userRedPact ) {
            if(userRedPact.orm.status != 0) {
                return {code: -1, msg: '红包已领取'};
            }

            let cid = userRedPact.orm.cid;
            let sn = stringRandom(32)

            userRedPact.setAttr('status', 1)
            userRedPact.setAttr('order_sn', sn)
            userRedPact.setAttr('cid', cid)

            //发送游戏金
            await this.core.service.gamegoldHelper.orderPay(cid, uid, sn, userRedPact.orm.gamegold, uid);
            return {code: 0};
        } else {
            return {code: -1};
        }
    };
}

exports = module.exports = manage;
