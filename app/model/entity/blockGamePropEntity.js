let facade = require('gamecloud');
let {TableType} = facade.const;
let BaseEntity = facade.BaseEntity;
let blockgameprop = facade.models.blockgameprop;

//游戏道具
class blockGamePropEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: TableType.blockgameprop,                     //表类型
            model: blockgameprop,               //表映射类
            entity: blockGamePropEntity,        //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, item) {
        try{
            let it = await blockgameprop(db).create(item);
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
        return new blockGamePropEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await blockgameprop(db).findAll();
            ret.map(it=>{
                callback(it);
            });
        } catch(e) {
            console.error(e);
        }
    }

    //endregion

    /**
     * 记录更新函数，可省略而直接使用基类方法(调用 this.Save() 直接写数据库)
     */
    onUpdate() {
        //抛出更新事件，可以将短时间内的频繁更新合并为单条数据库写
        //this.core.notifyEvent('blockuser.update', {test:this})
    }
}

exports = module.exports = blockGamePropEntity;
