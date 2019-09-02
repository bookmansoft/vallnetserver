let facade = require('gamecloud')
let assert = require('assert')
let {ReturnCode, NotifyType, TableType} = facade.const

//引入工具包
const toolkit = require('gamerpc')
//创建授权式连接器实例
const remote = new toolkit.conn();
try {
    //使用默认的 POST 通讯方式，如果设置为长连模式，在高并发情况下不能确保请求应答之间的匹配
    remote.setFetch(require('node-fetch'))  //兼容性设置，提供模拟浏览器环境中的 fetch 函数
    .setup({
        type:   'testnet',
        structured: true,
    });
} catch(e) { 
    console.log(e);
}

/**
 * 部分测试流程
 * Updated by liub on 2017-05-05.
 */
class test extends facade.Control
{
    /**
     * 增
     * @param {*} user 
     * @param {*} objData 
     */
    async Create(user, objData) {
        let test = await this.core.GetMapping(TableType.Test).Create(Math.random().toString());
        return {code: ReturnCode.Success, data: test.item};
    }

    /**
     * 改
     * @param {*} user 
     * @param {*} objData 
     */
    Update(user, objData) {
        let test = this.core.GetObject(TableType.Test, objData.id);           //根据上行id查找test表中记录
        if(!!test) {
            test.setAttr('item', Math.random().toString());     //修改所得记录的item字段，下次查询时将得到新值，同时会自动存入数据库
            return {code: ReturnCode.Success, data: test.getAttr('item')};
        }
        return {code: -1};
    }

    /**
     * 查
     * @param {*} user 
     * @param {*} objData 
     */
    Retrieve(user, objData) {
        console.log("控制器添加日志：");
        console.log(objData.id);
        //根据上行id查找test表中记录, 注意在 get 方式时 id 不会自动由字符串转换为整型
        let test = this.core.GetObject(TableType.Test, parseInt(objData.id));
        if(!!test) {
            return {code: ReturnCode.Success, data: test.getAttr('item')};
        }
        return {code: -1};
    }

    /**
     * 删
     * @param {*} user 
     * @param {*} objData 
     */
    async Delete(user, objData) {
        await this.core.GetMapping(TableType.Test).Delete(objData.id, true);
        return {code: ReturnCode.Success};
    }

    /**
     * 列表
     * @param {*} user 
     * @param {*} objData 
     */
    async List(user, objData) {
        let muster = await this.core.GetMapping(TableType.Test) //得到 Mapping 对象
            .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
            .orderby('item', 'desc') //根据id字段倒叙排列
            .paginate(5, objData.id); //每页5条，显示第${objData.id}页，只选取'id'和'item'字段
        
        let $data = {items:{}};
        $data.total = muster.pageNum;
        $data.page = muster.pageCur;

        let $idx = (muster.pageCur-1) * muster.pageSize;
        for(let $value of muster.records(['id', 'item'])){
            $idx++ ;
            $data.items[$idx] = {id: $value['id'], item: $value['item'], rank: $idx};
        }

        return {code: ReturnCode.Success, data: $data};
    }

    /**
     * 从H5客户端到全节点间的通讯接力, 通过并发来保持一定测试压力
     * @param {*} user 
     * @param {*} objData 
     */
    async testRelay1(user, objData) {
        for(let i = 0; i < 5; i++) {
            let msg = await remote.execute('cp.query', []);
            if(!msg.result) {
                console.log('cp.query', msg);
                return {code: ReturnCode.paramError};
            }
    
            if(!msg.result.list || !msg.result.list[0].cid) {
                console.log('cp.query', JSON.stringify(msg.result));
                return {code: ReturnCode.paramError};
            }
        }

        return {code: ReturnCode.Success};
    }

    /**
     * 从H5客户端到全节点间的通讯接力, 通过并发来保持一定测试压力
     * @param {*} user 
     * @param {*} objData 
     */
    async testRelay2(user, objData) {
        for(let i = 0; i < 5; i++) {
            let msg = await remote.execute('balance.all', []);
            if(!msg.result) {
                console.log('balance.all', msg);
                return {code: ReturnCode.paramError};
            }
            if(!msg.result.confirmed) {
                console.log('balance.all', JSON.stringify(msg.result));
                return {code: ReturnCode.paramError};
            }
        }

        return {code: ReturnCode.Success};
    }

    /**
     * 向消息发送者推送一条消息
     * @param user
     * @param objData
     * @returns {Promise.<void>}
     */
    async notify(user, objData) {
        user.notify({type: NotifyType.test, info:objData.id});   //下行通知
        return {code: ReturnCode.Success};
    }
}

exports = module.exports = test;
