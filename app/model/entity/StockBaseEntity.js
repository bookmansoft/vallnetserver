let facade = require('gamecloud');
let {TableType} = facade.const;
let BaseEntity = facade.BaseEntity
let StockBase = facade.models.StockBase

class StockBaseEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: TableType.StockBase,          //表类型
            model: StockBase,                    //表映射类
            entity: StockBaseEntity,             //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(db, cid,cp_name,cp_text,total_num,sell_stock_amount,sell_stock_num,base_amount,
        provider,history_text,now_sale) {
        try{
            let it = await StockBase(db).create({
                'cid':cid,
                'cp_name': cp_name,
                'cp_text': cp_text,
                'total_num': total_num,
                'sell_stock_amount': sell_stock_amount,
                'sell_stock_num': sell_stock_num,
                'base_amount': base_amount,

                'large_img_url': large_img_url,
                'small_img_url': small_img_url,
                'icon_url': icon_url,
                'pic_urls': pic_urls,
                'cp_desc': cp_desc,
                'funding_text': funding_text,
                'funding_project_text': funding_project_text,
                'stock_money': stock_money,
                'supply_people_num': supply_people_num,
                'supply_money': supply_money,
                'funding_residue_day': funding_residue_day,
                'funding_target_amount': funding_target_amount,
                'funding_done_amount': funding_done_amount,
                'provider':provider,
                'history_text':history_text,
                'now_sale':now_sale,
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
        return new StockBaseEntity(record, core);
    }

    /**
     * 载入数据库记录时的钩子函数
     * @param {*} db 
     * @param {*} callback 
     */
    static async onLoad(db, callback){
        try {
            let ret = await StockBase(db).findAll();
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
        this.Save();
        //抛出更新事件，可以将短时间内的频繁更新合并为单条数据库写
        //this.core.notifyEvent('Cp.update', {Cp:this})
    }
}

exports = module.exports = StockBaseEntity;
