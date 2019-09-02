let facade = require('gamecloud');
let {TableType} = facade.const;
let BaseEntity = facade.BaseEntity;
let {userredpackact} = require('../table/userredpackact')

//用户微信账号(openid)
class userRedPackActEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: TableType.userredpackact,                     //表类型
            model: userredpackact,               //表映射类
            entity: userRedPackActEntity,        //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, item) {
        try{
            let it = await userredpackact(db).create(item);
            await it.save();
    
            return it;
        }
        catch(e){
            console.error(e);
        }
        return null;
    }

    /**
     * 进行字典映射时的钩子函数
     * @param {*} record 
     */
    static onMapping(record, core) {
        return new userRedPackActEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await userredpackact(db).findAll();
            ret.map(it=>{
                callback(it);
            });
        } catch(e) {
            console.error(e);
        }
    }

    //endregion
}

exports = module.exports = userRedPackActEntity;
