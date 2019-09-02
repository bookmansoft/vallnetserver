let facade = require('gamecloud');
let {TableType, IndexType} = facade.const;
let BaseEntity = facade.BaseEntity;
let {blockgame} = require('../table/blockgame')

//区块链游戏库
class blockGameEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: TableType.blockgame,                     //表类型
            model: blockgame,               //表映射类
            entity: blockGameEntity,        //ORM映射类
        };
    }

    IndexOf(type){
        switch(type){
            case IndexType.Domain:
                return this.orm.cpid;
            default:
                return this.orm.id;
        }
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, item) {
        try{
            let it = await blockgame(db).create(item);
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
        return new blockGameEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await blockgame(db).findAll();
            ret.map(it=>{
                callback(it);
            });
        } catch(e) {
            console.error(e);
        }
    }

    //endregion
}

exports = module.exports = blockGameEntity;
