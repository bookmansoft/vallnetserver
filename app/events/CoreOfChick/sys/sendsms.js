let facade = require('gamecloud')
let EventData = facade.Util.EventData

/**
 * 负责处理验证短信下行的事件
 * @param {EventData} data
 * @description 此处未作流量控制，应该在业务层控制不必要的重复发送
 */
function handle(data) {
    switch(data.params.addrType) {
        default: {
            //向用户发送短信
            this.service.sms.send({
                addr: data.params.address,          //下行短信的目标地址
                template: 'test',                   //下行短信的内容模板
                tp:`["${data.params.content}"]`,    //内容模板的填充参数
            });
            break;

            /**华为短信模板变量格式：${NUM_8}、${TXT_32}、${DATE}或${TIME} 示例：您的验证码为：${NUM_8}（5分钟有效）*/
        }
    }
}

module.exports.handle = handle;
