let facade = require('gamecloud')

/**
 * 自定义认证接口 - 微信专用
 */
class authwx extends facade.Control
{
    /**
     * 校验客户端从钱包获取的认证报文, 同时也做了链上道具确权
     * @description 
     *  profile.props 为链上道具清单，CP有义务对其进行如下操作：
     *  1. 本地确权：链上有的道具，要确保背包中也有；链上没有的道具，要确保背包中也没有。不多、不少、要去重
     *  2. 编码转换：链上道具属性中， pid 为主网道具唯一标识， oid 为CP为道具分配的模板ID， CP有可能以 oid 为道具索引，也可能另行规范索引，需要厘清彼此映射关系
     * 
     *  推荐的处理模式为：
     *  1. 为链上道具单独设立分类，显著区别于普通道具。
     *  2. 玩家登录时实时取链上道具，将其与本地道具列表并表为最终的背包数据
     * 
     * @warning 
     *  链上道具可以做的事情：
     *  1. CP可以主动制作道具，并投放给指定用户
     *  2. 链上道具通过 oid 锚定游戏内指定道具模板，通过 pid 提供全局唯一标识，通过 gold 提供真实含金量，CP可以利用这三个基本变量进行确权映射、去重等操作
     * 
     *  链上道具不可以做的事情：
     *  1. 无法在游戏内，转移玩家拥有的链上道具的所有权。道具的转移、熔铸、拍卖，都只能在钱包内进行，这是因为玩家道具的所有权不在CP侧
     *  2. 无法在游戏内，将两个链上道具融合成新的链上道具，因为这和第一条冲突
     *  3. 无法在游戏内，修改链上道具扩展属性(如等级、镶嵌等)并保存至链上，扩展属性管理仅限于游戏本地处理
     * 
     *  目前鸡小德并未启用链上道具功能，只是在钻石层面与主网做了衔接
     */
    async check(oemInfo) {
        // if(this.core.service.gamegoldHelper.cid == oemInfo.cid && toolkit.verifyData({
        //     data: {
        //         cid: oemInfo.cid,
        //         uid: oemInfo.uid,
        //         time: oemInfo.time,
        //         addr: oemInfo.addr,
        //         pubkey: oemInfo.pubkey,
        //     },
        //     sig: oemInfo.sig
        // })) {
            let profile = {
                "openid": oemInfo.openid,
                "nickname": "百晓生",
                "sex": 1,
                "language": "zh_CN",
                "city": "Fuzhou",
                "province": "Fujian",
                "country": "CN",
                "headimgurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI5Qw1flMibKSBwZ8MXSmod0YsC7d9fornhL9KibjGvrsia0AMoZaXHicHf0ibNNIw0hoic69282UjFOwBg/132",
                "unionid": oemInfo.openid,
                "acaddr": oemInfo.addr || '',
            };

            //取链上道具，即使失败也不影响登录
            let props = [];
            // try {
            //     let retProps = await this.core.service.gamegoldHelper.execute('prop.remoteQuery', [[
            //         ['size', -1],
            //         ['pst', 9],
            //         ['cid', this.core.service.gamegoldHelper.cid],
            //         ['current.address',  profile.acaddr],
            //     ]]);
        
            //     for (let item of retProps.result.list) {
            //         props.push({
            //             pid: item.pid,      //主网道具唯一标识
            //             oid: item.oid,      //CP端模板标识
            //             gold: item.gold,    //道具真实含金量
            //         });
            //     }
            // } catch(e) {
            //     console.log(e.message);
            //     props = null;
            // }
    
            return {
                openid : profile.openid,
                nickname: profile.nickname,
                sex: profile.sex,
                country: profile.country,
                province: profile.province,
                city: profile.city,
                avatar_uri: profile.headimgurl || './static/img/icon/mine_no.png',
                unionid: profile.unionid,
                acaddr: profile.addr,
                openkey: oemInfo.openkey,
                prop_count: 0,
                current_prop_count: 0,
                props: props, //链上道具列表, 如果为 null 表示网络异常、确权失败，如果为 [] 才表示无链上道具
            }
        // } else {
        //     throw new Error('auth error');
        // }
    }

    /**
     * 获取用户档案文件，注意这不是一个控制器方法，而是由 authHandle 中间件自动调用的内部接口，并不面向客户端
     * @param {*} oemInfo 
     */
    async getProfile(oemInfo) {
        let profile = {
            "openid":oemInfo.openid,
            "nickname":"百晓生",
            "sex":1,
            "language":"zh_CN",
            "city":"Fuzhou",
            "province":"Fujian",
            "country":"CN",
            "headimgurl":"./static/img/icon/mine_no.png",
            "unionid":oemInfo.openid,
        }

        //做统一的格式转换
        return {
            openid : profile.openid,
            nickname: profile.nickname,
            sex: profile.sex,
            country: profile.country,
            province: profile.province,
            city: profile.city,
            avatar_uri: profile.headimgurl,
            prop_count: 0,
            current_prop_count: 0,
            unionid: profile.unionid,                                               
        }
    }
}

exports = module.exports = authwx;
