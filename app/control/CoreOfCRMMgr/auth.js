let facade = require('gamecloud')
let {EntityType, IndexType, ReturnCode} = facade.const
let {now, sign} = facade.util

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
     * 验证密码
     * @param {*} user 
     * @param {*} objData userName password type 
     */
    check(user, objData) {
        try {
            let usr = sofar.facade.GetObject(EntityType.User, `${objData.oemInfo.domain}.${objData.oemInfo.openid}`, IndexType.Domain);

            // //构造查询条件
            // let paramArray = new Array();
            // paramArray.push(['login_name', '==', objData.userName]);
            // paramArray.push(['state', '==', 1]);
            // //得到 Mapping 对象
            // let muster = this.core.GetMapping(tableType.operator)
            //     .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
            //     .where(paramArray)
            //     .orderby('id', 'desc') //根据id字段倒叙排列
            //     .paginate(1, 1, ['id', 'login_name', 'password', 'cid', 'token']); //每页1条，显示第${objData.id}页，只选取'id'和'item'字段
            //$data = { id: $value['id'], login_name: $value['login_name'], password: $value['password'], cid: $value['cid'], token: $value['token'], rank: 0 };

            //判断是否有值并处理
            if (!usr) {
                console.log("登录失败，无此用户或用户已注销！");
                return { status: "error", type: "account", currentAuthority: "guest" };
            }

            //有值的情况下，判断密码是否正确
            if (objData.openkey == usr.password) {
                //密码正确
                console.log("登录成功");
                if (objData.userName == "admin") {
                    return { status: "ok", type: "account", currentAuthority: "admin", userinfo: { id: $data.id } };
                }
                else {
                    return { status: "ok", type: "account", currentAuthority: "user", userinfo: { id: $data.id } };
                }
            }
            else {
                //密码错误
                console.log("登录失败，密码错误！");
                return { status: "error", type: "account", currentAuthority: "guest" };
            }
        } catch (error) {
            console.log(error);
            return { status: "error", type: "account", currentAuthority: "guest" };
        }
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
