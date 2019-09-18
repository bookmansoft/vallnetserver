const toolkit = require('gamerpc')
let facade = require('gamecloud')
let CoreOfBase = facade.CoreOfBase

class gamegoldHelper extends facade.Service
{
     /**
     * 构造函数
     * @param {CoreOfBase} core
     */
    constructor(core) {
        super(core);

        this.remote = new toolkit.conn();
        //兼容性设置，提供模拟浏览器环境中的 fetch 函数
        this.remote.setFetch(require('node-fetch'))  
    }

    /**
     * 将连接器设置为长连模式，同时完成登录、消息订阅等操作
     */
    setlongpoll(cb) {
        this.remote.setmode(this.remote.CommMode.ws, cb);
        return this;
    }

    async execute(method, params) {
        return await this.remote.execute(method, params)
    }

    /**
     * 网络类型
     */
    get network() {
        return this.remote.getTerminalConfig().type;
    }

    /**
     * CP编号
     */
    get cid() {
        return this.remote.getTerminalConfig().cid;
    }

    watch(cb, etype = '0') {
        this.remote.watch(cb, etype);
        return this;
    }

    revHex(data) {
        this.assert(typeof data === 'string');
        this.assert(data.length > 0);
        this.assert(data.length % 2 === 0);
      
        let out = '';
      
        for (let i = 0; i < data.length; i += 2)
          out = data.slice(i, i + 2) + out;
      
        return out;
    }  

    assert(value, message) {
        if (!value) {
          throw new assert.AssertionError({
            message,
            actual: value,
            expected: true,
            operator: '==',
            stackStartFunction: assert
          });
        }
    }
}

module.exports = gamegoldHelper;
