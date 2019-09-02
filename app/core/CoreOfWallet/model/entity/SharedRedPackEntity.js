let facade = require('gamecloud')
let {TableType} = facade.const
let BaseEntity = facade.BaseEntity
let {sharedredpack} = require('../table/sharedredpack')

class SharedRedPackEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: TableType.sharedredpack,     //表类型
            model: sharedredpack,               //表映射类
            entity: SharedRedPackEntity,        //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, item) {
        try {
            let it = await sharedredpack(db).create({
                'total_amount': item.total_amount,
                'total_num': item.total_num,
                'send_uid': item.send_uid,
                'wishing': item.wishing,
                'modify_date': item.modify_date,
                'state_id': item.state_id
            });
            await it.save();
    
            return it;
        } catch(e) {
            console.error(e);
        }
        return null;
    }

    /**
     * 进行字典映射时的钩子函数
     * @param {*} record 
     */
    static onMapping(record, core) {
        return new SharedRedPackEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await sharedredpack(db).findAll();
            ret.map(it=>{
                callback(it);
            });
        } catch(e) {
            console.error(e);
        }
    }

    //endregion
}

exports = module.exports = SharedRedPackEntity;
