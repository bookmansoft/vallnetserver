'use strict';

/*!
 * 对提交参数一层封装，当POST JSON，并且结果也为JSON时使用 */
exports.postJSON = function (data) {
  return {
    dataType: 'json',
    method: 'POST',
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
};

exports.getData = function () {
  return {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  };
};


const JSONCtlCharsMap = {
  '"': '\\"',       // \u0022
  '\\': '\\',       // \u005c
  '\b': '\\b',      // \u0008
  '\f': '\\f',      // \u000c
  '\n': '\\n',      // \u000a
  '\r': '\\r',      // \u000d
  '\t': '\\t'       // \u0009
};
const JSONCtlCharsRE = /[\u0000-\u001F\u005C]/g;

function _replaceOneChar(c) {
  return JSONCtlCharsMap[c] || '\\u' + (c.charCodeAt(0) + 0x10000).toString(16).substr(1);
}

exports.replaceJSONCtlChars = function replaceJSONCtlChars(str) {
  return str.replace(JSONCtlCharsRE, _replaceOneChar);
};

/**
 * 扩展对象，用于多个对象之间的属性注入
 * @note 对属性(get set)复制不会成功
 * @returns {*|{}}
 */
exports.extendObj = function extendObj(){
  /*
　　*target被扩展的对象
　 　*length参数的数量
　　 *deep是否深度操作
　　*/
  var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

  // target为第一个参数，如果第一个参数是Boolean类型的值，则把target赋值给deep
  // deep表示是否进行深层面的复制，当为true时，进行深度复制，否则只进行第一层扩展
  // 然后把第二个参数赋值给target
  if ( typeof target === "boolean" ) {
      deep = target;
      target = arguments[1] || {};

      // 将i赋值为2，跳过前两个参数
      i = 2;
  }

  // target既不是对象也不是函数则把target设置为空对象。
  if ( typeof target !== "object" && !(target.constructor == Function) ) {
      target = {};
  }

  // 如果只有一个参数，则把jQuery对象赋值给target，即扩展到jQuery对象上
  if ( length === i ) {
      target = this;

      // i减1，指向被扩展对象
      --i;
  }

  // 开始遍历需要被扩展到target上的参数
  for ( ; i < length; i++ ) {
      // 处理第i个被扩展的对象，即除去deep和target之外的对象
      if ( (options = arguments[ i ]) != null ) {
          // 遍历第i个对象的所有可遍历的属性
          for ( name in options ) {
              // 根据被扩展对象的键获得目标对象相应值，并赋值给src
              src = target[ name ];
              // 得到被扩展对象的值
              copy = options[ name ];

              if ( src === copy ) {
                  continue;
              }

              // 当用户想要深度操作时，递归合并
              // copy是纯对象或者是数组
              if ( deep && copy && ( (copy.constructor == Object) || (copyIsArray = (copy.constructor == Array)) ) ) {
                  // 如果是数组
                  if ( copyIsArray ) {
                      // 将copyIsArray重新设置为false，为下次遍历做准备。
                      copyIsArray = false;
                      // 判断被扩展的对象中src是不是数组
                      clone = src && (src.constructor == Array) ? src : [];
                  } else {
                      // 判断被扩展的对象中src是不是纯对象
                      clone = src && (src.constructor == Object) ? src : {};
                  }

                  // 递归调用extend方法，继续进行深度遍历
                  target[ name ] = extendObj( deep, clone, copy );
              } else if ( copy !== undefined ) {// 如果不需要深度复制，则直接copy（第i个被扩展对象中被遍历的那个键的值）
                  target[ name ] = copy;
              }
          }
      }
  }

  // 原对象被改变，因此如果不想改变原对象，target可传入{}
  return target;
};
