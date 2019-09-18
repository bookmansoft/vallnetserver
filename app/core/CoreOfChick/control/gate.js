let facade = require('gamecloud')

/**
 * 关卡管理器
 * Updated by liub on 2017-05-28.
 */
class gate extends facade.Control {
    /**
     * 查询关卡历史信息
     * @param user
     * @param objData
     */
    async query(user, objData){
        return user.baseMgr.vip.doSomething({oper: this.core.const.OperEnum.Require});
    }

    /**
     * 开始一个关卡任务
     * @param user
     * @param objData
     */
    async start(user, objData)  {
        return user.baseMgr.vip.doSomething({oper: this.core.const.OperEnum.Start, id:objData.id});
    }

    /**
     * 扫荡
     * @param user
     * @param objDataa
     * @returns {Promise.<*>}
     */
    async sweep(user, objData){
        return user.baseMgr.vip.doSomething({oper: this.core.const.OperEnum.Sweep, id:objData.id});
    }

    async getSweepBonus(user, objData){
        return user.baseMgr.vip.doSomething({oper: this.core.const.OperEnum.SweepBonus});
    }

    /**
     * 查询、计算并下发体力值
     * @param user
     * @param objData
     * @returns {Promise.<void>}
     */
    async checkAction(user, objData){
        user.baseMgr.item.AutoAddAP();//刷新体力
    }

    /**
     * 结束一个关卡任务
     * @param user
     * @param input
     */
    async end(user, input){
        input.victoryaction = input.victoryaction || 0;
        if(typeof input.victoryaction == 'string'){
            input.victoryaction = parseInt(input.victoryaction);
        }

        return user.baseMgr.vip.doSomething({
            oper: this.core.const.OperEnum.PassTollgate,
            id: input.id,
            blood: (typeof input.blood == "string") ? parseInt(input.blood) : input.blood,
            money: (typeof input.money == "string") ? parseInt(input.money) : input.money,
            score: (typeof input.score == "string") ? parseInt(input.score) : input.score,
            super: (typeof input.super == "string") ? parseInt(input.super) : input.super,
            moneyRate: !!input.moneyrate ? Math.min(1, input.moneyrate) : 0,     //金币加成
            scoreRate: !!input.scorerate ? Math.min(1, input.scorerate) : 0,     //分数加成
            bonusRate: !!input.bonusrate ? Math.min(0.3, input.bonusrate) : 0,   //奖励掉落加成
            action: Math.min(1, input.victoryaction),     //胜利恢复体力值
        });
    }

    async startCatch(user, objData)  {
        return user.baseMgr.vip.doSomething({oper: this.core.const.OperEnum.StartCatch, id:objData.id});
    }

    async startEscape(user, objData)  {
        return user.baseMgr.vip.doSomething({oper: this.core.const.OperEnum.StartEscape, id:objData.id});
    }

    /**
     * 结束一个抓捕任务
     * @param user
     * @param objData
     */
    async catch(user, objData){
        return user.baseMgr.vip.doSomething({
            oper: this.core.const.OperEnum.Catch,
            id: objData.id,
            blood: (typeof objData.blood == "string") ? parseInt(objData.blood) : objData.blood,
        });
    }

    /**
     * 结束一个起义任务
     * @param user
     * @param objData
     */
    async escape(user, objData){
        return user.baseMgr.vip.doSomething({
            oper: this.core.const.OperEnum.Escape,
            id: objData.id,
            blood: (typeof objData.blood == "string") ? parseInt(objData.blood) : objData.blood,
        });
    }
}

exports = module.exports = gate;
