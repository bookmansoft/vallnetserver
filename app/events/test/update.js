let facade = require('gamecloud')

/**
 * Created by admin on 2017-05-26.
 */
function handle(event) {
    facade.current.autoTaskMgr.addTask(new facade.autoExec['testAutoSave'](event.test.getAttr('id')));
}

module.exports.handle = handle;
