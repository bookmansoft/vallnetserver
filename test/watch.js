/**
 * 单元测试：注册登录、简单应答、推送
 * Creted by liub 2017.3.24
 */

const {connector} = require('./util')
const assert = require('assert')

let a = `${Math.random()*1000000000 | 0}`;
let b = `${Math.random()*1000000000 | 0}`;

//一组单元测试流程
describe('认证', function() {
    /**
     * 一个单元测试流程，可使用 .skip .only 修饰
     * 和负载均衡相关的单元测试，首先连接9901端口，发送config.getServerInfo请求，携带 "stype":"IOS", "oemInfo":{"openid":'helloworl'} 等参数，返回值：data.newbie:是否新注册用户 data.ip:服务器IP, data.port:服务器端口号
     */
    it('注册登录, 简单应答 - 自动负载均衡', /*单元测试的标题*/
        async () => { /*单元测试的函数体，书写测试流程*/
            connector.setUserInfo({
                domain: 'wx', 
                openid: b,
                openkey: b,
            });

            connector.setmode(connector.CommMode.ws);

            if(!(await connector.setLB())) {
                throw(new Error('lbs error'));
            }

            let msg = await connector.fetching({func: "test.echo"}); //所有的控制器都拥有echo方法
            assert(connector.isSuccess(msg, true));
        }
    );

    /**
     * 服务端需要在控制器 CoreOfLogic/test 中添加 notify 方法，并书写如下代码：
     *   async notify(user, objData) {
     *       let friend = facade.GetObject(EntityType.User, `${user.domain}.${objData.id}`, IndexType.Domain);
     *       setTimeout(() => {
     *           friend.notify({type: NotifyType.test, info:`来自${user.domainId}的好消息`}); //下行通知
     *       }, 100)
     *       
     *       return {code: ReturnCode.Success};
     *   }
     */
    it('用户A、B分别登录，A向B推送消息，B收到消息', async () => {
        connector.watch(msg => {
            console.log('收到消息:', msg);
        }, connector.NotifyType.test);

        let connectorOther = connector.new.setFetch(require('node-fetch'));
        connectorOther.setUserInfo({
            domain: 'wx', 
            openid: a,
            openkey: a,
        });
        connectorOther.setmode(connector.CommMode.ws);
        if(!(await connectorOther.setLB())) {
            throw(new Error('lbs error'));
        }
        await connectorOther.fetching({func: "test.notify", id: b});

        await (async function(time){return new Promise(resolve =>{setTimeout(resolve, time);});})(500);
    });
});
