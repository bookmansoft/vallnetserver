let facade = require('gamecloud');
let { ReturnCode, EntityType, TableField } = facade.const;

/**
 * 游戏的控制器
 */
class sharedredpack extends facade.Control {
    /**
     * 从数据库中获取列表
     * @param {*} user 
     * @param {*} objData
     */
    ListRecord(user, objData) {
        if (!objData) {
            objData = {};
        }
        let currentPage = objData.currentPage;
        console.log(Number.isNaN(parseInt(currentPage)));
        if (Number.isNaN(parseInt(currentPage))) {
            currentPage = 1;
        }

        //构造查询条件
        let paramArray = new Array();
        paramArray.push(['send_uid', user.id]);

        //得到 Mapping 对象
        let muster = this.core.GetMapping(EntityType.sharedredpack)
            .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
            .where(paramArray)
            .orderby('id', 'desc') //根据id字段倒叙排列
            .paginate(10, currentPage);

        let $data = { list: [] };
        $data.total = muster.pageNum;
        $data.page = muster.pageCur;

        let $idx = (muster.pageCur - 1) * muster.pageSize;
        $idx = $idx + 5;
        for (let $value of muster.records(TableField.sharedredpack)) {
            let sender = this.core.GetObject(EntityType.User, $value.send_uid);
            if(!!sender) {
                $value.send_headimg = sender.baseMgr.info.getAttr("avatar_uri");
                $value.send_nickname = sender.name;
            }
            $value['rank'] = $idx++;
            $data.list.push($value);
        }

        return {code: 0, data: $data};
    }

    /**
     * 查看单个记录
     * @param {*} user 
     * @param {*} objData 
     */
    Retrieve(user, objData) {
        let rps = TableField.record(this.core.GetObject(EntityType.sharedredpack, parseInt(objData.id)), TableField.sharedredpack);
        if (!!rps) {
            let sender = this.core.GetObject(EntityType.User, rps.send_uid);
            if(!!sender) {
                rps.send_headimg = sender.baseMgr.info.getAttr("avatar_uri");
                rps.send_nickname = sender.name;
            }
            return {
                code: ReturnCode.Success,
                data: rps,
            };
        }
        return { code: -1, data: null };
    }

    /**
     * 发送多人红包
     * 1. 为表 sharedredpack 增加一条新的记录
     * 2. 将红包全额转账到指定账号
     * 3. 为表 sharedredpack_receive 添加相应的分拆记录
     * @param {*} user 
     * @param {*} objData 
     */
    async Send(user, objData) {
        //生成红包记录
        let srp = await this.core.GetMapping(EntityType.sharedredpack).Create({
            total_amount: objData.total_amount,
            total_num: objData.total_num,
            send_uid: user.id,
            wishing: objData.wishing,
            modify_date: new Date().getTime()/1000,
            state_id: 0, //表示业务尚未成功 - todo 对不成功的记录，要增加事后追溯的能力
        });

        if (!srp) {
            return { code: -1 }
        }

        //发送到指定账号
        let ret = await this.core.service.gamegoldHelper.execute('token.user', ['redpack', srp.orm.id, null,'redpackAccount']);
        if(ret.code == 0) {
            ret = await this.core.service.gamegoldHelper.execute('tx.send', [
                ret.result.data.addr,
                objData.total_amount,
                user.account,
            ]); 

            if(ret.code != 0) {
                return { code: -3 }
            }
            srp.setAttr('state_id', 1);
            srp.setAttr('hash', ret.result.hash);
        } else {
            return { code: -2 }
        }

        //#region 拆分为多条记录
        let receive_amount = new Array(objData.total_num);
        let left_amount = objData.total_amount; //剩余金额
        for (let i=0; i < receive_amount.length; i++) {
            if (i == receive_amount.length-1) {
                receive_amount[i] = left_amount; //剩余金额一次性分配
            } else {
                let left_num = receive_amount.length - i; //剩余未分配的元素个数
                receive_amount[i] = Math.min(left_amount*0.5, Math.random()*2*left_amount/left_num) | 0; //随机分配额度，取整
                left_amount = left_amount - receive_amount[i]; //更新剩余金额
            }

            await this.core.GetMapping(EntityType.sharedredpack_receive).Create({
                send_id: srp.orm.id,
                receive_amount: (receive_amount[i]*0.98)|0, //扣除2%手续费
                modify_date: Date.parse(new Date())/1000,
            });
        }
        //#endregion

        return { code: 0, data: srp.orm.id };
    }
}

exports = module.exports = sharedredpack;
