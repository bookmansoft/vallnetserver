let facade = require('gamecloud');
let { ReturnCode, NotifyType, TableType } = facade.const;

/**
 * 游戏的控制器
 */
class manyreceive extends facade.Control {
    /**
     * 删除记录
     * @param {*} user 
     * @param {*} objData 
     */
    DeleteRecord(user, objData) {
        try {
            this.core.GetMapping(TableType.ManyReceive).Delete(objData.id, true);
            return { code: ReturnCode.Success, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manyreceive.DeleteRecord方法出错" };
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
            let manyreceive = this.core.GetObject(TableType.ManyReceive, parseInt(objData.id));
            if (!!manyreceive) {
                //需要针对各个属性增加为null的判断；如果为null的情况下，则
                manyreceive.setAttr('send_id', objData.send_id);
                manyreceive.setAttr('receive_amount', objData.receive_amount);
                manyreceive.setAttr('send_uid', parseInt(objData.send_uid));
                manyreceive.setAttr('send_nickname', parseInt(objData.send_nickname));
                manyreceive.setAttr('send_headimg', parseInt(objData.send_headimg));
                manyreceive.setAttr('receive_uid', parseInt(objData.receive_uid));
                manyreceive.setAttr('receive_nickname', objData.receive_nickname);
                manyreceive.setAttr('receive_headimg', objData.receive_headimg);
                manyreceive.setAttr('modify_date', parseInt(objData.modify_date));
                console.log("60 ok");
                manyreceive.Save();
                console.log("62 ok");
                return { code: ReturnCode.Success };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manyreceive.UpdateRecord方法出错" };
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
            let manyreceive = await this.core.GetMapping(TableType.ManyReceive).Create(
                objData.send_id,
                objData.receive_amount,
                objData.send_uid,
                objData.send_nickname,
                objData.send_headimg,
                objData.receive_uid,
                objData.receive_nickname,
                objData.receive_headimg,
                objData.modify_date,
            );
            console.log("执行创建成功了吗？");
            if (manyreceive == null) {
                return { code: -1, message: "违反唯一性约束" }
            }
            else {
                return { code: 0, data: null };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manyreceive.CreateRecord方法出错" };
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
            let manyreceive = this.core.GetObject(TableType.ManyReceive, parseInt(objData.id));
            console.log(manyreceive);
            if (!!manyreceive) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        send_id: manyreceive.getAttr('send_id'),
                        receive_amount: manyreceive.getAttr('receive_amount'),
                        send_uid: manyreceive.getAttr('send_uid'),
                        send_nickname: manyreceive.getAttr('send_nickname'),
                        send_headimg: manyreceive.getAttr('send_headimg'),
                        receive_uid: manyreceive.getAttr('receive_uid'),
                        receive_nickname: manyreceive.getAttr('receive_nickname'),
                        receive_headimg: manyreceive.getAttr('receive_headimg'),
                        modify_date: manyreceive.getAttr('modify_date'),
                    },

                };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manyreceive.Retrieve方法出错" };
        }
    }


    /**
     * 从数据库中获取列表
     * 此方法是业务方法，会排除掉实际未发送的红包，只留下已发送的红包
     * @param {*} user 
     * @param {*} objData send_id;receive_flag
     */
    ListRecord(user, objData) {
        try {
            console.log("manyreceive.ListRecord:", objData);
            if (objData == null) {
                objData = {};
            }
            let currentPage = 1;
            //构造查询条件
            let paramArray = new Array();
            if (typeof (objData.id) != "undefined" && (objData.id != "")) {
                console.log(`send_id 参数查询本红包组中的所有红包: ${objData.id}`);
                let tmp = ['send_id', '==', objData.id];
                paramArray.push(tmp);
            }
            if (typeof (objData.receive_uid) != "undefined" && (objData.receive_uid != "")) {
                console.log(`receive_uid 参数查询本人接收的所有红包: ${objData.receive_uid}`);
                let tmp = ['receive_uid', '==', objData.receive_uid];
                paramArray.push(tmp);
            }

            console.log(paramArray);
            //得到 Mapping 对象
            let muster = this.core.GetMapping(TableType.ManyReceive)
                .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
                .where(paramArray)
                .orderby('id', 'asc') //根据id字段正序排列
                .paginate(100, currentPage);

            let $data = { items: {}, list: [], pagination: {} };
            //扩展分页器对象
            $data.pagination = { "total": muster.pageNum * 100, "pageSize": 100, "current": muster.pageCur };
            $data.total = muster.pageNum;
            $data.page = muster.pageCur;

            let $idx = 0;
            for (let $value of muster.records(['id', 'send_id', 'receive_amount', 'send_uid', 'send_nickname', 'send_headimg', 'receive_uid', 'receive_nickname', 'receive_headimg', 'modify_date'])) {
                //如果该标志为1，则是从服务端发起的，需要获取全部记录，即恒为true
                if (objData.server_flag==1 || $value['receive_uid']!=null) {
                    $data.items[$idx] = $value;
                    $value['rank'] = $idx++;
                }
            }

            //转化并设置数组属性
            $data.list = Object.keys($data.items).map(key => $data.items[key]);
            //console.log($data);
            return $data;
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manyreceive.ListRecord方法出错" };
        }
    }

    /**
     * 打开接受红包。合并了send.get与receive.list方法的内容
     * @param {*} user 
     * @param {*} objData 
     */
    async Receive(user, objData) {
        try {
            //获取到发送的记录
            let manysend = this.core.GetObject(TableType.ManySend, parseInt(objData.id));
            //console.log(manysend);
            if (!!manysend) {
                let manysendData = {
                    total_amount: manysend.getAttr('total_amount'),
                    actual_amount: manysend.getAttr('actual_amount'),
                    total_num: manysend.getAttr('total_num'),
                    send_uid: manysend.getAttr('send_uid'),
                    send_nickname: manysend.getAttr('send_nickname'),
                    send_headimg: manysend.getAttr('send_headimg'),
                    wishing: manysend.getAttr('wishing'),
                    modify_date: manysend.getAttr('modify_date'),
                    state_id: manysend.getAttr('state_id'),
                    state_name: '',
                };
                console.log(manysendData);
                //检查设置state_id状态 ，并更新到数据库中
                if (manysendData.state_id==1) { //仅对正常状态生效
                    //首次查询，获取实际已领取的记录数。
                    let actual_num=this.ListRecord(user, objData).list.length;
                    if (manysendData.total_num==actual_num) {
                        console.log("已领完");
                        manysendData.state_id=2;
                        //更新到数据库中。
                        manysend.setAttr('state_id',2);
                        manysend.Save();
                    }
                    else if (new Date().getTime()/1000 - manysendData.modify_date > 24*3600) {
                        console.log("红包过期啦");
                        manysendData.state_id=3;
                        //更新到数据库中。
                        manysend.setAttr('state_id',3);
                        manysend.Save();
                    }
                    

                }
                
                //经过上述处理，如果仍然是状态1，则确定可以抢红包。否则忽略抢红包逻辑
                if (manysendData.state_id==1) { //仍然是正常状态
                    //依次遍历，获取到第一个没有接收人的红包位置，并占据这个位置。
                    objData.server_flag=1;  //设置获取所有记录，包括未填写收件人的记录
                    let manyreceive = this.ListRecord(user, objData);
                    console.log("全部接收列表数据（含空记录）:", manyreceive.list);
                    //遍历并寻找第一个空记录
                    for (var i=0;i<manyreceive.list.length;i++) {
                        //前面的部分，先判断是否已经获取到本人的领取记录
                        if (manyreceive.list[i].receive_uid==user.id) {
                            //已领取过了.获取到本人记录后，应该直接退出
                            manysendData.real_amount=manyreceive.list[i].receive_amount;//设置接收金额
                            break;
                        }

                        //获取到空记录，说明存在记录。
                        if (manyreceive.list[i].receive_uid==null) {
                            console.log("第一条空记录",manyreceive.list[i].id);
                            manysendData.real_amount=manyreceive.list[i].receive_amount;//设置接收金额
                            console.log("manyreceive.js 274:",user.id);
                            //重新单独获取收件表的记录才能更新
                            let receiveData = this.core.GetObject(TableType.ManyReceive, parseInt(manyreceive.list[i].id));
                            receiveData.setAttr("receive_uid",user.id);
                            receiveData.setAttr("receive_nickname",user.baseMgr.info.getAttr("nickname"));
                            receiveData.setAttr("receive_headimg",user.baseMgr.info.getAttr("avatar_uri"));
                            receiveData.setAttr("modify_date",new Date().getTime()/1000);
                            receiveData.Save();
                            let retAddr=await this.core.service.gamegoldHelper.execute('address.receive', [user.openid]);
                            let retSend = await this.core.service.gamegoldHelper.execute('tx.send', [
                                retAddr.result,
                                parseInt(receiveData.getAttr("receive_amount")),
                                'manyagent'
                            ]); 
                            break;//跳出循环
                        }
                    }
                }
                else {
                    //虽然是已领完或者已过期状态，但是本人领取过，仍然按state=1处理
                    console.log("299 已领完或已过期");
                    objData.server_flag=1;  //设置获取所有记录，包括未填写收件人的记录
                    let manyreceive = this.ListRecord(user, objData);
                    // console.log("全部接收列表数据（含空记录）:", manyreceive.list);
                    //遍历并寻找第一个空记录
                    for (var i=0;i<manyreceive.list.length;i++) {
                        //前面的部分，先判断是否已经获取到本人的领取记录
                        if (manyreceive.list[i].receive_uid==user.id) {
                            console.log("307 找到领取记录");
                            //已领取过了.获取到本人记录后，应该直接退出
                            manysendData.real_amount=manyreceive.list[i].receive_amount;//设置接收金额
                            manysendData.state_id=1;//设置为正常状态
                            break;
                        }
                    }
                }
                //设置状态名称用于显示
                manysendData.state_name = (manysendData.state_id == 2 ? '红包已领完' : '红包已过期');
                //将数据返回给客户端
                return {
                    data: manysendData,
                    list: manyreceive.list, //实际不使用，重新获取一次；以后可以注释本行
                };
            }
            return { code: -1, data: null };
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "manysend.Retrieve方法出错" };
        }
    }
}

exports = module.exports = manyreceive;
