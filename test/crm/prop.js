/**
 * 单元测试：注册登录、简单应答、推送
 * Creted by liub 2017.3.24
 */

const remote = require('./util')
const moment = require('moment')

//一组单元测试流程
describe('道具（prop）', function () {

    it('prop.List 获取链上道具List', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            let list = await remote.fetching({ func: "prop.List", userinfo: { id: 5 }, items: [1] });
            console.log(list);
        }
    });
    it('prop.LocalList 获取本地库道具LocalList', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            let list = await remote.fetching({
                func: "prop.LocalList", userinfo: { id: 5 },
                currentPage: 1,
                pageSize: 2,
                id: '',
                props_name: '',
                cid: '',
            });
            console.log(list);
        }
    });
    it('prop.getAllPropsByParams 按照status获取本地库道具所有列表getAllPropsByParams', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            let list = await remote.fetching({
                func: "prop.getAllPropsByParams", userinfo: { id: 5 },
                cid: '',
            });
            console.log('getAllPropsByParams列表：');
            console.log(list);
        }
    });
    it('prop.CreateLocal 道具本地创建CreateLocal', async () => {
      
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });

        if (remote.isSuccess(msg)) {
            let res = await remote.fetching({
                func: "prop.CreateLocal", userinfo: { id: 5 },
                props_id: 1,
                props_name: 'test',
                props_type: 1,
                cid: '195062d0-fa01-11e8-a5d7-ad318d3cb4a9',
                props_desc: 'this is desc',
                icon_url: 'http://db.duowan.com/wow/resources/screenshot/item/3/32458/normal/257646.jpg',
                icon_preview: '[http://db.duowan.com/wow/resources/screenshot/item/3/32458/normal/171317.jpg,http://db.duowan.com/wow/resources/screenshot/item/3/32458/normal/219355.jpg]',
                oid: '',
                status: 1,
                props_price: 0.2,
                props_rank: 'cheng',
                propsAt: '2018-12-2 16:49:39',
                createdAt: '2018-12-2 16:49:39',
                updatedAt: '2018-12-2 16:49:46',
            });
            console.log(res);
        }
    });
    it('prop.UpdateProp 道具修改', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            let res = await remote.fetching({
                func: "prop.UpdateProp", userinfo: { id: 5 },
                id: 48,
                props_price: 10005,
                lastproAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            });
            console.log(res);
        }
    });

    it('prop.LocalDetail 获取道具详情LocalDetail', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            let detail = await remote.fetching({ func: "prop.LocalDetail", userinfo: { id: 5 }, id: 48 });
            console.log(detail);
        }
    });

    it('prop.PropSendListRemote 道具赠送', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            let list = await remote.fetching({
                func: "prop.PropSendListRemote", userinfo: { id: 5 },
                id: 38,
                addr: ['2Mtssxfoor4YQRZpjbdqWF4S7qVw5QstWwQ']
            });
            console.log(list);
        }
    });
    it('prop.cpIdText 获取本地库道具cpIdText', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            let list = await remote.fetching({ func: "prop.cpIdText", userinfo: { id: 5 } });
            console.log(list);
        }
    });
    it('prop.UpdateProp 修改本地库道具UpdateProp', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            let list = await remote.fetching({
                func: "prop.UpdateProp", userinfo: { id: 5 },
                id: 32,
                status:3,
                stock:1,
                pro_num:1,
                create_res: {}

            });
            console.log(list);
        }
    });
    it('钱包信息 wallet.info', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            //所有的控制器都拥有echo方法
            msg = await remote.fetching({ func: "wallet.Info", userinfo: { id: 5 }, items: [] });
            remote.isSuccess(msg, true);
        }
    });/* 
    it('批量生产 prop.CreatePropListRemote', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            res = await remote.fetching({
                func: "prop.CreatePropListRemote", userinfo: { id: 5 },
                cid: 'e26f7a20-fcef-11e8-af9c-9f3accf37b7f', //测试cid 记得先gamegold中cp.list找个稳定的
                oid: 'xxxxxxxx-game-gold-boss-tokenxxx00042',
                num: 5,
                id: 35

            });
            console.log(res);
        }
    }); */
    it('游戏厂商获取道具列表 prop.getPropsByGame', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            res = await remote.fetching({
                func: "prop.getPropsByGame", userinfo: { id: 5 },
                cp_url: 'http://127.0.0.1:9701/mock/cp122701', 
            });
            console.log(res);
        }
    });
    it('游戏厂商获取道具详情 prop.getCpPropsDetail', async () => {
        let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
        if (remote.isSuccess(msg)) {
            res = await remote.fetching({
                func: "prop.getCpPropsDetail", userinfo: { id: 5 },
                cp_url: 'http://127.0.0.1:9701/mock/cp122701', 
                pid: 'cp122801_prop0', 
            });
            console.log(res);
        }
    });

});
