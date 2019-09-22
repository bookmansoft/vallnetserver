let facade = require('gamecloud');
let BaseUserEntity = facade.BaseUserEntity
let {IndexType, em_UserVipLevel, UserVipLevelSetting} = facade.const

/**
 * 用户角色类，继承自框架的 BaseUserEntity
 */
class UserEntity extends BaseUserEntity
{
	constructor(user, core) {
        super(user, core);
    }

    /**
     * 固定时间间隔的滴答操作，由底层自动调用
     */
    tick() {
        this.baseMgr.vip.checkSweep(); //检测扫荡是否结束，如果结束则自动计算奖励
        this.baseMgr.slave.CheckStatus(); //释放到期奴隶，或者解放自身
    }

    /**
     * 索引值，用于配合Mapping类的索引/反向索引。
     * @note 集成Ranking接口时，也必须拥有此函数
     */
    IndexOf(type){
        switch(type){
            case IndexType.Domain:
                return this.domainId;
            case IndexType.Account:
                return this.account;
            case IndexType.Name:
                return this.name;
            case IndexType.Foreign:
                return this.openid;
            case IndexType.Phone:
                return this.baseMgr.info.getAttr('phone');
            default:
                return this.orm.id;
        }
    }

    /**
     * 根据用户经验返回相应的VIP等级
     */
    static GetVipLevel($exp) {
        let $ret = em_UserVipLevel.Normal;
        for(let $key in UserVipLevelSetting){
            if($exp >= UserVipLevelSetting[$key]){
                $ret = $key;
                continue;
            }
            else{
                break;
            }
        }
        return $ret;
    }
}

exports = module.exports = UserEntity
