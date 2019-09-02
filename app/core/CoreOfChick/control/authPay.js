/**
 * 第三方认证支付接口
 * Created by liub on 2017-04-06.
 */

 let facade = require('gamecloud')

class authPay extends facade.Control
{
    /**
     * 控制器自带的Url路由信息
     */
    get router(){
        return [
            ['/test/ping.html', 'ping'],          //PING测试接口
        ];
    }

    /**
     * PING测试接口
     */
    async ping(){
        return '200';
    }
}

exports = module.exports = authPay;
