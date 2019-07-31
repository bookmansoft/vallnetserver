let facade = require('gamecloud');
let {TableType, IndexType} = facade.const;
let BaseEntity = facade.BaseEntity
let StockBase = facade.models.StockBase

class StockBaseEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: TableType.StockBase,          //表类型
            model: StockBase,                    //表映射类
            entity: StockBaseEntity,             //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, item) {
        try{
            let it = await StockBase(db).create(item);
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
        return new StockBaseEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await StockBase(db).findAll();
            ret.map(it=>{
                callback(it);
            });
        } catch(e) {}
    }

    //endregion
}

exports = module.exports = StockBaseEntity;
