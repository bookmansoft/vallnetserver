let facade = require('gamecloud');
let {TableType} = facade.const;
let BaseEntity = facade.BaseEntity;
let sharedredpack_receive = facade.models.sharedredpack_receive

class SharedRedPackReceiveEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: TableType.sharedredpack_receive,     //表类型
            model: sharedredpack_receive,               //表映射类
            entity: SharedRedPackReceiveEntity,         //ORM映射类
        };
    }

    static async onCreate(db, item) {
        try{
            let it = await sharedredpack_receive(db).create({
                'send_id': item.send_id,
                'receive_amount': item.receive_amount,
                'receive_uid': item.receive_uid,
                'modify_date': item.modify_date,
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
        return new SharedRedPackReceiveEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await sharedredpack_receive(db).findAll();
            ret.map(it=>{
                callback(it);
            });
        } catch(e) {
            console.error(e);
        }
    }

    //endregion
}

exports = module.exports = SharedRedPackReceiveEntity;
