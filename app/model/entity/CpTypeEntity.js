let facade = require('gamecloud');
let BaseEntity = facade.BaseEntity
let {CpType} = require('../table/CpType.js')
const tableType = require('../../util/tabletype')

class CpTypeEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: tableType.cpType,          //表类型
            model: CpType,                    //表映射类
            entity: CpTypeEntity,             //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, cp_type_id,cp_type_name) {
        try{
            let it = await CpType(db).create({
                'cp_type_id': cp_type_id,
                'cp_type_name': cp_type_name,
            });
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
        return new CpTypeEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await CpType(db).findAll();
            ret.map(it=>{
                callback(it);
            });
        } catch(e) {}
    }

    //endregion

    /**
     * 记录更新函数，可省略而直接使用基类方法(调用 this.Save() 直接写数据库)
     */
    onUpdate() {
        //抛出更新事件，可以将短时间内的频繁更新合并为单条数据库写
        this.core.notifyEvent('CpType.update', {CpType:this})
    }
}

exports = module.exports = CpTypeEntity;
