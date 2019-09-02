let facade = require('gamecloud')
let {TableType} = facade.const
let BaseEntity = facade.BaseEntity
let {Prize} = require('../table/Prize')

class PrizeEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: TableType.Prize,          //表类型
            model: Prize,                    //表映射类
            entity: PrizeEntity,             //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, act_name,mch_billno,nick_name,re_openid,remark,send_name,total_amount,total_num,wishing,return_msg,order_status) {
        try{
            let it = await Prize(db).create({
                'act_name': act_name,
                'mch_billno': mch_billno,
                'nick_name': nick_name,
                're_openid': re_openid,
                'remark': remark,
                'send_name': send_name,
                'total_amount': total_amount,
                'total_num': total_num,
                'wishing': wishing,
                'return_msg': return_msg,
                'order_status': order_status,
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
        return new PrizeEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await Prize(db).findAll();
            ret.map(it=>{
                callback(it);
            });
        } catch(e) {}
    }

    //endregion
}

exports = module.exports = PrizeEntity;
