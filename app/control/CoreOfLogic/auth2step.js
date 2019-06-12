let facade = require('gamecloud')
let {now, sign} = facade.util

//为短信、邮箱验证提供签名缓存
let signMap = new Map();
//提供一个短信验证码模拟查询地址
let keyMap = new Map();
/**
 * 自定义认证接口
 */
class authwx extends facade.Control
{
    constructor(parent) {
        super(parent);
        this.domain = 'authwx';
    }

    /**
     * 自定义路由
     */
    get middleware(){
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 控制器自带的Url路由信息
     */
    get router() {
        return [
            [`/${this.domain}`, 'auth'],        //定义发放签名功能的路由、函数名
        ];
    }

    /**
     * 生成签名，放入哈希表，将哈希键通过短信或者邮箱发送给用户，用户填入openkey字段，连同openid一并提交验证
     * @param {*} objData 
     */
    async auth(objData) {
        //objData.id 就是 openid
        let ret = {
            t: now(),                               //当前时间戳，游戏方必须验证时间戳，暂定有效 期为当前时间前后 5 分钟
            nonce: Math.random()*1000 | 0,          //随机数
            plat_user_id: objData.id,               //平台用户 ID
            nickname: objData.id,                   //用户昵称
            avatar: objData.id,                     //头像
            is_tourist: 1,                          //是否为游客
        };
        //生成签名字段        
        let $sign = sign(ret, this.parent.options[this.domain].game_secret);
        //用签名字段生成6位数字键
        $sign = this.parent.service.gamegoldHelper.remote.hash256(Buffer.from($sign, 'utf8')).readUInt32LE(0, true) % 1000000;
        //放入缓存表
        signMap.set($sign, ret);
        keyMap.set(objData.id, $sign);

        //todo 通过短信发送，暂时屏显代替
        console.log($sign);

        return ret;
    }

    /**
     * 查询短信验证码，注意只是测试阶段开放
     * @param {*} objData 
     */
    async getKey(user, objData) {
        if(!this.parent.options.debug) {
            throw new Error('authThirdPartFailed');
        }

        if(keyMap.has(objData.id)) {
            return {code:keyMap.get(objData.id)};
        } else {
            return {code:0};
        }
    }

    /**
     * 验签函数，约定函数名为 check
     * @param {*} user 
     * @param {*} oemInfo 
     */
    async check(oemInfo) {
        if(!signMap.has(oemInfo.openkey)) {
            throw new Error('authThirdPartFailed');
        }

        let item = signMap.get(oemInfo.openkey);

        let _sign = (item.plat_user_id == oemInfo.openid);
        let _exp = (Math.abs(oemInfo.auth.t - now()) <= 300);
        if (!_sign || !_exp) {
            throw new Error('authThirdPartFailed');
        }

        return {openid: oemInfo.auth.plat_user_id}; //通过验证后，返回平台用户ID
    }
}

exports = module.exports = authwx;
