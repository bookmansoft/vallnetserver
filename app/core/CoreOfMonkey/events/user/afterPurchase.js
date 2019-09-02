let facade = require('gamecloud')

/**
 * Created by admin on 2017-05-26.
 */
function handle(data) {
    //console.log(`${data.user.openid}花费了${data.amount}`);
    if(!this.options.debug){
        switch(data.user.domainType) {
            default:
                break;
        }
    }
}

module.exports.handle = handle;