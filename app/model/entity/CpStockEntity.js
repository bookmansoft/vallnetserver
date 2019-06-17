let facade = require('gamecloud');
let BaseEntity = facade.BaseEntity
let {CpStock} = require('../table/CpStock.js')
const tableType = require('../../util/tabletype')

class CpStockEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: tableType.CpStockEntity,    //表类型
            model: CpStock,                    //表映射类
            entity: CpStockEntity,             //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(cid,cp_name,cp_text,stock_day,stock_open,stock_close,stock_high,stock_low,total_num,total_amount) {
        try{
            let it = await CpStock().create({
                'cid': cid,
                'cp_name': cp_name,
                'cp_text': cp_text,
                'stock_day': stock_day,
                'stock_open': stock_open,
                'stock_close': stock_close,
                'stock_high': stock_high,
                'stock_low': stock_low,
                'total_num': total_num,
                'total_amount': total_amount,
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
    static onMapping(record){
        return new CpStockEntity(record, facade.current);
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
            let ret = await CpStock(db, sa, pwd).findAll();
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
        // facade.current.notifyEvent('Cp.update', {Cp:this})
    }
}

exports = module.exports = CpStockEntity;
