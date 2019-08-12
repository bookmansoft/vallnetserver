let facade = require('gamecloud')
let {EntityType, IndexType, NotifyType} = facade.const

/**
 * 收到主网通告(notify/receive)
 * Created by liub on 2019.06.05
 */
function handle(event) { 
    // 通告数据格式 event.data
    // {
    //     h,                  //块高度
    //     oper: 'notify'      //操作类型
    //     sn,                 //消息唯一识别码
    //     body: {
    //         content,        //消息内容，一般为JSON字符串
    //         src,            //发出地址
    //         dst,            //接收地址
    //     },
    //     account,            //账户名称
    //     wid,                //钱包编号
    // }

    let mail = this.GetObject(EntityType.Mail, event.data.sn, IndexType.Domain);
    if(!mail) {
        let user = this.GetObject(EntityType.User, event.data.account, IndexType.Domain);
        if(!!user) {
            this.service.gamegoldHelper.sendSysNotify(
                user, 
                event.data, 
                NotifyType.notify, 
                (Date.now()/1000 - Math.max(0, this.chain.height - event.data.h)*600)|0
            );
        }
    }
}

module.exports.handle = handle;