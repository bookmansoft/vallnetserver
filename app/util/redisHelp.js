//引入工具包
let redis = require("redis")

class redisHelp {

     /**
     * 构造函数
     * @param {*}  监控对象ID
     */
    constructor(){

    }

    static async init() {
        this.client = await redis.createClient(6379, "127.0.0.1");
    }

    static async heset(hashkey, field, value, callback) {
        this.client.hset(hashkey, field, value, callback) 
    }

    static async hget(hashkey, field) {
        let that = this
        let ret = await new Promise(function(resolve, reject){
            that.client.hget(hashkey,field, function(err, response) {
                if(err) {
                    reject(err)
                } else {
                    resolve(response)
                }
            })
        }) 
        return ret
    }

}

module.exports = redisHelp;