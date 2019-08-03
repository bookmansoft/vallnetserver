/**
 * 序列化对象，和 JSON.stringify 不同之处在于：
 *    1、排除了属性排序变化带来的影响
 *    2、主动去除了 exclude 中的属性
 * @param {Object} data      待序列化的对象
 * @param {Array?} exclude   包含所有待排除的属性名的数组
 */
function stringify(data, exclude) {
    if(typeof data == 'undefined' || !data) {
      return '';
    } 
    if(typeof data == 'string'){
      return data;
    }
    if(Array.isArray(data)) {
      return data.reduce((sofar,cur)=>{
        sofar += stringify(cur);
        return sofar;
      }, '');
    } else if(typeof data == 'number' || typeof data == 'boolean') {
      return data.toString();
    } else if(typeof data == 'object') {
      let base = '';
      Object.keys(data).sort().map(key=>{
        if(!exclude || !exclude.includes[key]) {
          if(!!data[key]) {
            base += key + stringify(data[key]);
          }     
        }
      });
      return base;
    } else if(Buffer.isBuffer(data)) {
      return data.toString('base64');
    }
    
    return data;
}
  
module.exports={
    stringify
}