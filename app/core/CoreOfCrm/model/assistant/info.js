let facade = require('gamecloud')
let {UserStatus, NotifyType} = facade.const
let baseMgr = facade.Assistant

/**
 * 用户综合信息管理
 */
class info extends baseMgr
{
	constructor(parent, options) {
        options = options || {attr: 'info', size: 2000};
		super(parent, options);

        //	数据
        this.v 				= {
            name: "",
            //	头像
            avatar_uri	: 0,
            //	等级
            level		: 0,
            //	体力
            ap 			: this.parent.core.fileMap.DataConst.action.init,
            //	金钱
            money		: this.parent.core.fileMap.DataConst.threshold.moneyOfInit,
            //  钻石
            diamond		: 0,
            //刷新日期，用于每日任务
            date: '',     
			//用户复合状态字段
			status		: 0,
        };
    }

    /**
     * 设置属性
     * @param {*} key 
     * @param {*} value 
     */
    setAttr(key, value) {
        this.v[key] = value;
        this.dirty = true;
    }

    /**
     * 查询属性
     */
    getAttr(key) {
        return this.v[key];
    }

    /**
     * 返回客户端需要展示的数据
     * @param {*} force 强制刷新，忽略10秒间隔的限制，这是为了避免C/S间数据误差造成误判
     */
    getData(force=false) {
        return JSON.stringify(this.v);
    }

    /**
     * 从数据库载入数据
     * @param {*} val 
     */
    LoadData(val){
        try{
            this.v = (!val||val == "" ) ? {} : JSON.parse(val);

            if(!this.v.diamond){
                this.v.diamond = 0;
            }
            if(!this.v.status){
                this.v.status = 0;
            }
        }
        catch(e){
            this.v = {
                "name": this.parent.name,
                "id": this.parent.id,
                "domain": this.parent.domain,
                "avatar_uri": "",
                "level": 0,
                "ap": this.parent.core.fileMap.DataConst.action.init,
                "money": this.parent.core.fileMap.DataConst.threshold.moneyOfInit,
                "diamond":0,
                "status": 0
            };
        }

        if(!this.v.date){
            this.v.date = (new Date()).toDateString();
        }
    }

    get name(){
        return this.v.name;
    }
    set name(val){
        this.v.name = val;
        this.dirty = true;
    }

    SetStatus(val, send=true){
        let ns = facade.tools.Indicator.inst(this.v.status).set(val).value;
        if(this.v.status != ns){
            this.v.status = ns;
            this.parent.orm.status = this.v.status;
            this.dirty = true;

            if(send){
                //通知自己的客户端状态发生了变化
                this.parent.notify({type:NotifyType.status, info:this.v.status});
            }

            switch(val){
                case UserStatus.online:
                    //将新的状态登记到索引服上
                    this.parent.core.notifyEvent('user.newAttr', {user: this.parent, attr:{type:'status', value: this.v.status}});

                    //通知所有好友，状态发生了变化
                    this.parent.socialBroadcast({type: NotifyType.userStatus, info: {id:this.parent.openid, value:this.v.status}});
                    break;

                default:
                    break;
            }
        }
    }

	UnsetStatus(val, send=true){
        let ns = facade.tools.Indicator.inst(this.v.status).unSet(val).value;
        if(this.v.status != ns){
            this.v.status = ns;
            this.parent.orm.status = this.v.status;
            this.dirty = true;

            if(send){
                //通知自己的客户端状态发生了变化
                this.parent.notify({type:NotifyType.status, info:this.v.status});
            }

            switch(val){
                case UserStatus.online:
                    //通知所有好友，状态发生了变化
                    this.parent.socialBroadcast({type: NotifyType.userStatus, info: {id:this.parent.openid, value:this.v.status}});
                    //将新的状态登记到索引服上
                    this.parent.core.notifyEvent('user.newAttr', {user: this.parent, attr:{type:'status', value: this.v.status}});
                    break;

                default:
                    break;
            }
        }
    }

    CheckStatus(val){
    	return facade.tools.Indicator.inst(this.v.status).check(val);
    }
    
    GetStatus(){
        return this.v.status;
    }

    //	设置头像
    SetHeadIcon (headIcon) {
		this.v.avatar_uri = headIcon;
		this.dirty = true;
	};
    //	获取头像
    GetHeadIcon() {
		return this.v.avatar_uri;
	};
}

exports = module.exports = info;