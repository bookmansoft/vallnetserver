let facade = require('gamecloud')
let {EntityType, IndexType} = facade.const
let BaseEntity = facade.BaseEntity
let {userwallet} = require('../table/userwallet')

//用户钱包地址
class userWalletEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: EntityType.userwallet,     //表类型
            model: userwallet,               //表映射类
            entity: userWalletEntity,        //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, item) {
        try{
            let it = await userwallet(db).create(item);
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
        return new userWalletEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await userwallet(db).findAll();
            ret.map(it=>{
                callback(it);
            });
        } catch(e) {
            console.error(e);
        }
    }

    //endregion

    /**
     * 索引值，用于配合Mapping类的索引/反向索引。
     * 
     * @note 集成Ranking接口时，也必须拥有此函数
     */
    IndexOf(type) {
        switch(type) {
            case IndexType.Domain:
                return `${this.orm.cid}.${this.orm.user_id}`;
            case IndexType.Foreign:
                return this.orm.addr;
            default:
                return this.orm.id;
        }
    }
}

exports = module.exports = userWalletEntity;
