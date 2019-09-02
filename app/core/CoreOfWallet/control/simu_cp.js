let facade = require('gamecloud')
let {EntityType, IndexType, ReturnCode} = facade.const
let fetch = require('node-fetch')
let crypto = require('crypto')

/**
 * 游戏提供的对外接口：查询CP基本资料
 */
class cp extends facade.Control
{
    /**
     * 自定义中间件序列
     */
    get middleware() {
        return ['parseParams', 'commonHandle'];
    }

    /**
     * 配置URL路由，用户可以直接经由页面访问获取签名数据集
     */
    get router() {
        return [
            [`/mock/:cp_name`, 'getInfo'],
            ['/mock/:cp_name/user/:uid', 'responseUser'],
            ['/mock/:cp_name/prop/:id', 'responseProp'],
            ['/mock/:cp_name/myprops/:uid', 'myProps'],
        ];
    }

    /**
     * 我的道具列表【确权】 /mock/:cp_name/myprops/:uid
     */
    async myProps(params) {
        //根据cp_name取cp完整信息，包括数据集采接口的url
        let cpParamArray = [
            params.cp_name,
        ];
        let cpInfo = await this.core.service.gamegoldHelper.execute('cp.byName', cpParamArray);
        if (!cpInfo || !cpInfo.result) {
            return { code: -200, msg: '查询我的道具失败，CP不存在' };
        }

        //通过url取道具列表等数据
        let propMap = new Map();
        let json = await (await fetch(cpInfo.result.url)).json();
        for (let i = 0; i < json.proplist.length; i++) {
            propMap.set(json.proplist[i].id, json.proplist[i]);
        }

        let user = this.core.userMap[params.uid];
        let retProps = await this.core.service.gamegoldHelper.execute('prop.list', [0, user.account, null, cpInfo.result.cid]);

        //将来自CP的商品列表信息，和链上数据信息进行拼装
        let retData = [];
        for (let item of retProps.result.list) {
            let prop = propMap.get(item.oid);
            if(prop) {
                retData.push({
                    pid: item.pid,
                    oid: item.oid,
                    gold: item.gold,
                    props_price: prop.props_price,
                    props_name: prop.props_name,
                    props_rank: prop.props_rank,
                    icon: prop.icon,
                });
            }
        }

        //返回最终的数据
        return { code: 0, data: retData };
    }
    
    responseProp(params) {
        return this.createProp(params.id);
    }

    /**
     * 返回对应CP的结构化信息
     */
    getInfo(params) {
        if (!params.cp_name) {
            return {code: -1};
        }

        let groupNum = 0;//默认为0
        try {
            groupNum = parseInt(params.cp_name.substr(4)) % 4;
            if (groupNum != 0 && groupNum != 1 && groupNum != 2 && groupNum != 3) {
                groupNum = 0;
            }
        } catch (error1) {
            groupNum = 0;
        }

        //随机生成若干道具并添加到数组中
        let propArray = new Array();
        let propCount = 5;
        for (let i = 0; i < propCount; i++) {
            propArray.push(this.createProp(`${params.cp_name}_prop_${i}`));
        }

        //编组cpInfo
        let cpInfo = {
            "crowd": {
                "funding_text": "有可能是最好玩的游戏",
                "funding_project_text": "希望大家支持我们一哈",
            },
            "game": {
                "cp_name": params.cp_name,
                "game_title": `${arrayGameTitle[groupNum]}(${params.cp_name})`,
                "cp_type": arrayCpTye[groupNum],
                "icon_url": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/${groupNum}/icon_img.jpg`,
                "small_img_url": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/small_img.jpg",
                "large_img_url": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/large_img.jpg",
                "pic_urls": [`http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/pic1.jpg",
                `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/pic2.jpg",
                `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/pic3.jpg"],
                "desc": arrayGameDesc[groupNum],
                "provider": arrayProvider[groupNum],
                "version": "V1.0",
                "publish_time": 1545606613,
                "update_time": 1545706613,
                "update_content": "更新了最新场景和新的地图",
                "state": 1,
            },
            "proplist": propArray,
            "apps": {
                "wechat": {
                    "app_name": "{app_name}",
                    "appid": "{appid}",
                    "path": "{path}",
                    "version": "{version}",
                },
                "h5": {
                    "url": "{url}",
                },
                "android": {
                    "appid": "{appid}"
                },
                "ios": {

                }
            },
        };
        return cpInfo;
    }

    async responseUser(params) {
        let account = crypto.createHash('sha1').update(Buffer.from(params.uid,'utf8')).digest().toString('hex');
        let rt = await this.core.service.gamegoldHelper.execute('token.user', [params.cp_name, account, null, account]);
        if(rt.code == 0) {
            this.core.userMap[params.uid] = {
                domainId: params.uid,
                address: rt.result.data.addr,
            };
        }
        return {code: rt.code};
    }

    /**
     * 创建一个模拟游戏道具，其属性对 propid 具备确定性
     * @param {*} propid
     */
    createProp(propid) {
        let propIndexArray = propid.split('_prop_');
        let cp_name = propIndexArray[0];
        let propIndex = propIndexArray[propIndexArray.length - 1];

        let groupNum = 0;//默认为0
        try {
            groupNum = parseInt(cp_name.substr(4)) % 4;
            if (groupNum != 0 && groupNum != 1 && groupNum != 2 && groupNum != 3) {
                groupNum = 0;
            }
        } catch (error1) {
            groupNum = 0;
        }

        let prop = {
            "id": propid,
            "props_name": `${arrayPropName[groupNum]}-${propIndex}`,
            "icon": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/prop_icon.jpg",
            "large_icon": `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/prop_large_icon.jpg",
            "more_icon": [`http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/prop_pic1.jpg",
            `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/prop_pic2.jpg",
            `http://${this.core.options.webserver.mapping}:${this.core.options.webserver.port}/image/` + groupNum + "/prop_pic3.jpg"],
            "props_type": "装备",
            "props_desc": arrayPropDesc[groupNum],
            "props_price": (parseInt(propIndex)+1)*100000,
            "props_createtime": "2018-12-22 16:22:30",
            "props_rank": 3,
            "props_status": 1,
            "state": 1,
            "props_extra": {
                "attr1": "属性1",
                "attr2": "属性2",
            },
        };

        return prop;
    }
}

//#region 供模拟系统使用的属性配置数组
let arrayPropName = [
    'M416自动步枪',
    '北极50地狱行者',
    '超级跑车',
    'T10自行反坦克车',
];
let arrayPropDesc = [
    'M4虽然是很多的玩家喜爱的步枪，但是随着版本的改动现在已经垫底了，配件也是非常的多，没有配件的M4基本就是个烧火棍，但是满配了以后还是可以玩的，EatChicken的最佳武器之一',
    '北极50拥有极高的准确度，栓动射击大大的保证了武器的精度。狙击枪的盲射是所有武器中最差的，弹道散射大，即便贴身了，也难以击中。',
    '极其稀有的超级跑车，一旦拥有，便能上天入地。W12四涡轮增压喷气式引擎，配合极度流畅的车身线条，可以直接使角色上天与太阳肩并肩，轻松完成任何任务。',
    '仅支持金币购买的超值坦克，性价比超高，配合AP弹，轻松击穿同级其他坦克。需要配备驾驶成员4名，支持AP弹和HE弹。',
];
let arrayGameTitle = [
    'Code of War',
    'Mercs of Boom',
    '孤胆车神',
    '坦克大战',
];
let arrayCpTye = [
    'ACT', 'SHT', 'ACT', 'WAR',
];
let arrayGameDesc = [
    '指挥在线枪战 – 纯粹的动作游戏！ Code of War是一款在线枪战游戏，拥有最佳3D图形、真实物理引擎以及海量真实枪支供您选择。 在与来自世界各地的其他玩家对战的动态在线动作游戏内试试您的技能和精通！',
    'Supply elite soldiers with tons of equipment: hi-tech armor, deadly weapons, implants, and gadgets. ? Upgrade your base and research futuristic technology to gain access to advanced war',
    '开放沙盒式动作冒险游戏金牌标杆系列之作霸气归来。前往迷人的新奥尔良，打下一片新天地。在这座巨大的城市中，驾驶数百种交通工具、坐拥数量惊人的武器装备，来往自如，无法无天！ 在这里万事俱备，您也可以成为黑道传奇人物！',
    '终于等到了！全新世界征服战资料片震撼开启！三大阵营重兵集结，打响国战第一炮！万千坦克同屏对决，铸造最热血的坦克手游！集合策略和国战经典玩法于一体的全民坦克游戏，传奇将领，万人国战，占领世界疆土，成就世界霸主梦',
];
let arrayProvider = [
    'Extreme Developers Action & adventure',
    'GAME INSIGHT UAB Strategy',
    'Gameloft. Action & adventure',
    'Strategy、Role playing',
];
//#endregion

exports = module.exports = cp;
