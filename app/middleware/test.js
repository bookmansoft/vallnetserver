let facade = require('gamecloud')
let {MiddlewareParam} = facade.const

/**
 * test
 * @param {MiddlewareParam} sofar
 */
async function handle(sofar) {
    console.log('MiddlewareParam');
}

module.exports.handle = handle;
