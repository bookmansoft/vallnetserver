/**
 * 单元测试：CURD
 * Creted by liub 2017.3.24
 */

const remote = require('./util')

async function beforeRemote() {
    await remote.login({openid: `${Math.random()*1000000000 | 0}`});
}

async function test() {
    let msg = await remote.fetching({func: "wechat.GetRecPackInfo", mch_billno:'152078250120191251387982305'});
    return msg
}

async function start() {
    await beforeRemote()
}

async function task() {
    let msg = await test()
    console.log(msg) 
}

start()
setTimeout(()=>{
    task()
}, 1000)
//setInterval(task, 5000);
