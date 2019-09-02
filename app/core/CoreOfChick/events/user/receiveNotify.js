/**
 * Created by liub on 2019.06.05
 */
function handle(data){ 
    //用户收到新的通知消息，对应服务端的 notify/receive
    console.log(data);
}

module.exports.handle = handle;