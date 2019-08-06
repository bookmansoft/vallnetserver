let facade = require('gamecloud')
let UserEntity = facade.entities.UserEntity
let autoSave = facade.autoExec.autoSave

/**
 * Created by admin on 2017-05-26.
 */
function handle(event) {
    this.autoTaskMgr.addTask(new autoSave(event.user.id));
}

module.exports.handle = handle;
