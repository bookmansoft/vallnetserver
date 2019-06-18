let facade = require('gamecloud')
let {EntityType, IndexType, ReturnCode} = facade.const
let {now, sign} = facade.util

//为短信验证提供签名缓存
let signMap = new Map();
//(仅测试)提供一个短信验证码模拟查询地址
let keyMap = new Map();

/**
 * 自定义认证接口
 */
class auth extends facade.Control
{
    /**
     * 自定义中间件，跳过默认用户认证中间件 authHandle
     */
    get middleware(){
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 配置URL路由，用户可以直接经由页面访问获取签名数据集
     */
    get router() {
        return [
            [`/${auth.name}`, 'auth'],        //定义发放签名功能的路由路径和处理函数
        ];
    }

    /**
     * 生成签名，放入哈希表，将哈希键通过短信发送给用户
     * 后续用户收到短信验证码后，填入openkey字段，连同openid一并提交验证
     * 
     * 注意：这不是控制器方法，而是一个路由调用，可以在未登录状态下调用
     * @param {*} objData 
     */
    async auth(objData) {
        let ret = {
            t: now(),                               //当前时间戳，游戏方必须验证时间戳，暂定有效 期为当前时间前后 5 分钟
            nonce: Math.random()*1000 | 0,          //随机数
            addrType: objData.addrType || 'phone',  //地址类型，'phone'
            address: objData.address,               //地址内容，如手机号码
            openid: objData.openid,                 //用户自行上行的认证标识
        };
        //生成签名字段        
        let $sign = sign(ret, this.core.options[auth.name].game_secret);
        //用签名字段生成6位数字键
        $sign = this.core.service.gamegoldHelper.remote.hash256(Buffer.from($sign, 'utf8')).readUInt32LE(0, true) % 1000000;
        //放入缓存表
        signMap.set($sign, ret);
        keyMap.set(objData.address, $sign);

        //向用户发送短信或邮件
        this.core.notifyEvent('sys.sendsms', {params:{addrType: objData.addrType, address: objData.address, content: $sign}});

        return ret;
    }

    /**
     * 查询短信验证码，注意只是测试阶段开放
     * @param {*} objData 
     */
    async getKey(user, objData) {
        if(!this.core.options.debug) {
            throw new Error('authThirdPartFailed');
        }

        if(keyMap.has(objData.address)) {
            return {code: 0, data: keyMap.get(objData.address)};
        } else {
            return {code: ReturnCode.userIllegal};
        }
    }

    /**
     * 验签函数，注意这不是一个控制器方法，而是由 authHandle 中间件自动调用的内部接口，并不面向客户端
     * @param {*} user 
     * @param {Object} objData {auth: {openid, openkey, addrType, address}}
     */
    async check(objData) {
        if(!signMap.has(objData.openkey)) {
            throw new Error('authThirdPartFailed');
        }

        let item = signMap.get(objData.openkey);

        let _sign = (item.address == objData.address && item.nonce == objData.auth.nonce);
        let _exp = (Math.abs(item.t - now()) <= 300);
        if (!_sign || !_exp) {
            throw new Error('authThirdPartFailed');
        }

        let ret = {openid: item.openid, domain: auth.name, addrType: item.addrType, address: item.address}
        switch(item.addrType) {
            default: {
                //查询历史用户信息
                let history = this.core.GetObject(EntityType.User, item.address, IndexType.Phone);
                if(!!history) { //手机号码已经先期注册过了，返回已注册用户证书
                    ret.openid = history.openid; //覆盖用户标识
                    ret.domain = history.domain; //覆盖登录域
                }
                break;
            }
        }

        //通过验证后，返回用户证书
        return ret;
    }

    /**
     * 获取用户档案文件，注意这不是一个控制器方法，而是由 authHandle 中间件自动调用的内部接口，并不面向客户端
     * @param {*} oemInfo 
     */
    async getProfile(oemInfo) {
        return {
            phone: oemInfo.address,
            openid : oemInfo.openid,
            nickname: oemInfo.nickname || `vallnet${(Math.random()*1000000)|0}`,
            sex: 1,
            country: 'cn',
            province: '',
            city: '',
            avatar_uri: oemInfo.headimgurl || './static/img/icon/mine_no.png',
            block_addr: oemInfo.block_addr || '',
            prop_count: 0,
            current_prop_count: 0,
            unionid: oemInfo.openid,
        }
    }
}

exports = module.exports = auth;
