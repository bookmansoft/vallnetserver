let facade = require('gamecloud')
let {RecordType, ReturnCode, ResType, UserStatus, em_Condition_Type, em_Condition_Checkmode, NotifyType, ActivityType, RankType, em_EffectCalcType,em_Effect_Comm,mapOfTechCalcType} = facade.const
let baseMgr = facade.Assistant

/**
 * 用户综合信息管理
 */
class info extends baseMgr
{
	constructor(parent){
		super(parent, 'info');

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
     */
    getData() {
        if(this.getAttr('is_expired') == 0) {
            let vip_usable_count = this.getAttr('vip_usable_count');

            let time_get_count = 0;
            switch(this.getAttr('vip_level')) {
                case 1:
                    time_get_count = 10;
                    break;
                case 2:
                    time_get_count = 110;
                    break;
                case 3:
                    time_get_count = 330;
                    break;
            }

            if(time_get_count > 0) {
                let current_time = parseInt(new Date().getTime() / 1000);
                let delta_time = 0;
                if(current_time > this.getAttr('vip_end_time')) {
                    delta_time = this.getAttr('vip_end_time') - this.getAttr('vip_last_get_time');
                    //设置过期
                    this.setAttr('is_expired', 1);
                } else {
                    delta_time = current_time - userVip.orm.vip_last_get_time;
                }

                if(delta_time > 0) {
                    let vip_last_get_count = delta_time * time_get_count;
                    vip_usable_count =  userVip.orm.vip_usable_count + vip_last_get_count;
                    this.setAttr('vip_last_get_time', current_time);
                    this.setAttr('vip_last_get_count', vip_last_get_count);
                    this.setAttr('vip_usable_count', vip_usable_count);
                }
            }
        }

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
                case UserStatus.gaming:
                case UserStatus.online:
                case UserStatus.slave:
                case UserStatus.master:
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
                case UserStatus.gaming:
                case UserStatus.online:
                case UserStatus.slave:
                case UserStatus.master:
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

    get role(){
        return this.GetRecord(RecordType.Role);
    }
    set role(val){
        this.SetRecord(RecordType.Role, parseInt(val));

        //角色形象发生变化
        this.parent.core.notifyEvent('user.newAttr', {user: this.parent, attr:{type:'role', value:this.GetRecord(RecordType.Role)}});
    }
    get scene(){
        return this.GetRecord(RecordType.Scene);
    }
    set scene(val){
        this.SetRecord(RecordType.Scene, parseInt(val))
    }
    get road(){
        return this.GetRecord(RecordType.Road);
    }
    set road(val){
        this.SetRecord(RecordType.Road, parseInt(val))
    }
    get address(){
        return this.GetRecord(RecordType.address);
    }
    set address(val){
        this.SetRecord(RecordType.address,val);
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