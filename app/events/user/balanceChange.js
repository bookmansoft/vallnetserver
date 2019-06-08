/**
 * Created by liub on 2019.06.05
 */
function handle(data){ 
    //用户账户发生变动，对应服务端的 balance.account.client
    console.log(data);
    //env.notfiyToClient(msg.accountName, 'balance.account.client', msg)
}

module.exports.handle = handle;