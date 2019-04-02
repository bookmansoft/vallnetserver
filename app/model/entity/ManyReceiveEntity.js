let facade = require('gamecloud');
let BaseEntity = facade.BaseEntity;
let {ManyReceive} = require('../table/manyreceive');
let tableType = require('../../util/tabletype');

//用户微信账号(openid)
class ManyReceiveEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: tableType.manyReceive,                     //表类型
            model: ManyReceive,               //表映射类
            entity: ManyReceiveEntity,        //ORM映射类
        };
    }

    static async onCreate(send_id,receive_amount,send_openid,send_nickname,send_headimg,receive_openid,receive_nickname,receive_headimg,modify_date) {
        try{
            console.log(24);
            let it = await ManyReceive().create({
                'send_id': send_id,
                'receive_amount': receive_amount,
                'send_openid': send_openid,
                'send_nickname': send_nickname,
                'send_headimg': send_headimg,
                'receive_openid': receive_openid,
                'receive_nickname': receive_nickname,
                'receive_headimg': receive_headimg,
                'modify_date': modify_date,
            });
            await it.save();
            console.log(37);
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
    static onMapping(record){
        return new ManyReceiveEntity(record, facade.current);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} sa 
     * @param {*} pwd 
     * @param {*} callback 
     */
    static async onLoad(db, sa, pwd, callback){
        db = db || facade.current.options.mysql.db;
        sa = sa || facade.current.options.mysql.sa;
        pwd = pwd || facade.current.options.mysql.pwd;

        try {
            let ret = await ManyReceive(db, sa, pwd).findAll();
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
        //facade.current.notifyEvent('blockuser.update', {test:this})
    }
}

exports = module.exports = ManyReceiveEntity;
