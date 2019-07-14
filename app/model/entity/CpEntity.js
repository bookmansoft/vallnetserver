let facade = require('gamecloud');
let {IndexType, TableType} = facade.const;
let BaseEntity = facade.BaseEntity
let Cp = facade.models.Cp

class CpEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: TableType.Cp,          //表类型
            model: Cp,                    //表映射类
            entity: CpEntity,             //ORM映射类
        };
    }

    /**
     * 索引值，用于配合Mapping类的索引/反向索引。
     * 
     * @note 集成Ranking接口时，也必须拥有此函数
     */
    IndexOf(type){
        switch(type){
            case IndexType.Foreign:
                return this.orm.cp_id;
            default:
                return this.orm.id;
        }
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, cp_id,cp_name,cp_text,cp_url,wallet_addr,cp_type,develop_name,
        cp_desc,cp_version,picture_url,cp_state,publish_time,update_time,update_content,invite_share,operator_id) {
        try{
            let it = await Cp(db).create({
                'cp_id': cp_id,
                'cp_name': cp_name,
                'cp_text': cp_text,
                'cp_url': cp_url,
                'wallet_addr': wallet_addr,
                'cp_type': cp_type,
                'develop_name': develop_name,
                'cp_desc': cp_desc,
                'cp_version': cp_version,
                'picture_url': picture_url,
                'cp_state': cp_state,
                'publish_time': publish_time,
                'update_time': update_time,
                'update_content': update_content,
                'invite_share':invite_share,
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
        return new CpEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await Cp(db).findAll();
            ret.map(it=>{
                callback(it);
            });
        } catch(e) {}
    }

    //endregion
}

exports = module.exports = CpEntity;
