/**
 * Created by liub on 2019.06.05
 */
function handle(data){ 
    //用户订单支付成功，对应服务端的 order.pay
    console.log(data);
}

module.exports.handle = handle;