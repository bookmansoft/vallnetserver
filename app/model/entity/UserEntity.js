let facade = require('gamecloud');
let BaseUserEntity = facade.BaseUserEntity
let {IndexType} = facade.const

/**
 * 用户角色类，继承自框架的 BaseUserEntity
 */
class UserEntity extends BaseUserEntity
{
	constructor(user, core) {
        super(user, core);
    }

    /**
     * 索引值，用于配合Mapping类的索引/反向索引。
     * 
     * @note 集成Ranking接口时，也必须拥有此函数
     */
    IndexOf(type){
        switch(type){
            case IndexType.Domain:
                return this.domainId;
            case IndexType.Name:
                return this.name;
            case IndexType.Foreign:
                return this.openid;
            case IndexType.Phone:
                return this.baseMgr.info.getAttr('phone');
            case IndexType.Terminal:
                return this.baseMgr.info.getAttr('cid');
            default:
                return this.orm.id;
        }
    }
}

exports = module.exports = UserEntity
