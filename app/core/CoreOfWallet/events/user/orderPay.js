let facade = require('gamecloud')
let {EntityType, IndexType} = facade.const

/**
 * 主网通知用户订单支付(order.pay)成功执行
 * Created by liub on 2019.06.05
 * @description 主网会分 insert confirm unconfirm 三个不同时机发送该消息
 */
async function handle(event){ 
    // event.data
    // {
    //     "sum": "金额",
    //     "time": "时间",
    //     "uid": "用户编号",
    //     "addr": "用户地址",
    //     "gaddr": "推广员地址",
    //     "sn": "订单号",
    //     "cid": "厂商",
    //     "height": "高度，未上链为-1",
    //     "confirm": "确认数，未上链为0",
    // }
    let mail = this.GetObject(EntityType.Mail, event.data.sn, IndexType.Domain);
    if(!!mail) { //将代表订单的邮件设置为已处理
        await mail.read();
    }
}

module.exports.handle = handle;