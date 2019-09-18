let facade = require('gamecloud');
let BaseUserEntity = facade.BaseUserEntity
let {em_UserVipLevel, UserVipLevelSetting} = facade.const

/**
 * 用户角色类，继承自框架的 BaseUserEntity
 */
class UserEntity extends BaseUserEntity
{
	constructor(user, core) {
        super(user, core);
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
