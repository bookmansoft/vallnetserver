let facade = require('gamecloud');
let {EntityType, IndexType, NotifyType} = facade.const;

const Lock = require('../../../util/lock')
const queueLock = new Lock();

/**
 * 收到主网账户变更通知，转化为邮件
 * Created by liub on 2019.06.05
 */
async function handle(payload) { 
    const unlock = await queueLock.lock();
    try {
      await handlePayload.call(this, payload);
    } catch(e) {
      console.error(e);
    } finally {
      unlock();
    }
}

async function handlePayload(payload) {
    //用户账户发生变动，对应主网事件 balance.account.client
    let log = payload.data;
    // {
    //     "aname": "authwx.081PHnJu13v1Ge01svIu1ebqJu1PHnJv",                              //账号名称
    //     "aidx": 2,                                                                       //账号索引
    //     "height": 120,                                                                   //日志所在高度
    //     "hash": "ce301be39a1724af9b6a39ccc9a39117cf66bd069003e4224b94d26d7b3e378f",      //日志所在交易哈希
    //     "in": [                                                                          //所有关联输入的列表 [索引, 金额] - 代表支出
    //       [0, 50000]
    //     ],
    //     "out": [                                                                         //所有关联输出的列表 [索引, 金额] - 代表收入
    //       [0,17200],
    //       [1,30000]
    //     ],
    //     "balance": {                                                                     //期末账户余额
    //       "wid": 1,                                                                      //钱包编号
    //       "id": "primary",                                                               //钱包名称
    //       "account": 2,                                                                  //账户编号
    //       "unconfirmed": 401600,                                                         //未确认金额
    //       "confirmed": 341600,                                                           //已确认金额
    //       "locked": 0                                                                    //锁仓金额
    //     }
    // }

    let ui = this.GetObject(EntityType.User, log.aname, IndexType.Domain);
    if(!!ui) {
        let _confirmed = log.balance.confirmed;
        let _unconfirmed = log.balance.unconfirmed - log.balance.locked;
        ui.baseMgr.info.setAttr('confirmed', _confirmed);
        ui.baseMgr.info.setAttr('unconfirmed', _unconfirmed);

        ui.notify({type: 911001, info: {confirmed: _confirmed, unconfirmed: _unconfirmed}});

        if(log.height > 0) {
            log.sn = `${log.aname}.${log.hash}`;
            let tm = (log.height > 0) ? ((Date.now()/1000 - Math.max(0, this.chain.height - log.height)*600)|0) : ((Date.now()/1000)|0);
            let mail = this.GetObject(EntityType.Mail, log.sn, IndexType.Domain);
            if(!mail) {
                await this.service.gamegoldHelper.sendSysNotify(
                    ui,
                    log, 
                    NotifyType.balance, 
                    tm,
                );
            } else {
                mail.setAttr('time', tm);
                mail.setAttr('content', JSON.stringify({
                    type: NotifyType.balance,
                    info: {
                        content: log,
                    }
                }));
            }
        }
    }    
}

module.exports.handle = handle;