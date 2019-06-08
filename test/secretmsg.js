/**
 * 单元测试：注册登录、简单应答、推送
 * Creted by liub 2017.3.24
 */

const assert = require('./assert')
const {connector, conn, gameconn} = require('./util');

class User 
{
    constructor(id, connector) {
        this.id = id;
        this.conn = connector;
        this.conn.watch(async packet => {
            await echo(this, packet);
        }, gameconn.NotifyType.test);
        this.secret = new conn.Secret();
        this.initPac = this.secret.toEncinit();
    }

    async shakehand(sim) {
        if(!this.shaked) {
            this.shaked = true;
            await this.conn.fetching({func: "test.notify", id: sim, msg : {type: 'secInit', data: this.initPac}});
        }
    }

    async sendmsg(sim, title, content) {
        const packet = this.secret.packet(title, Buffer.from(content, 'ascii'));
        await this.conn.fetching({func: "test.notify", id: sim, msg : {type: 'secMsg', data: packet}});
    }
}

class SecretPacket 
{
    constructor() {
        this.src = '';
        this.dst = '';
        this.msg = {
            type: '',
            data: {},
        }
    }
}

let alice = new User(10005882, connector);
let bob = new User(10005883, connector.new.setFetch(require('node-fetch')));

/**
 * 消息响应函数
 * @param {*} user 
 * @param {SecretPacket} packet 完整信息结构
 */
async function echo(user, packet) {
    console.log(user.id, packet.msg.type);

    switch(packet.msg.type) {
        case 'secInit': { //收到握手请求
            //利用握手请求初始化
            user.secret.encinit(packet.msg.data.publicKey, packet.msg.data.cipher);

            //生成握手应答并发送给对方
            let acka = user.secret.toEncack();
            await user.conn.fetching({func: "test.notify", id: packet.src, msg : {type:'secAck', data: acka}});

            await user.shakehand(packet.src);

            break;
        }

        case 'secAck': { //收到握手应答
            //alice利用握手应答完成握手
            user.secret.encack(packet.msg.data.publicKey);

            break;
        }

        case 'secMsg': { //收到加密消息
            //bob解密消息
            user.secret.feed(packet.msg.data);
        }
    }
}

//一组单元测试流程
describe.only('私密信息', function() {
    it('alice和bob分别登录', async () => {
        let ret = await alice.conn.login({openid: alice.id});
        //从返回对象中取得加密密钥信息
        
        ret = await bob.conn.login({openid: bob.id});
        //从返回对象中取得加密密钥信息
    });

    it('bob发起握手流程', async () => {
        //bob生成握手请求并发送给alice
        await bob.shakehand(alice.id);

        await (async function(time){return new Promise(resolve =>{setTimeout(resolve, time);});})(1000);

        //验证握手完成
        assert(alice.secret.handshake);
        assert(bob.secret.handshake);
        assert(alice.secret.isReady());
        assert(bob.secret.isReady());
    });
    
    it('alice向bob发起加密消息', async () => {
        //bob监听收到的秘密
        bob.secret.once('packet', (cmd, body) => {
            //断言解密结果正确与否
            assert.strictEqual(cmd, sec.title);
            assert.bufferEqual(body, Buffer.from(sec.content, 'ascii'));
        });

        //alice构造一个秘密(包含消息头和消息体)
        let sec = {
            title: 'bookman',
            content: 'hello world',
        }
        //加密后发送给bob
        await alice.sendmsg(bob.id, sec.title, sec.content);

        await (async function(time){return new Promise(resolve =>{setTimeout(resolve, time);});})(1000);
    });
});
