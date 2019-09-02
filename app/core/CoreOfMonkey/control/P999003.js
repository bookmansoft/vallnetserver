let uuid       = require('uuid');
let facade     = require('gamecloud')
let {ShopTypeEnum, PurchaseStatus,PurchaseType, ResType, ActionExecuteType, ReturnCode,cid} = facade.const
let shopInfo   = facade.assistants.shopInfo

//引入工具包
const toolkit = require('gamerpc')
//创建授权式连接器实例
const remote = new toolkit.conn();
remote.setFetch(require('node-fetch'))  //兼容性设置，提供模拟浏览器环境中的 fetch 函数
//     .setup({ //设置授权式连接器的参数 - 将会覆盖默认设置
//     type:   'testnet',               //希望连接的对等网络的类型，分为 testnet 和 main
//     ip:     '127.0.0.1',             //远程全节点地址
//     apiKey: 'bookmansoft',           //远程全节点基本校验密码
//     id:     'primary',               //默认访问的钱包编号
//     cid:    'terminal001',           //终端编码，作为访问远程全节点时的终端标识
//     token:  '0340129aaa7a69ac10bfbf314b9b1ca8bdda5faecce1b6dab3e7c4178b99513392', //访问钱包时的令牌固定量，通过HMAC算法，将令牌随机量和令牌固定量合成为最终的访问令牌
// });

/**
 * 获取商品列表，细分为：元宝商城；普通商城；工会商城；荣誉商城
 */
class P999003 extends facade.Control
{
    /**
     * @brief  999003报文：商城管理
     *
     * @date   2016.10.12
     *
     * @param {UserEntity} user
     * @param  :
     * name        | type     | description of param
     * ------------|----------|--------------------
     * type        | int      | 商城类型
     * oper        | int      | 操作类型  1查询列表 2购买商品 3强刷商品列表
     * id          | int      | 选中的商品ID
     *
     * @return
     * name        | type     | description of value
     * ------------|----------|----------------------
     * code        | int      | 返回码
     * data        | object   | 返回的数值对象
     * .items      | array    | 向客户端返回指定商店的商品列表信息
     * ..cur       | int      | 当前已购买次数
     * ..desc      | string   | 描述，只对某些商店有效
     * ..max       | int      | 最大购买数量，只对某些商店有效
     * ..flag      | int      | 促销标记 暂未启用
     * ..point     | int      | 购买数量
     * ..freepoint | int      | 免费赠送数量
     * ..id        | int      | 商品编号
     * ..price     | int      | 商品价格
     * ..stype     | int      | 商店类型
     * ..type      | int      | 商品类型
     * .config     | array    | 向客户端返回指定商店的配置信息
     * ..time      | int      | 刷新时间间隔（秒）
     * ..lt        | int      | 刷新倒计时（秒）
     * ..max       | int      | 最大刷新条目
     * ..money     | int      | 刷新价格
     * ..mt        | int      | 货币类型 详见ResType
     * ..type      | int      | 商店类型 1 钻石商城 2 普通商城 4 神秘商城
     */
    async Execute(user, input) {
        //数据规范化
        input.type = parseInt(input.type || 1);
        input.oper = parseInt(input.oper || 1);
        input.id = parseInt(input.id || 1);

        let $code = ReturnCode.Success;
        let $data = new D999003();

        //作弊指令
        if(input.oper == ShopOperType.cheat){
            if(!!input.bonus){
                user.getBonus(input.bonus, true);
            }
            return {code:$code, data: $data};
        }

        let $status = facade.tools.Indicator.inst(input.type);
        Object.keys(ShopTypeEnum).map($key=>{
            let $val = ShopTypeEnum[$key];
            if($status.check($val)){
                /**
                 * 商品缓存信息管理器
                 */
                user.getShopInfo().refresh($val, false);//检测时间间隔、刷新商品列表

                switch(input.oper){
                    case ShopOperType.query:
                        break;

                    case ShopOperType.buy: //购买并发放奖励
                        let $item = shopInfo.items.get(input.id);
                        if($item != null){
                            //生成订单
                            this.core.entities.LogEntity.onCreate(user.domain,uuid.v4(),input.id,$item['price'],(new Date()).valueOf(),$item['name'],user.id,PurchaseStatus.create);
                            // remote.execute('prop.order', [
                            //     cid, //游戏编号
                            //     facade.util.rand(10000000, 9999999999), //道具原始
                            //     50000, //道具含金量
                            //     user.baseMgr.info.address //游戏内玩家的有效地址
                            // ]).then(ret => {
                            //     console.log(ret)
                            // }).catch(error=>{
                            //     console.log(error);
                            // });

                            if(user.getPocket().ResEnough(ResType.Diamond, $item['price'])) {
                                //购买商品、做标记
                                $code = user.getShopInfo().purchase($item);
                                if($code == ReturnCode.Success){
                                    user.getPocket().AddRes(ResType.Diamond, -$item['price']);//扣钱
                                }
                            }
                            else{
                                $code = ReturnCode.NotEnough_Diamond;
                            }
                        }
                        else{
                            $code = ReturnCode.itemNotExist;
                        }
                        break;

                    case ShopOperType.refresh: //强刷新的物品
                        let $sum = shopInfo.shops[$val]['money'];
                        if(user.getPocket().ResEnough(ResType.Diamond, $sum)){
                            user.getPocket().AddRes(ResType.Diamond, -$sum);
                            user.getShopInfo().refresh($val, true);
                        }
                        else{
                            $code = ReturnCode.NotEnough_Diamond;
                        }
                        break;
                }

                $data.items = $data.items.concat(user.getShopInfo().getItems($val));//向客户端返回指定商店的商品缓存信息
                $data.config[$val] = user.getShopInfo().GetShopConfig($val);//向客户端返回指定商店的配置信息
                $data.diamond = user.getPocket().GetRes(ResType.Diamond);
            }
        });

        return {code:$code, data: $data};
    }
}

const ShopOperType = {
    query: 1,
    buy: 2,
    refresh: 3,
    cheat: 99,  //作弊指令
}

/**
 * 返回报文 Class D999003
 */
class D999003
{
    constructor(){
        //商店类型 货币种类 货币数量 列表最大条目数 刷新间隔 剩余时间
        //<shop type='1' mt='1' money='300' max='10' time='0' lt=''>
        //已购数量 限购数量 货物类型 商品编号 商品名称 货物数量 赠送数量 热卖标记 单价 描述
        //<prop cur='0' max='0' type='1' id='1' name='6' point='60' freepoint='0' flag='1' price='6' desc='元宝60' />
        this.items = [];
        this.config = {};
    }
}

exports = module.exports = P999003;

