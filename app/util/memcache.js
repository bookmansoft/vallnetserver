/**
 * 带有超时效果的KV缓存
 */
class memcache
{
    constructor() {
        this.map = new Map();
    }

    has(key) {
        if(!this.map.has(key)) {
            return false;
        }

        let item = this.map.get(key);
        if(!!item.time && ((Date.now()/1000) - item.now > item.time)) {
            this.map.delete(key);
            return false;
        }
        return true;
    }

    get(key) {
        let item = this.map.get(key);
        if(!!item) {
            return item.value;
        }
        return null;
    }

    set(key, value, time=0) {
        this.map.set(key, {value: value, time: time, now: Date.now()/1000});
    }
}

let obj = new memcache();

module.exports = obj;