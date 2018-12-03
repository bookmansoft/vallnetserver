/**
 * 系统维护任务 - 提取单独字段，包括score，hisGateNo等
 * Created by liub on 2017-06-01.
 */
let baseTask = require('./baseTask')
let iniInfo = require('../../game.config')
let facade = require('gamecloud')
let User = facade.models['User']

class task extends baseTask {
    async Execute(){
        let pl = [];
        Object.keys(iniInfo.servers).map(idx=>{
            if(idx == "IOS" || idx == "Android"){
                Object.keys(iniInfo.servers[idx]).map(x=>{
                    //填充Promise
                    pl.push(new Promise((resolve, reject) => {
                        let sysCur = iniInfo.servers[idx][x];
                        User(sysCur.mysql.db, sysCur.mysql.sa, sysCur.mysql.pwd, sysCur.mysql.host, sysCur.mysql.port).findAll().then(ret=>{
                            ret.map(it=>{
                                it.status = 1;
                                process.nextTick(()=>{
                                    it.save();
                                });
                            });
                            resolve();
                        }).catch(e=>{
                            reject(e);
                        });
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
