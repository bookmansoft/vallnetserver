let facade = require('gamecloud')
let {ReturnCode} = facade.const

let kvMap = new Map();

/**
 * Updated by liub on 2017-05-05.
 */
class remote extends facade.Control {
    get middleware(){
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 设置用户的相关信息
     * @param svr
     * @param envelope
     * @returns {{code: number}}
     */
    async kv(svr, envelope) {
        let val = envelope.v;
        if(typeof val == 'undefined' || val == null) {
            if(kvMap.has(envelope.k)) {
                val = kvMap.get(envelope.k);
            }
        } else {
            kvMap.set(envelope.k, val);
        }

        return val;
    }
}

exports = module.exports = remote;
