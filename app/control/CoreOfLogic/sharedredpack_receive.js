let facade = require('gamecloud');
let { ReturnCode, NotifyType, TableType, TableField } = facade.const;

/**
 * 游戏的控制器
 */
class sharedredpack_receive extends facade.Control {
    /**
     * 查询红包发放记录
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

            if (new Date().getTime()/1000 - sendData.modify_date > 24*3600) {
                sendData.state_id = 3; //红包过期
                rps.setAttr('state_id', 3);
            }

            if (sendData.state_id == 1) {
                //首次查询，获取实际已领取的记录数。
                let actual_num = this.ListRecord(user, {
                    id: objData.id,
                    size: -1,  //设置获取所有记录
                    all:1,
                }).data.list.length;
                if (sendData.total_num == actual_num) {
                    sendData.state_id = 2; //已领完
                    rps.setAttr('state_id',2);
                }
            }
            
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
                    receiveData.setAttr("receive_uid", user.id);
                    receiveData.setAttr("modify_date", new Date().getTime()/1000);

                    await this.core.service.gamegoldHelper.execute('tx.send', [
                        user.baseMgr.info.getAttr('block_addr'), //发送到用户默认地址
                        parseInt(receiveData.getAttr("receive_amount")),
                        'rpsAgent'
                    ]); 
                    break;//跳出循环
                }
            }

            //将数据返回给客户端
            return { code: 0, data: sendData };
        }
        return { code: -1 };
    }
}

exports = module.exports = sharedredpack_receive;
