let facade = require('gamecloud');
let BaseUserEntity = facade.BaseUserEntity
let {ResType, em_Effect_Comm, em_Condition_Type,em_Condition_Checkmode} = facade.const
let LargeNumberCalculator = facade.Util.LargeNumberCalculator
let randomEvent =  require('../assistant/randomEvent')
let tollgate =  require('../assistant/tollgate')

/**
 * 用户角色类，继承自框架的 BaseUserEntity
 */
class UserEntity extends BaseUserEntity
{
	constructor(user, core) {
        super(user, core);
    }

    /**
     * all events happened on exploring
     * @return {randomEvent}
     */
    getEventMgr() {
        return this.baseMgr.randomEvent;
    }

    /**
     * @return {tollgate}
     */
    getTollgateMgr() {
        return this.baseMgr.tollgate;
    }
    /**
     * 获取当前战力
     * @return {LargeNumberCalculator}
     */
    getPower() {
        let $ret = this.getPotentialMgr().getPower();
        //添加图腾对圣光加成的加持
        $ret = $ret.CalcFinallyValue(this.effect(), [em_Effect_Comm.PotentialEffect]);
        //添加科技对战力的加持
        $ret = $ret.CalcFinallyValue(this.effect(), [em_Effect_Comm.Attack, em_Effect_Comm.AttackAndClick]);
        //添加宠物科技的影响：和转生正相关的攻击加成
        $ret = $ret._mul_(1 + this.effect().CalcFinallyValue(em_Effect_Comm.AttackForPveRevival, 0) * this.getTollgateMgr().revivalNum);
        //添加内丹（英魂）对战力的加持
        $ret = $ret._mul_(1 + this.effect().CalcFinallyValue(em_Effect_Comm.StoneEffect, this.getPocket().GetRes(ResType.StoneHero)*(0.1 + 0.005*this.getTollgateMgr().revivalNum)));
        // //检测战力等级：战力等级为战力指数/10
        // this.core.notifyEvent('user.task', {user:this, data:{type:em_Condition_Type.level, value:($ret.power/10)|0, mode:em_Condition_Checkmode.absolute}});
        //检测战力等级：战力等级为战力指数
        this.core.notifyEvent('user.task', {user:this, data:{type:em_Condition_Type.level, value:$ret.power|0, mode:em_Condition_Checkmode.absolute}});
        return $ret;
    }
    /**
     * @return {LargeNumberCalculator}
     */
    getClickPower() {
        let $ef = this.effect();
        let $eo = $ef[em_Effect_Comm.ConvertPveToClick];
        let $ret = this.getPotentialMgr().getClickPower();    //宠物带来的点击攻击力
        if($eo){
            //加上PVE伙伴攻击力转换为点击攻击力部分
            ret._add_(this.getPotentialMgr().getPower()._mul_($eo.value));
        }
        $ret.CalcFinallyValue($ef, [em_Effect_Comm.AttackForClick, em_Effect_Comm.AttackAndClick]); //再叠加外围的科技加成效果
        return $ret;
    }
}

exports = module.exports = UserEntity
