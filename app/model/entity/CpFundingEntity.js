let facade = require('gamecloud');
let {TableType} = facade.const;
let BaseEntity = facade.BaseEntity
let CpFunding = facade.models.CpFunding;

class CpFundingEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: TableType.CpFunding,          //表类型
            model: CpFunding,                    //表映射类
            entity: CpFundingEntity,             //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, stock_num,total_amount,stock_amount,stock_rmb,audit_state_id,audit_text,modify_date,
        cp_name,cp_text,cp_type,cp_url,develop_name,develop_text,user_id,cid,operator_id) {
        try{
            // console.log(26,cp_name);
            let it = await CpFunding(db).create({
                'stock_num': stock_num,
                'total_amount': total_amount,
                'stock_amount': stock_amount,
                'stock_rmb': stock_rmb,
                'audit_state_id': audit_state_id,
                'audit_text': audit_text,
                'modify_date': modify_date,
                'cp_name': cp_name,
                'cp_text': cp_text,
                'cp_type': cp_type,
                'cp_url': cp_url,
                'develop_name': develop_name,
                'develop_text': develop_text,
                'user_id': user_id,
                'cid':cid,
                'operator_id':operator_id,
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
    static onMapping(record, core){
        return new CpFundingEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await CpFunding(db).findAll();
            ret.map(it=>{
                callback(it);
            });
        } catch(e) {}
    }

    //endregion
}

exports = module.exports = CpFundingEntity;
