/**
 * 单元测试：CURD
 * Creted by liub 2017.3.24
 */

const remote = require('./util')

async function beforeRemote() {
    await remote.login({openid: `${Math.random()*1000000000 | 0}`});
}

async function test() {
    let msg = await remote.fetching({func: "manage.RedPackList", uid:17});
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
setInterval(task, 5000);
