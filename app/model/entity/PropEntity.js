let facade = require('gamecloud');
let BaseEntity = facade.BaseEntity
let { Prop } = require('../table/Prop.js')
let tableType = require('../../util/tabletype')

class PropEntity extends BaseEntity {
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: tableType.propEntity,    //表类型
            model: Prop,                    //表映射类
            entity: PropEntity,             //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(props_id, propsName, propsType, cid, propsDesc, iconUrl,
        iconPreview, status, props_price, props_rank, propsAt, createdAt, updatedAt) {
        try {
            let it = await Prop().create({
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
    static onMapping(record) {
        return new PropEntity(record, facade.current);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} sa 
     * @param {*} pwd 
     * @param {*} callback 
     */
    static async onLoad(db, sa, pwd, callback) {
        db = db || facade.current.options.mysql.db;
        sa = sa || facade.current.options.mysql.sa;
        pwd = pwd || facade.current.options.mysql.pwd;

        try {
            let ret = await Prop(db, sa, pwd).findAll();
            ret.map(it => {
                callback(it);
            });
        } catch (e) { }
    }

    //endregion

    /**
     * 记录更新函数，可省略而直接使用基类方法(调用 this.Save() 直接写数据库)
     */
    onUpdate() {
        //抛出更新事件，可以将短时间内的频繁更新合并为单条数据库写
        //facade.current.notifyEvent('Prop.update', { Prop: this })
        this.Save();
    }
}

exports = module.exports = PropEntity;
