let facade = require('gamecloud')
let {ReturnCode, EntityType, NotifyType, IndexType} = facade.const
let tableType = require('../../util/tabletype');
let {gamegoldHelp} = require('../../util/gamegoldHelp')

/**
 * 部分测试流程
 * Updated by liub on 2017-05-05.
 */
class test extends facade.Control
{
    /**
     * 中间件设置
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 路由设定
     */
    get router() {
        return [
            ['/test/hello', 'hello'],
        ];
    }

    /**
     * 测试路由函数
     */
    async hello(data) {
        //注册CP

        let env = {name: ((Math.random()*1000000)|0).toString()};
        let oid = ((Math.random()*1000000)|0).toString();
        await gamegoldHelp.execute('miner.setsync.admin', []);

        //注册一个新的CP, 指定 15% 的媒体分成
        let ret = await gamegoldHelp.execute('cp.create', [env.name, 'http://127.0.0.1', null, 'slg', 15]);

        //确保该CP数据上链
        await gamegoldHelp.execute('miner.generate.admin', [1]);
        
        //查询并打印CP信息
        ret = await gamegoldHelp.execute('cp.byName', [env.name]);
        env.cid = ret.result.cid;
        env.addr = ret.result.current.address;
        console.log(env);

        //创建一个道具
        ret = await gamegoldHelp.execute('prop.create', [env.cid, oid, 10000]);
        if(!!ret) {
            env.hash = ret.result.hash;
            env.pid = ret.result.pid;
        }
        await (async (time) => {return new Promise(resolve => {setTimeout(resolve, time);});})(1000);

        ret = await gamegoldHelp.execute('prop.send', [env.addr, env.pid]);
        if(!!ret) {
            env.hash = ret.result.hash;
        }
        await (async (time) => {return new Promise(resolve => {setTimeout(resolve, time);});})(1000);
    }

    /**
     * 增
     * @param {*} user 
     * @param {*} objData 
     */
    async TestA(user, objData) {
        console.log(user)
        return {code: ReturnCode.Success};
    }

    /**
     * 增
     * @param {*} user 
     * @param {*} objData 
     */
    async Create(user, objData) {
        let test = await facade.GetMapping(tableType.test).Create(Math.random().toString());
        return {code: ReturnCode.Success, data: test.item};
    }

    async Creates(user, objData) {
        facade.GetMapping(tableType.test).Creates(objData.items, true);
        return {code: ReturnCode.Success};
    }

    /**
     * 改
     * @param {*} user 
     * @param {*} objData 
     */
    Update(user, objData) {
        let test = facade.GetObject(tableType.test, objData.id);           //根据上行id查找test表中记录
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
        let test = facade.GetObject(tableType.test, parseInt(objData.id));
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
    Delete(user, objData) {
        facade.GetMapping(tableType.test).Delete(objData.id, true);
        return {code: ReturnCode.Success};
    }

    Deletes(user, objData) {
        facade.GetMapping(tableType.test).Deletes(objData.ids, true);
        return {code: ReturnCode.Success};
    }

    /**
     * 列表
     * @param {*} user 
     * @param {*} objData 
     */
    List(user, objData) {
        let muster = facade.GetMapping(tableType.test) //得到 Mapping 对象
            .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
            .orderby('id', 'desc') //根据id字段倒叙排列
            .paginate(5, objData.id, ['id', 'item']); //每页5条，显示第${objData.id}页，只选取'id'和'item'字段
        
        let $data = {items:{}};
        $data.total = muster.pageNum;
        $data.page = muster.pageCur;

        let $idx = (muster.pageCur-1) * muster.pageSize;
        for(let $value of muster.records()){
            $idx++ ;
            $data.items[$idx] = {id: $value['id'], item: $value['item'], rank: $idx};
        }
        return {code: ReturnCode.Success, data: $data};
    }

    /**
     * 向消息发送者推送一条消息
     * @param {BaseUserEntity}  user  
     * @param {Object}          objData
     */
    async notify(user, objData) {
        let friend = facade.GetObject(EntityType.User, `${user.domain}.${objData.id}`, IndexType.Domain);
        setTimeout(() => {
            friend.notify({type: NotifyType.test, info:`来自${user.domainId}的好消息`}); //下行通知
        }, 100)
        
        return {code: ReturnCode.Success};
    }
}

exports = module.exports = test;
