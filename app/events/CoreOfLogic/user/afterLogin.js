/**
 * Created by liub on 2019-07-18.
 */
let facade = require('gamecloud')
let {EntityType, IndexType, NotifyType} = facade.const

/**
 * 用户登录后，用来执行一些后续操作，例如获取腾讯会员信息、蓝钻特权等
 * @note 事件处理函数，this由外部注入，指向Facade
 * @param data
 */
async function handle(data){
    //查询过去一天内的账号变更日志
    rt = await this.service.gamegoldHelper.execute('balance.log', [data.user.domainId, Math.max(0, this.chain.height - 144)]);
    if(!!rt && rt.code == 0) {
        for(let log of rt.result) {
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


            log.sn = `${log.aname}.${log.hash}`;

            let mail = this.GetObject(EntityType.Mail, log.sn, IndexType.Domain);
            if(!mail) {
                this.service.gamegoldHelper.sendSysNotify(
                    data.user,
                    log, 
                    NotifyType.balance,
                    (Date.now()/1000 - Math.max(0, this.chain.height - log.height)*600)|0
                );
            }
        }
    }    
}

module.exports.handle = handle;