let facade = require('gamecloud');
let BaseEntity = facade.BaseEntity;
let {CpProp} = require('../table/cpprop');
let tableType = require('../../util/tabletype');

//道具库
class cpPropEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: tableType.cpProp,                     //表类型
            model: CpProp,               //表映射类
            entity: cpPropEntity,        //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, item) {
        try{
            let it = await CpProp(db).create(item);
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
        return new cpPropEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await CpProp(db).findAll();
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

    //user.destroy({'where':{'id':{eq:23}}});//将表内userId等于23的元组删除
    static async onDestroy(options) {
        try{
            let it = await CpProp().destroy(options);
            return it;
        }
        catch(e){
            console.error(e);
        }
        return null;    
    }
}

exports = module.exports = cpPropEntity;
