let facade = require('gamecloud');
let BaseEntity = facade.BaseEntity
let {Redpacket} = require('../table/Redpacket.js')
const tableType = require('../../util/tabletype')

class RedpacketEntity extends BaseEntity
{
    //region 集合功能

    /**
     * 为 Mapping 映射进行参数配置
     */
    static get mapParams() {
        return {
            etype: tableType.RedpacketEntity,    //表类型
            model: Redpacket,                    //表映射类
            entity: RedpacketEntity,             //ORM映射类
        };
    }

    /**
     * 创建记录时的钩子函数
     */
    static async onCreate(act_name,act_sequence,total_gamegold,each_gamegold,total_num,each_num,act_desc,act_start_at,act_end_at) {
        try{
            let it = await Redpacket().create({
                'act_name': act_name,
                'act_sequence': act_sequence,
                'total_gamegold': total_gamegold,
                'each_gamegold': each_gamegold,
                'total_num': total_num,
                'each_num': each_num,
                'act_desc': act_desc,
                'act_start_at': act_start_at,
                'act_end_at': act_end_at,
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
        return new RedpacketEntity(record, facade.current);
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
            let ret = await Redpacket(db, sa, pwd).findAll();
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
        //抛出更新事件，可以将短时间内的频繁更新合并为单条数据库写
        facade.current.notifyEvent('Redpacket.update', {Redpacket:this})
    }
}

exports = module.exports = RedpacketEntity;
