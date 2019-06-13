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
class auth2step extends facade.Control
{
    /**
     * 自定义路由，跳过默认用户认证中间件 authHandle
     */
    get middleware(){
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 配置URL路由，用户可以直接经由页面访问获取签名数据集
     */
    get router() {
        return [
            [`/${auth2step.name}`, 'auth'],        //定义发放签名功能的路由路径和处理函数
        ];
    }

    /**
     * 生成签名，放入哈希表，将哈希键通过短信发送给用户
     * 后续用户收到短信验证码后，填入openkey字段，连同openid一并提交验证
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
        let $sign = sign(ret, this.parent.options[auth2step.name].game_secret);
        //用签名字段生成6位数字键
        $sign = this.parent.service.gamegoldHelper.remote.hash256(Buffer.from($sign, 'utf8')).readUInt32LE(0, true) % 1000000;
        //放入缓存表
        signMap.set($sign, ret);
        keyMap.set(objData.address, $sign);

        //todo 通过短信或邮箱发送，暂时屏显代替
        switch(objData.addrType) {
            default: {
                console.log($sign);
                break;
            }
        }

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

        if(keyMap.has(objData.address)) {
            return {code: 0, data: keyMap.get(objData.address)};
        } else {
            return {code: ReturnCode.userIllegal};
        }
    }

    /**
     * 验签函数，约定函数名为 check
     * @param {*} user 
     * @param {Object} objData {openid, openkey, addrType, address}
     */
    async check(objData) {
        if(!signMap.has(objData.openkey)) {
            throw new Error('authThirdPartFailed');
        }

        let item = signMap.get(objData.openkey);

        let _sign = (item.address == objData.address && item.openid == objData.openid);
        let _exp = (Math.abs(item.t - now()) <= 300);
        if (!_sign || !_exp) {
            throw new Error('authThirdPartFailed');
        }

        let unionid = item.openid;
        switch(item.addrType) {
            default: {
                //查询历史用户信息
                let history = facade.GetObject(EntityType.User, item.address, IndexType.Phone);
                if(!!history) { //手机号码已经先期注册过了，返回已注册用户标识
                    unionid = history.openid;
                }
                break;
            }
        }

        return {openid: unionid}; //通过验证后，返回平台用户ID
    }

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
            unionid: oemInfo.unionid || oemInfo.openid,
        }
    }
}

exports = module.exports = auth2step;
