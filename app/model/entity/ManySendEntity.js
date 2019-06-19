let facade = require('gamecloud');
let BaseEntity = facade.BaseEntity;
let {ManySend} = require('../table/manysend');
let tableType = require('../../util/tabletype');

//用户微信账号(uid)
class ManySendEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: tableType.manySend,                     //表类型
            model: ManySend,               //表映射类
            entity: ManySendEntity,        //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, total_amount,actual_amount,total_num,send_uid,send_nickname,send_headimg,wishing,modify_date,state_id) {
        try{
            let it = await ManySend(db).create({
                'total_amount': total_amount,
                'actual_amount': actual_amount,
                'total_num': total_num,
                'send_uid': send_uid,
                'send_nickname': send_nickname,
                'send_headimg': send_headimg,
                'wishing': wishing,
                'modify_date': modify_date,
                'state_id': state_id
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
        return new ManySendEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await ManySend(db).findAll();
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

exports = module.exports = ManySendEntity;
