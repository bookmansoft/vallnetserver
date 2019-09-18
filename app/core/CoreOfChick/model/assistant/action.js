let facade = require('gamecloud')
let {em_Effect_Comm} = facade.const

/**
 * 用户每日行为管理类，限制每日可执行次数限制
 */
class action extends facade.Assistants.Action {
    constructor(parent) {
        super(parent);
    }

    /**
     * 读取指定行为的额外执行次数
     * @param $_type
     * @return int|mixed
     */
    GetExtraNum($_type){
        let cur = 0;
        if(!!this.v.extNum){
            cur = !!this.v.extNum[$_type] ? this.v.extNum[$_type] : 0;
            if(this.isInterOperation($_type) == em_Effect_Comm.InterOperation){
                cur = this.parent.effect().CalcFinallyValue(em_Effect_Comm.InterOperation, cur);
            }
        }
        return cur;
    }

    /**
     * 获取互动行为的类型
     * @param {*}  
     */
    isInterOperation($_type) {
        let ActionExecuteType = this.parent.core.const.ActionExecuteType;

        switch($_type){
            case ActionExecuteType.slaveAvenge:
            case ActionExecuteType.slaveCommend:
            case ActionExecuteType.slaveFlattery:
            case ActionExecuteType.slaveFood:
            case ActionExecuteType.slaveLash:
                return em_Effect_Comm.InterOperation;

            default:
                return em_Effect_Comm.None;
        }
    }
}

exports = module.exports = action;