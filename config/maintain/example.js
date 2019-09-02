/**
 * 系统维护任务
 * Created by liub on 2017-06-01.
 */
let baseTask = require('./baseTask')
let iniInfo = require('../../gameconfig')

class task extends baseTask {
    async Execute(){
        let pl = [];
        Object.keys(iniInfo.servers).map(idx=>{
            if(idx == "IOS" || idx == "Android"){
                Object.keys(iniInfo.servers[idx]).map(x=>{
                    //填充Promise
                    pl.push(new Promise((resolve, reject) => {
                        let sysCur = iniInfo.servers[idx][x];
                    }));
                });
            }
        })
        //并发执行
        try{
            await Promise.all(pl);
            return true;
        }
        catch(e){
            return false;
        }
    }
}

exports = module.exports = task;
