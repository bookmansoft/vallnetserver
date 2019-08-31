let facade = require('gamecloud');
let { EntityType, TableType, TableField } = facade.const;

/**
 * 游戏的控制器
 */
class sharedredpack_receive extends facade.Control {
    /**
     * 查询红包领取记录
     * @param {*} user 
     * @param {*} objData
     */
    ListRecord(user, objData) {
        objData = objData || {};

        //构造查询条件
        let paramArray = [];
        if (!!objData.id) { //查询指定红包
            paramArray.push(['send_id', objData.id]);
        }
        if (!objData.all) { //限定查询自己的记录, 除非显示携带 all 参数
            paramArray.push(['receive_uid', user.id]);
        }

        let muster = this.core.GetMapping(TableType.sharedredpack_receive)
            .groupOf()
            .where(paramArray)
            .orderby('id', 'asc')
            .paginate(objData.size||10, objData.page||1);

        let $data = { list: []};
        $data.total = muster.pageNum;
        $data.page = muster.pageCur;

        let $idx = 0;
        for (let $value of muster.records(TableField.sharedredpack_receive)) {
            //如果该标志为1，则是从服务端发起的，需要获取全部记录
            if (objData.server_flag == 1 || !!$value['receive_uid']) {
                $value['rank'] = $idx++;

                let rps = this.core.GetObject(TableType.sharedredpack, $value['send_id']);
                if(!!rps) {
                    let sender = this.core.GetObject(EntityType.User, rps.orm.send_uid);
                    if(!!sender) {
                        $value.send_headimg = sender.baseMgr.info.getAttr("avatar_uri");
                        $value.send_nickname = sender.name;
                    }
                }
                let recv = this.core.GetObject(EntityType.User, $value['receive_uid']);
                if(!!recv) {
                    $value.recv_headimg = recv.baseMgr.info.getAttr("avatar_uri");
                    $value.recv_nickname = recv.name;
                }

                $data.list.push($value);
            }
        }

        return {code: 0, data: $data};
    }

    /**
     * 打开红包，收取随机份额
     * @param {*} user 
     * @param {*} objData 
     */
    async Receive(user, objData) {
        let rps = this.core.GetObject(TableType.sharedredpack, parseInt(objData.id));
        if (!!rps) {
            let sendData = TableField.record(rps, TableField.sharedredpack);
            let sender = this.core.GetObject(EntityType.User, sendData.send_uid);
            if(!!sender) {
                sendData.send_headimg = sender.baseMgr.info.getAttr("avatar_uri");
                sendData.send_nickname = sender.name;
            }

            let receiveList = [];

            //判断红包是否过期，注意 state_id 为 0 或 1 都会过期
            if (new Date().getTime()/1000 - sendData.modify_date > 24*3600) {
                sendData.state_id = 3; 
                rps.setAttr('state_id', 3);
            }

            if(sendData.state_id == 1 || sendData.state_id == 2) {
                //首次查询，获取已领取记录集合, 该集合将下发客户端
                receiveList = this.ListRecord(user, {
                    id: objData.id,
                    size: -1,  //设置获取所有记录
                    all:1,
                }).data.list;

                let actual_num = receiveList.length;
                if (sendData.total_num == actual_num) {
                    sendData.state_id = 2; //已领完
                    rps.setAttr('state_id',2);
                }

                //再次查询，获取所有记录
                let srp_receive = this.ListRecord(user, {
                    id: objData.id,
                    server_flag: 1,     //设置获取所有记录
                    size: -1,           //设置获取所有记录
                    all:1,
                }).data;
                
                //依次遍历，获取到第一个没有接收人的红包位置，并占据这个位置
                for (let i = 0; i < srp_receive.list.length; i++) {
                    //先判断是否已经获取到本人的领取记录
                    if (srp_receive.list[i].receive_uid == user.id) {
                        //已领取过了.获取到本人记录后，应该直接退出
                        sendData.real_amount = srp_receive.list[i].receive_amount; //设置接收金额
                        break;
                    }

                    //如果状态正常，且存在空记录，则可以领取红包
                    if (sendData.state_id == 1 && !srp_receive.list[i].receive_uid) {
                        sendData.real_amount = srp_receive.list[i].receive_amount;//设置接收金额

                        let receiveData = this.core.GetObject(TableType.sharedredpack_receive, parseInt(srp_receive.list[i].id));

                        let rt = await this.core.service.gamegoldHelper.execute('tx.send', [
                            user.baseMgr.info.getAttr('acaddr'), //发送到用户默认地址
                            parseInt(receiveData.getAttr("receive_amount")),
                            'rpsAgent'
                        ]); 
                        if(rt.code == 0) {
                            receiveData.setAttr("hash", rt.result.hash);
                            receiveData.setAttr("receive_uid", user.id);
                            receiveData.setAttr("modify_date", new Date().getTime()/1000);

                            receiveList.push(TableField.record(receiveData, TableField.sharedredpack_receive));
                        }

                        break;//跳出循环
                    }
                }
            }

            return { code: 0, data: {send: sendData, receive: receiveList} };
        }
        return { code: -1 };
    }
}

exports = module.exports = sharedredpack_receive;
