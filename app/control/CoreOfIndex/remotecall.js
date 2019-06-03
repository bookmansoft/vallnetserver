let facade = require('gamecloud')
let {ReturnCode} = facade.const

let kvMap = new Map();

/**
 * Updated by liub on 2017-05-05.
 */
class remote extends facade.Control {
    get middleware(){
        return ['parseParams', 'authRemote', 'commonHandle'];
    }

    /**
     * 设置用户的相关信息
     * @param svr
     * @param envelope
     * @returns {{code: number}}
     */
    async kv(svr, envelope) {
        let val = envelope.msg.v;
        if(typeof val == 'undefined' || val == null) {
            if(kvMap.has(key)) {
                val = kvMap.get(key);
            }
        } else {
            kvMap.set(key, val);
        }

        return val;
    }
}

exports = module.exports = remote;
