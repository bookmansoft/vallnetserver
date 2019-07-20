/**
 * Created by liub on 2019.06.05
 */
function handle(data){ 
    //用户收到拍卖成功消息，对应服务端的 prop/auction
    console.log(data);
}

module.exports.handle = handle;