/*
 * @Author: jinghh 
 * @Date: 2018-11-22 11:38:53 
 * @Last Modified by: jinghh
 * @Last Modified time: 2019-01-10 16:44:25
 */

let moment = require('./../../../node_modules/moment')
let facade = require('gamecloud')
let { ReturnCode, NotifyType } = facade.const
let tableType = require('../../util/tabletype');

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
        let ret = await this.core.service.RemoteNode.conn(user.domainId).execute('prop.list', paramArray);
        console.log(ret);
        //return { code: ReturnCode.Success, data: ret };
        return { code: ret.code, data: ret.result };
    }


    /**
     * 获取本地道具列表
     * @param {*} objData 
     * @returns
     * @memberof prop
     */
    LocalList(user, objData) {
        if (objData == null) {
            objData = {};
        }
        let pageSize = objData.pageSize || 10;
        let currentPage = objData.currentPage || 1;

        let paramArray = [];
        if (!!objData.id) {
            paramArray.push(['id', parseInt(objData.id)]);
        }
        if (!!objData.props_name) {
            paramArray.push(['props_name', objData.props_name]);
        }
        if (!!objData.cid) {
            paramArray.push(['cid', objData.cid]);
        }

        let cpIdText = this.cpIdText();
        cpIdText = cpIdText.data || {};

        //得到 Mapping 对象
        let muster = this.core.GetMapping(tableType.propEntity)
            .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
            .where(paramArray)
            .orderby('id', 'desc') //根据id字段倒叙排列
            .paginate(pageSize, currentPage);

        let $data = { items: {}, list: [], pagination: {} };
        //扩展分页器对象
        $data.pagination = { "total": muster.data.size, "pageSize": parseInt(pageSize), "current": parseInt(muster.pageCur) };
        $data.total = muster.data.size;
        $data.page = muster.pageCur;

        let $idx = (muster.pageCur - 1) * muster.pageSize;
        for (let $value of muster.records(['id', 'props_name', 'props_type', 'cid', 'props_desc', 'icon_url', 'icon_preview', 'status', 'props_price', 'props_rank', 'propsAt', 'cid'])) {
            $data.items[$idx] = $value;
            $value['cp_name'] = cpIdText[$value['cid']] || '';
            $value['rank'] = $idx++;
        }
        $data.list = Object.keys($data.items).map(key => $data.items[key]);
        return $data;
    }

    /**
     *
     *从数据库中获取游戏对应的所有道具列表
     * @param {*} user
     * @param {*} objData
     * @returns
     * @memberof prop
     */
    getAllPropsByParams(user, objData) {
        if (objData == null) {
            objData = {};
        }
        let paramArray = new Array();
        if (typeof (objData.cid) != "undefined" && (objData.cid != "")) {
            paramArray.push(['cid', '==', objData.cid]);
        }
        let resList = this.core.GetMapping(tableType.propEntity) //得到 Mapping 对象
            .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
            .where(paramArray)
            .orderby('id', 'desc') //根据id字段倒叙排列
            .records(['id', 'props_id', 'props_name', 'props_type', 'cid', 'props_desc', 'icon_url', 'icon_preview', 'status', 'props_price', 'props_rank', 'propsAt']);

        let cpIdText = this.cpIdText();
        cpIdText = cpIdText.data || {};

        let $data = {};
        let $idx = 0;
        for (let $value of resList) {
            $data[$idx] = {
                id: $value['id'], props_id: $value['props_id'], props_name: $value['props_name'], props_type: $value['props_type'], cid: $value['cid'], props_desc: $value['props_desc'],
                icon_url: $value['icon_url'], icon_preview: $value['icon_preview'], status: $value['status'],
                props_price: $value['props_price'], props_rank: $value['props_rank'], propsAt: $value['propsAt'], cp_name: cpIdText[$value['cid']] || '', rank: $idx, create_res: $value['create_res']
            };
            $idx++;
        }
        return { code: ReturnCode.Success, data: $data };
    }
    /**
     * 查看单个记录
     * @param {*} user 
     * @param {*} objData 
     */
    LocalDetail(user, objData) {
        if (objData == null) {
            return { code: -1 };
        }
        let cpIdText = this.cpIdText();
        let cpIdUrl = this.cpIdUrl();
        cpIdText = cpIdText.data || {};
        cpIdUrl = cpIdUrl.data || {};
        //根据上行id查找表中记录, 注意在 get 方式时 id 不会自动由字符串转换为整型
        let prop = this.core.GetObject(tableType.propEntity, parseInt(objData.id));
        if (!!prop) {
            return {
                code: ReturnCode.Success,
                data: {
                    id: prop.getAttr('id'),
                    props_id: prop.getAttr('props_id'),
                    props_name: prop.getAttr('props_name'),
                    props_type: prop.getAttr('props_type'),
                    cid: prop.getAttr('cid'),
                    props_desc: prop.getAttr('props_desc'),
                    icon_url: prop.getAttr('icon_url'),
                    icon_preview: prop.getAttr('icon_preview'),
                    status: prop.getAttr('status'),
                    props_price: prop.getAttr('props_price'),
                    props_rank: prop.getAttr('props_rank'),
                    propsAt: prop.getAttr('propsAt'),
                    createdAt: prop.getAttr('createdAt'),
                    updatedAt: prop.getAttr('updatedAt'),
                    cp_name: cpIdText[prop.getAttr('cid')] || '',
                    cp_url: cpIdUrl[prop.getAttr('cid')] || '',
                },

            };
        }
        return { code: -1 };
    }
    /**
    * 道具保存本地
    * @param {*} user
    * @param {*} paramGold
    * @returns
    * @memberof prop
    */
    async CreateLocal(user, paramGold) {
        if(typeof paramGold.icon_preview != 'string') {
            paramGold.icon_preview = JSON.stringify(paramGold.icon_preview);
        }

        if (paramGold == null) {
            return { code: -1, msg: '参数不能为空' };
        }
        if (typeof paramGold.props_id == 'undefined' || paramGold.props_id == '') {
            return { code: -1, msg: '道具ID不能为空' };
        }
        if (typeof paramGold.props_name == 'undefined' || paramGold.props_name == '') {
            return { code: -1, msg: '道具名称不能为空' };
        }
        if (typeof paramGold.cid == 'undefined' || paramGold.cid == '') {
            return { code: -1, msg: '游戏厂家cid不能为空' };
        }
        if (typeof paramGold.props_desc == 'undefined' || paramGold.props_desc == '') {
            return { code: -1, msg: '道具描述不能为空' };
        }
        if (typeof paramGold.icon_url == 'undefined' || paramGold.icon_url == '') {
            return { code: -1, msg: '道具图标不能为空' };
        }
        if (typeof paramGold.icon_preview == 'undefined' || paramGold.icon_preview == '') {
            return { code: -1, msg: '道具图标列表不能为空' };
        }
        if (typeof paramGold.props_price == 'undefined' || paramGold.props_price == '') {
            return { code: -1, msg: '道具游戏金量不能为空' };
        }
        if (typeof paramGold.props_rank == 'undefined' || paramGold.props_rank == '') {
            return { code: -1, msg: '道具含金等级不能为空' };
        }
        if (typeof paramGold.status == 'undefined' || paramGold.status == '') {
            paramGold.status = 1;
        }
        let time = moment().format('YYYY-MM-DD HH:mm:ss');
        if (typeof paramGold.propsAt == 'undefined' || paramGold.propsAt == '') {
            paramGold.propsAt = time;
        }
        let props_price = parseInt(paramGold.props_price);
        if (props_price <= 0) {
            props_price = 10000;//默认
        }
        let res = '';
        //查找是否有props_id存在的记录
        let paramArray = new Array();
        paramArray.push(['props_id','==', paramGold.props_id]);
        let isExists = this.core.GetMapping(tableType.propEntity)
            .groupOf()
            .where(paramArray)
            .records(['id']);
        if(typeof isExists !='undefined' && isExists != '' && isExists.length >0){
            return { code: 3, msg: "props is exists" };
        }
        try{
             res = await this.core.GetMapping(tableType.propEntity).Create(
                paramGold.props_id,
                paramGold.props_name,
                paramGold.props_type,
                paramGold.cid,
                paramGold.props_desc,
                paramGold.icon_url,
                paramGold.icon_preview,
                paramGold.status,
                paramGold.props_price,
                paramGold.props_rank,
                paramGold.propsAt,
                time,
                time,
            );
            return { code: ReturnCode.Success,msg: "成功" , data: res.orm };

        }catch (error) {
            console.log(error);
            return { code: -1, data: error, msg: "数据保存失败" };
        }
        
    }
    /**
    * 道具根据游戏接口修改
    * @param {*} objData 
    */
    async EditProp(user, objData) {
        if (objData == null) {
            objData = {};
        }
        let id = typeof (objData.id) != "undefined" && (objData.id != "") ? parseInt(objData.id) : '';
        let props_id = typeof (objData.props_id) != "undefined" ? objData.props_id : '';
        let status = typeof (objData.status) != "undefined" ? objData.status : '';
        let props_name = typeof (objData.props_name) != "undefined" ? objData.props_name : '';
        let props_type = typeof (objData.props_type) != "undefined" ? objData.props_type : '';
        let props_desc = typeof (objData.props_desc) != "undefined" ? objData.props_desc : '';
        let icon_url = typeof (objData.icon_url) != "undefined" ? objData.icon_url : '';
        let icon_preview = typeof (objData.icon_preview) != "undefined" ? objData.icon_preview : '';
        let propsAt = typeof (objData.propsAt) != "undefined" ? objData.propsAt : '';
        if (id == '') {
            return { code: -1 };
        }
        let prop = this.core.GetObject(tableType.propEntity, id);
        if (!!prop) {
            if (props_id != '') {
                prop.setAttr('props_id', props_id);
            }
            if (status != '') {
                prop.setAttr('status', status);
            }
            if (props_name !== '') {
                prop.setAttr('props_name', props_name);
            }
            if (props_type !== '') {
                prop.setAttr('props_type', props_type);
            }
            if (props_desc !== '') {
                prop.setAttr('props_desc', props_desc);
            }
            if (icon_url !== '') {
                prop.setAttr('icon_url', icon_url);
            }
            if (icon_preview !== '') {
                prop.setAttr('icon_preview', icon_preview);
            }
            if (propsAt !== '') {
                prop.setAttr('propsAt', propsAt);
            }
            let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
            prop.setAttr('updatedAt', updatedAt);
            return { code: ReturnCode.Success };
        }
        return { code: -1 };
    }
    /**
     * 制备道具并发放给指定地址，相当于同时执行了 prop.creae 和 prop.send
     * @param {*} user
     * @param {*} paramGold
     * @returns
     * @memberof prop
   */
    async PropSendListRemote(user, paramGold) {

        if (paramGold == null) {
            return { code: -1, msg: '参数不正确' };
        }
        if (typeof paramGold.id == 'undefined' || paramGold.id == '') {
            return { code: -1, msg: '道具ID不正确' };
        }
        if (typeof (paramGold.addr) == "string") {
            paramGold.addr = JSON.parse(paramGold.addr);
        }
        let addr = paramGold.addr;
        if (typeof addr == 'undefined' || addr == '' || !Array.isArray(addr)) {
            return { code: -1, msg: '接收地址不正确' };
        }
        if (addr.length <= 0) {
            return { code: -1, msg: '接收地址不能为空' };
        }
        let id = parseInt(paramGold.id);
        //查找该道具本地详情
        let propDetail = this.core.GetObject(tableType.propEntity, id);
        if (propDetail == '') {
            return { code: -2, msg: '道具信息错误' };
        }

        let proNum = parseInt(addr.length);
        let props_price = propDetail.getAttr('props_price');
        let props_rank = propDetail.getAttr('props_rank');
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
        }else{
            return { code: -2, msg: '道具含金量值错误' };
        }
        props_price = Math.round(props_price*rank); //取整
        let cid =  propDetail.getAttr('cid');
        let oid = propDetail.getAttr('props_id');//道具props_id 唯一
        if (props_price <= 0) {
            return { code: -1, msg: '道具含金量不正确' };
        }
        if (cid == '') {
            return { code: -1, msg: '道具游戏cid不正确' };
        }
        if (oid == '') {
            return { code: -1, msg: '道具id不正确' };
        }
        //prop.order [cid oid gold addr]
        let ret = new Array();
        let k = 0;
        let retOrder = '';
        for (let i = 0; i < proNum; i++) {
            console.log([cid, oid, props_price, addr[i]]);
            let retOrderOld = await this.core.service.RemoteNode.conn(user.domainId).execute('prop.order',[cid, oid, props_price, addr[i]]);
            let retOrder=retOrderOld.result;
            console.log(retOrder);
            if (retOrder != null) {
                k++;
                ret[k] = retOrder;
            }
        }
        if (k == 0) {
            return { code: -1, msg: '道具赠送失败', data: retOrder };
        }
        return { code: ReturnCode.Success, data: ret };

    }

    /**
     * 从数据库中获取所有游戏cp_id => cp_text
     */
    cpIdText() {
        let paramArray = new Array();
        //paramArray.push(['cp_state','==',2]);//读取已上架
        let resList = this.core.GetMapping(tableType.cp)
            .groupOf()
            .where(paramArray)
            .orderby('id', 'desc')
            .records(['cp_id', 'cp_text']);

        let $data = {};
        for (let $value of resList) {
            $data[$value['cp_id']] = $value['cp_text'];
        }
        return { code: ReturnCode.Success, data: $data };
    }

    /**
     * 从数据库中获取所有游戏cp_id => cp_text
     */
    cpIdUrl() {
        let paramArray = new Array();
        //paramArray.push(['cp_state','==',2]);//读取已上架
        let resList = this.core.GetMapping(tableType.cp)
            .groupOf()
            .where(paramArray)
            .orderby('id', 'desc')
            .records(['cp_id', 'cp_url']);
        let $data = {};
        for (let $value of resList) {
            $data[$value['cp_id']] = $value['cp_url'];
        }
        return { code: ReturnCode.Success, data: $data };
    }
    /**
     * control内修改记录
     * @param {*} objData 
     */
    UpdateProp(user, objData) {
        if (objData == null) {
            objData = {};
        }
        let id = typeof (objData.id) != "undefined" && (objData.id != "") ? parseInt(objData.id) : '';
        let status = typeof (objData.status) != "undefined" ? parseInt(objData.status) : '';
        let props_price = typeof (objData.props_price) != "undefined" ? objData.props_price : '';
        let props_rank = typeof (objData.props_rank) != "undefined" ? objData.props_rank : '';
        let propsAt = typeof (objData.propsAt) != "undefined" ? objData.propsAt : '';
        if (id == '') {
            return { code: -1 };
        }
        let prop = this.core.GetObject(tableType.propEntity, id);
        if (!!prop) {
            if (status != '') {
                prop.setAttr('status', status);
            }
            if (props_price !== '') {
                prop.setAttr('props_price', props_price);
            }
            if (props_rank !== '') {
                prop.setAttr('props_rank', props_rank);
            }
            if (propsAt !== '') {
                prop.setAttr('propsAt', propsAt);
            }
            return { code: ReturnCode.Success };
        }
        return { code: -1 };
    }
    /**
     * 根据游戏cp地址获取道具列表
     *
     * @param {*} user
     * @param {*} objData
     * @returns
     * @memberof prop
     */
    async getPropsByGame(user, objData) {
        let fetch = require("node-fetch");
        let res = await fetch(objData.cp_url, { mode: 'no-cors' });
        res = await res.json();
        let proplist = res.proplist || [];
        return proplist;
    }

    /**
     * 根据游戏cp地址 道具pid获取道具详情
     *
     * @param {*} user
     * @param {*} objData
     * @returns
     * @memberof prop
     */
    async getCpPropsDetail(user, objData) {
        let fetch = require("node-fetch");
        let res = await fetch(objData.cp_url + '/prop/' + objData.pid, { mode: 'no-cors' });
        let json = await res.json();
        return json;
    }

    /**
     * 查找CP_URL
     * @param {*} user 
     * @param {*} objData 
     */
    getCpUrl(user, objData) {
        try {
            let cp = this.core.GetObject(tableType.cp, parseInt(objData.id));
            if (!!cp) {
                return {
                    code: ReturnCode.Success,
                    data: {
                        cp_id: cp.getAttr('cp_id'),
                        cp_text: cp.getAttr('cp_text'),
                        cp_url: cp.getAttr('cp_url'),
                    },
                };
            }
            else {
                return { code: -2, data: null, message: "该CP不存在" };
            }
        } catch (error) {
            console.log(error);
            return { code: -1, data: null, message: "cp.Retrieve方法出错" };
        }
    }

    /**
     * 从数据库中获取所有列表
     * 客户端直接调用此方法
     * jinghh 用做创建道具获取所有游戏
     */
    async ListAllCpRecord() {
        let paramArray = new Array();
        let resList = this.core.GetMapping(tableType.cp)
            .groupOf()
            .where(paramArray)
            .orderby('id', 'desc')
            .records(['id', 'cp_id', 'cp_text', 'cp_type', 'cp_state', 'cp_url', 'publish_time']);
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
