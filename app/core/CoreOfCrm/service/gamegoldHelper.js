let facade = require('gamecloud')
let gh = require('../../../util/gamegoldHelper')

class gamegoldHelper extends gh
{
    constructor(core) {
        super(core);
        this.remote.setup(facade.ini.servers["CoreOfIndex"][1].node);
    }
}

module.exports = gamegoldHelper;
