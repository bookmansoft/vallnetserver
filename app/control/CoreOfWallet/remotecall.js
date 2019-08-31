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
}

exports = module.exports = remote;
