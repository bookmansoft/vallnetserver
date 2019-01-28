/**
 * 单元测试：CURD
 * Creted by liub 2017.3.24
 */

const remote = require('./util')

async function beforeEach() {
    let ret = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
    return ret
}

async function test() {
    let msg = await remote.fetching({func: "manage.RedPackList", uid:17});
    return msg
}

async function start() {
    let ret = await beforeEach()
    console.log(ret)
    let msg = await test()
    console.log(msg)
}

start()
