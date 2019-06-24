let facade = require('gamecloud')
let allyAutoSave = require('../../util/autoExec/allyAutoSave');

/**
 * Created by admin on 2017-05-26.
 */
function handle(event) {
    this.autoTaskMgr.addTask(new allyAutoSave(event.id));
}

module.exports.handle = handle;
