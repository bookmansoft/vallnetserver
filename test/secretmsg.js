/**
 * 单元测试：注册登录、简单应答、推送
 * Creted by liub 2017.3.24
 */

const assert = require('./assert')
const {connector, conn, gameconn} = require('./util');

class User 
{
    /**
     * 构造函数
     * @param {*} id            用户编号 unionid
     * @param {*} connector     连接器
     */
    constructor(id, connector) {
        this.id = id;
        this.conn = connector;
        this.conn.watch(async packet => {
            await echo(this, packet);
        }, gameconn.NotifyType.test);
    }

    async initComm() {
        this.conn.events.on('onConnect', status => {});
        this.conn.setmode(gameconn.CommMode.ws);
        this.conn.setUserInfo({
            domain: 'wx', 
            openid: this.id,
            openkey: '',
        });
        if(!(await this.conn.setLB())) {
            throw(new Error('lbs error'));
        }
        await this.conn.createSocket();
    }

    /**
     * 用私钥初始化
     * @param {Buffer} priv  私钥
     */
    initKey(priv) {
        if(typeof priv == 'string') {
            priv = Buffer.from(priv, 'hex');
        }
        this.secret = new conn.Secret({privateKey: priv});
        this.initPac = this.secret.toEncinit();

        //监听收到的秘密
        this.secret.once('packet', (title, content) => {
            console.log(title, content.toString('utf8'));
        });
    }

    /**
     * 发起握手
     * @param {*} sim 
     */
    async shakehand(sim) {
        if(!this.shaked) {
            this.shaked = true;
            await this.conn.fetching({func: "test.notify", id: sim, msg : {type: 'secInit', data: this.initPac}});
            await (async function(time){return new Promise(resolve =>{setTimeout(resolve, time);});})(1000);

            //验证握手完成
            assert(this.secret.handshake);
            assert(this.secret.isReady());
        }
    }

    /**
     * 发送私密消息
     * @param {*} sim       目标用户
     * @param {*} title     标题
     * @param {*} content   内容
     */
    async sendmsg(sim, sec) {
        const packet = this.secret.packet(sec.title, Buffer.from(sec.content, 'utf8'));
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

describe('私信', function() {
    it('alice和bob获取私钥并进行初始化', async () => {
        await alice.initComm();
        alice.initKey();

        await bob.initComm();
        bob.initKey();
    });

    it('bob发起握手流程', async () => {
        //bob生成握手请求并发送给alice
        await bob.shakehand(alice.id);
    });
    
    it('alice向bob发起加密消息', async () => {
        //alice构造一个秘密(包含消息头和消息体), 加密后发送给bob
        await alice.sendmsg(bob.id, {
            title: 'bookman',
            content: 'hello world',
        });
        await (async function(time){return new Promise(resolve =>{setTimeout(resolve, time);});})(1000);
    });
});
