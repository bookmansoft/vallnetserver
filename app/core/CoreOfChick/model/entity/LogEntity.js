let facade = require('gamecloud');
let BaseLogEntity = facade.BaseLogEntity;

class LogEntity extends BaseLogEntity
{
	constructor(buylog, core){
        super(buylog, core);
    }
}

exports = module.exports = LogEntity;