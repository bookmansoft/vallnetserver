let facade = require('gamecloud');
let BaseUserEntity = facade.BaseUserEntity
let filelist = facade.config.filelist

/**
 * 用户角色类，继承自框架的UserBaseEntity
 */
class UserEntity extends BaseUserEntity
{
	constructor(user, core){
        super(user, core);

        filelist.mapPath('/app/model/assistant').map(srv=>{
            let srvObj = require(srv.path);
            this.baseMgr[srv.name.split('.')[0]] = new srvObj(this);
        });
    }
}

exports = module.exports = UserEntity
