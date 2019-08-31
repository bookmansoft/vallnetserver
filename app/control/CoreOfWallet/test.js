let facade = require('gamecloud')
let {ReturnCode, EntityType, NotifyType, IndexType, TableType} = facade.const

/**
 * 部分测试流程
 * Updated by liub on 2017-05-05.
 */
class test extends facade.Control
{
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
        await this.core.service.gamegoldHelper.execute('miner.setsync.admin', []);

        //注册一个新的CP, 指定 15% 的媒体分成
        let ret = await this.core.service.gamegoldHelper.execute('cp.create', [env.name, 'http://127.0.0.1', null, 'slg', 15]);

        //确保该CP数据上链
        await this.core.service.gamegoldHelper.execute('miner.generate.admin', [1]);
        
        //查询并打印CP信息
        ret = await this.core.service.gamegoldHelper.execute('cp.byName', [env.name]);
        env.cid = ret.result.cid;
        env.addr = ret.result.current.address;
        console.log(env);

        //创建一个道具
        ret = await this.core.service.gamegoldHelper.execute('prop.create', [env.cid, oid, 10000]);
        if(!!ret) {
            env.hash = ret.result.hash;
            env.pid = ret.result.pid;
        }
        await (async (time) => {return new Promise(resolve => {setTimeout(resolve, time);});})(1000);

        ret = await this.core.service.gamegoldHelper.execute('prop.send', [env.addr, env.pid]);
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
        let test = await this.core.GetMapping(TableType.Test).Create(Math.random().toString());
        return {code: ReturnCode.Success, data: test.item};
    }

    async Creates(user, objData) {
        this.core.GetMapping(TableType.Test).Creates(objData.items, true);
        return {code: ReturnCode.Success};
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
    Delete(user, objData) {
        this.core.GetMapping(TableType.Test).Delete(objData.id, true);
        return {code: ReturnCode.Success};
    }

    Deletes(user, objData) {
        this.core.GetMapping(TableType.Test).Deletes(objData.ids, true);
        return {code: ReturnCode.Success};
    }

    /**
     * 列表
     * @param {*} user 
     * @param {*} objData 
     */
    List(user, objData) {
        let muster = this.core.GetMapping(TableType.Test) //得到 Mapping 对象
            .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
            .orderby('id', 'desc') //根据id字段倒叙排列
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
     * 向消息发送者推送一条消息
     * @param {UserEntity}  user  
     * @param {Object}          objData
     */
    async notify(user, objData) {
        let friend = this.core.GetObject(EntityType.User, `${user.domain}.${objData.id}`, IndexType.Domain);
        if(!!friend) {
            setTimeout(() => {
                friend.notify({type: NotifyType.test, info: {src: user.openid, dst: objData.openid, msg: objData.msg}}); //下行通知
            }, 100)
        }
        
        return {code: ReturnCode.Success};
    }
}

exports = module.exports = test;