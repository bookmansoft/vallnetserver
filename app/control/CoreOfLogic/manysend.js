let facade = require('gamecloud');
let { ReturnCode, NotifyType, TableType, TableField } = facade.const;

/**
 * 游戏的控制器
 */
class manysend extends facade.Control {
    /**
     * 删除记录
     * @param {*} user 
     * @param {*} objData 
     */
    DeleteRecord(user, objData) {
        try {
            this.core.GetMapping(TableType.manysend).Delete(objData.id, true);
            return { code: ReturnCode.Success, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "manysend.DeleteRecord方法出错" };
        }

    }
    /**
     * 修改数据库记录
     * @param {*} user 
     * @param {*} objData 
     */
    UpdateRecord(user, objData) {
        try {
            console.log(JSON.stringify(objData));
            console.log(objData.id);
            let manysend = this.core.GetObject(TableType.manysend, parseInt(objData.id));
            if (!!manysend) {
                //需要针对各个属性增加为null的判断；如果为null的情况下，则
                manysend.setAttr('total_amount', objData.total_amount);
                manysend.setAttr('actual_amount', objData.actual_amount);
                manysend.setAttr('total_num', parseInt(objData.total_num));
                manysend.setAttr('send_uid', parseInt(objData.send_uid));
                manysend.setAttr('send_nickname', parseInt(objData.send_nickname));
                manysend.setAttr('send_headimg', parseInt(objData.send_headimg));
                manysend.setAttr('wishing', objData.wishing);
                manysend.setAttr('modify_date', parseInt(objData.modify_date));
                console.log("60 ok");
                manysend.Save();
                console.log("62 ok");
                return { code: ReturnCode.Success };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "manysend.UpdateRecord方法出错" };
        }

    }
    /**
     * 增加数据库记录。
     * 此方法被从页面入口的Create方法所调用
     * @param {*} user 
     * @param {*} objData 
     */
    async CreateRecord(user, objData) {
        try {
            let manysend = await this.core.GetMapping(TableType.manysend).Create(
                objData.total_amount,
                objData.actual_amount,
                objData.total_num,
                objData.send_uid,
                objData.send_nickname,
                objData.send_headimg,
                objData.wishing,
                objData.modify_date,
            );
            if (manysend == null) {
                return { code: -1, msg: "违反唯一性约束" }
            }
            else {
                return { code: 0, data: null };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "manysend.CreateRecord方法出错" };
        }
    }

    /**
     * 查看单个记录
     * @param {*} user 
     * @param {*} objData 
     */
    Retrieve(user, objData) {
        try {
            //根据上行id查找test表中记录, 注意在 get 方式时 id 不会自动由字符串转换为整型
            let manysend = this.core.GetObject(TableType.manysend, parseInt(objData.id));
            if (!!manysend) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        total_amount: manysend.getAttr('total_amount'),
                        actual_amount: manysend.getAttr('actual_amount'),
                        total_num: manysend.getAttr('total_num'),
                        send_uid: manysend.getAttr('send_uid'),
                        send_nickname: manysend.getAttr('send_nickname'),
                        send_headimg: manysend.getAttr('send_headimg'),
                        wishing: manysend.getAttr('wishing'),
                        modify_date: manysend.getAttr('modify_date'),
                    },

                };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "manysend.Retrieve方法出错" };
        }
    }


    /**
     * 从数据库中获取列表
     * 客户端直接调用此方法
     * @param {*} user 
     * @param {*} objData 查询及翻页参数，等整体调通以后再细化。
     */
    ListRecord(user, objData) {
        try {
            if (objData == null) {
                objData = {};
            }
            let currentPage = objData.currentPage;
            console.log(Number.isNaN(parseInt(currentPage)));
            if (Number.isNaN(parseInt(currentPage))) {
                currentPage = 1;
            }

            //构造查询条件
            //id=3
            let paramArray = new Array();
            if (!!objData.send_uid) {
                console.log(`send_uid 参数查询本人发送的所有红包: ${objData.send_uid}`);
                paramArray.push(['send_uid', objData.send_uid]);
            }

            //得到 Mapping 对象
            let muster = this.core.GetMapping(TableType.manysend)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .where(paramArray)
                .orderby('id', 'desc') //根据id字段倒叙排列
                .paginate(10, currentPage);

            let $data = { items: {}, list: [], pagination: {} };
            //扩展分页器对象
            $data.pagination = { "total": muster.pageNum * 10, "pageSize": 10, "current": muster.pageCur };
            $data.total = muster.pageNum;
            $data.page = muster.pageCur;

            let $idx = (muster.pageCur - 1) * muster.pageSize;
            $idx = $idx + 5;
            for (let $value of muster.records(TableField.manysend)) {
                $data.items[$idx] = $value;
                $value['rank'] = $idx++;
            }

            //转化并设置数组属性
            $data.list = Object.keys($data.items).map(key => $data.items[key]);

            return {code: 0, data: $data};
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "manysend.ListRecord方法出错" };
        }
    }

    //-- 以下是业务方法 --------------------------------------------------------------------
    /**
     * 发送红包
     * 增加manysend的一条数据库记录。
     * 增加manyreceive的若干条数据库记录。
     * 转账到指定账号。
     * @param {*} user 
     * @param {*} objData 
     */
    async Send(user, objData) {
        try {
            //写发送表 - todo 20190604 liub 这里提示 Field 'send_uid' doesn't have a default value
            let manysend = await this.core.GetMapping(TableType.manysend).Create(
                objData.total_amount,
                objData.total_amount, //actual_amount等同于输入参数total_amount
                objData.total_num,
                user.id,
                user.baseMgr.info.getAttr('nickname'),
                user.baseMgr.info.getAttr("avatar_uri"),
                objData.wishing,
                new Date().getTime()/1000,
                1,//状态：正常
            );
            console.log("执行创建成功了吗？",manysend.ormAttr("id"));
            if (manysend == null) {
                return { code: -1, msg: "违反唯一性约束" }
            }
            //将金额拆分到total_num个包中
            let receive_amount=new Array(objData.total_num);
            let left_amount=objData.total_amount;   //剩余金额
            for (var i=0;i<receive_amount.length;i++) {
                if (i==receive_amount.length-1) {
                    receive_amount[i]=left_amount;
                }
                else {
                    //剩余未分配的元素个数；包括这一个
                    let left_num=receive_amount.length-i;
                    receive_amount[i]=Math.random()*left_amount/left_num;
                    //重新更新剩余金额
                    left_amount=left_amount-receive_amount[i];
                }
            }
            //发送到指定账号
            //cid 用固定的manyagent创建 687a8b10-5a91-11e9-9a3f-bfc33c24ad96
            let retCp=await this.core.service.gamegoldHelper.execute('cp.byName', ['manyagent']);
            console.log("248 cpid:",retCp.result);
            let agent_cid=retCp.result.cid;
            let agent_uid=manysend.ormAttr("id");//对应此地址的id
            console.log("251:",agent_cid,agent_uid);
            let ret = await this.core.service.gamegoldHelper.execute('token.user', [agent_cid,agent_uid,null,'manyagent']);
            console.log("token.user返回的地址",ret.result.data.addr);
            let retSend = await this.core.service.gamegoldHelper.execute('tx.send', [
                ret.result.data.addr,
                objData.total_amount,
                user.domainId,
            ]); 
            // 接收表
            for (var i=0;i<receive_amount.length;i++) {
                await this.core.GetMapping(TableType.manyreceive).Create(
                    manysend.ormAttr("id"),
                    receive_amount[i],
                    user.id,
                    user.baseMgr.info.getAttr("nickname"),
                    user.baseMgr.info.getAttr("avatar_uri"),
                    null,
                    null,
                    null,
                    null,
                );
            }
            return { code: 0, data: manysend.ormAttr("id") };
        } catch (error) {
            console.log(error);
            return { code: -1, msg: "manysend.Send 方法出错" };
        }
    }
}

exports = module.exports = manysend;
