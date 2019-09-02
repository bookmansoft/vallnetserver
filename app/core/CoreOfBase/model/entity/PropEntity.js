let facade = require('gamecloud')
let {TableType} = facade.const
let BaseEntity = facade.BaseEntity
let {Prop} = require('../table/Prop')

class PropEntity extends BaseEntity {
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: TableType.Prop,          //表类型
            model: Prop,                    //表映射类
            entity: PropEntity,             //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, props_id, propsName, propsType, cid, propsDesc, iconUrl,
        iconPreview, status, props_price, props_rank, propsAt, createdAt, updatedAt) {
        try {
            let it = await Prop(db).create({
                'props_id': props_id,
                'props_name': propsName,
                'props_type': propsType,
                'cid': cid,
                'props_desc': propsDesc,
                'icon_url': iconUrl,
                'icon_preview': iconPreview,
                'status': status,
                'props_price': props_price,
                'props_rank': props_rank,
                'propsAt': propsAt,
                'createdAt': createdAt,
                'updatedAt': updatedAt,
            });
            await it.save();

            return it;
        }
        catch (e) {
            console.error(e);
        }
        return null;
    }

    /**
     * 进行字典映射时的钩子函数
     * @param {*} record 
     */
    static onMapping(record, core) {
        return new PropEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback) {
        try {
            let ret = await Prop(db).findAll();
            ret.map(it => {
                callback(it);
            });
        } catch (e) { }
    }

    //endregion
}

exports = module.exports = PropEntity;
