/*
 * @Author: jinghh 
 * @Date: 2018-11-22 11:38:53 
 * @Last Modified by: jinghh
 * @Last Modified time: 2019-01-10 16:44:25
 */

let moment = require('moment')
let facade = require('gamecloud')
let { ReturnCode, EntityType, TableField } = facade.const

/**
 * 道具管理类
 * @class prop
 * @extends {facade.Control}
 */
class prop extends facade.Control {
    /**
     *
     * 道具列表
     * @param {*} user
     * @param {*} paramGold
     * @returns
     * @memberof prop
     */
    async List(user, paramGold) {
        let paramArray = paramGold.items;
        if (typeof (paramArray) == "string") {
            paramArray = JSON.parse(paramArray);
        }
        let ret = await this.core.service.RemoteNode.conn(user.cid).execute('prop.list', paramArray);
        return { code: ret.code, data: ret.result };
    }

    /**
     * 制备道具并发放给指定地址，相当于同时执行了 prop.creae 和 prop.send
     * @param {*} user
     * @param {*} payload
     * @returns
     * @memberof prop
   */
    async PropSendListRemote(user, payload) {
        if (!payload) {
            return { code: -1, msg: '参数不正确' };
        }

        let params = payload.data;
        if (!params.id) {
            return { code: -1, msg: '道具ID不正确' };
        }
        if (typeof params.addr == "string") {
            params.addr = JSON.parse(params.addr);
        }
        let addr = params.addr;
        if (!Array.isArray(addr)) {
            return { code: -1, msg: '接收地址不正确' };
        }
        if (addr.length <= 0) {
            return { code: -1, msg: '接收地址不能为空' };
        }

        let props_rank = 3;
        let props_price = params.props_price;
        let cid = params.cid;
        let oid = params.id;

        let rank = parseInt(props_rank);
        if (rank == 1) {
            rank = 0.05;
        } else if (rank == 2) {
            rank = 0.1;
        } else if (rank == 3) {
            rank = 0.2;
        } else if (rank == 4) {
            rank = 0.5;
        } else if (rank == 5) {
            rank = 0.8;
        } else {
            return { code: -2, msg: '道具含金量值错误' };
        }

        props_price = Math.round(props_price*rank); //取整
        if (props_price <= 0) {
            return { code: -1, msg: '道具含金量不正确' };
        }
        if (cid == '') {
            return { code: -1, msg: '道具游戏cid不正确' };
        }
        if (oid == '') {
            return { code: -1, msg: '道具id不正确' };
        }

        let ret = [];
        for (let i = 0; i < addr.length; i++) {
            let retOrderOld = await this.core.service.RemoteNode.conn(user.cid).execute('prop.order', [cid, oid, props_price, addr[i]]);
            if(!!retOrderOld && retOrderOld.result) {
                ret.push(retOrderOld.result);
            }
        }
        return { code: ReturnCode.Success, data: ret };
    }

    /**
     * 根据游戏cp地址获取道具列表
     * @param {*} user
     * @param {*} objData
     * @returns
     * @memberof prop
     */
    async getPropsByGame(user, objData) {
        let fetch = require("node-fetch");
        let res = await fetch(`${objData.cp_url}/info`, { mode: 'cors' });
        res = await res.json();
        let proplist = res.proplist || [];
        return proplist;
    }

    /**
     * 从数据库中获取所有列表
     * 客户端直接调用此方法
     * jinghh 用做创建道具获取所有游戏
     */
    async ListAllCpRecord() {
        let paramArray = new Array();
        let resList = this.core.GetMapping(EntityType.Cp)
            .groupOf()
            .where(paramArray)
            .orderby('id', 'desc')
            .records(TableField.Cp);
        let $data = {};
        let $idx = 0;
        for (let $value of resList) {
            $data[$idx] = {
                id: $value['id'], cp_id: $value['cp_id'], cp_text: $value['cp_text'], cp_type: $value['cp_type'], cp_state: $value['cp_state'],
                cp_url: $value['cp_url'], publish_time: $value['publish_time'], rank: $idx
            };;
            $idx++;

        }
        return { code: ReturnCode.Success, data: $data };
    }
}

exports = module.exports = prop;
