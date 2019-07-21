let facade = require('gamecloud')
let {ReturnCode} = facade.const
const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser()

/**
 * 配置管理器
 * Updated by liub on 2017-05-05.
 */
class config extends facade.Control {
    /**
     * 配置URL路由，用户可以直接经由页面访问获取签名数据集
     */
    get router() {
        return [
            [`/wxnotify`, 'wxnotify'],
        ];
    }

    /**
     * 中间件设定，子类可覆盖
     */
    get middleware(){
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 收到微信支付的回调通知，进行相应的处理
     * @param {*} params 
     */
    async wxnotify(params) {
        try {
            await new Promise(function(resolve, reject){
                xmlParser.parseString(params, (err, success) => {
                    if (err) {
                        reject(err);
                    } else {
                        //success.xml
                    }
                })
            });
        } catch (e) {
            console.log('wxnotify', e);
        }

        //给微信送回应答
        return `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`;
    }

    /**
     * 查询并返回配置文件
     * @param user
     * @param objData
     * @returns {Promise.<*>}
     */
    async get(user, objData) {
        try{
            if(!!this.core.fileMap[objData.file]){
                return {code:ReturnCode.Success, data:this.core.fileMap[objData.file]};
            }
            else{
                return {code:ReturnCode.Error};
            }
        }
        catch(e){
            console.error(e);
        }
    }
}

exports = module.exports = config;
