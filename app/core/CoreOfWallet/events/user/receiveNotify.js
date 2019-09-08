let facade = require('gamecloud')
let {EntityType, IndexType, NotifyType} = facade.const

const Lock = require('../../../../util/lock')
const queueLock = new Lock();

/**
 * 收到主网账户变更通知，转化为邮件
 * Created by liub on 2019.06.05
 */
async function handle(event) { 
    const unlock = await queueLock.lock();
    try {
      await handlePayload.call(this, event);
    } catch(e) {
      console.error(e);
    } finally {
      unlock();
    }
}


/**
 * 收到主网通告(notify/receive)，将其转化为邮件
 * Created by liub on 2019.06.05
 */
async function handlePayload(event) { 
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
        let user = this.GetObject(EntityType.User, event.data.account, IndexType.Account);
        if(!!user) {
            await this.service.gamegoldHelper.sendSysNotify(
                user, 
                event.data, 
                NotifyType.notify, 
                (Date.now()/1000 - Math.max(0, this.chain.height - event.data.h)*600)|0
            );
        }
    }
}

module.exports.handle = handle;