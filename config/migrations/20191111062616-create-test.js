'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('test', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},        //主键，本服内用户唯一编号
    item: {type: 'string', length: 500}, 
  }).then(
    function(result) {
    },
    function(err) {
    }
  );
};

exports.down = function(db) {
  return db.dropTable('test').then(
    function(result) {
    },
    function(err) {
    }
  );
};

exports._meta = {
  "version": 1
};
