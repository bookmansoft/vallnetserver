let facade = require('gamecloud')
let {GetResType, ResTypeStr, em_Effect_Comm, ResType, NotifyType,ActivityType, ReturnCode} = facade.const
let LargeNumberCalculator = facade.Util.LargeNumberCalculator
let {fileMap} = facade.config

/**
 * 判断字符串是否整数
 * @param {*} s 
 */
function isNumber( s ){
    var regu = "^[0-9]+$";
    var re = new RegExp(regu);
    return re.test(s);
}

/**
 * 角色升级配置表
 */
let upgradeChip = {1: Math.ceil(fileMap.constdata.getRoleNum.num)};
for(let j = 2; j <= 30; j++){
    upgradeChip[j] = upgradeChip[1];
    for(let i = 2; i <= j; i++){
        upgradeChip[j] = Math.ceil(upgradeChip[j] + fileMap.constdata.debrisConumRate.num * (i-1));
    }
}

/**
 * 背包管理
 */
class item extends facade.Assistants.Pocket
{
    /**
     * 设置角色技能
     */
    setSkill(cur) {
        //todo:判断技能
        let role = facade.config.fileMap.roledata[cur];
        if(!this.v[cur].sk && this.v[cur].sk != 0){
            this.v[cur].sk = 0;
        }
        if (Math.floor(this.v[cur].sk / 10000) == 0) {
            if (role.unlockskill1.length == 0) {
                this.v[cur].sk += 10000;
            }
            else {
                let allow = 1;
                for (let i = 0; i < role.unlockskill1.length; i++) {
                    if (this.v[role.unlockskill1[i]]) {
                        allow = allow & 1;
                    }
                    else {
                        allow = allow & 0;
                    }
                }
                if (allow == 1) {
                    this.v[cur].sk += 10000;
                }
            }
        }

        if (Math.floor((this.v[cur].sk % 10000) / 100) == 0) {
            if (role.unlockskill2.length == 0) {
                this.v[cur].sk += 100;
            }
            else {
                let allow = 1;
                for (let i = 0; i < role.unlockskill2.length; i++) {
                    if (this.v[role.unlockskill2[i]]) {
                        allow = allow & 1;
                    }
                    else {
                        allow = allow & 0;
                    }
                }
                if (allow == 1) {
                    this.v[cur].sk += 100;
                }
            }
        }

        if (Math.floor(this.v[cur].sk % 100) == 0) {
            if (role.unlockskill3.length == 0) {
                this.v[cur].sk += 1;
            }
            else {
                let allow = 1;
                for (let i = 0; i < role.unlockskill3.length; i++) {
                    if (this.v[role.unlockskill3[i]]) {
                        allow = allow & 1;
                    }
                    else {
                        allow = allow & 0;
                    }
                }
                if (allow == 1) {
                    this.v[cur].sk += 1;
                }
            }
        }
    }
    
    /**
     * 检测技能解锁
     * @param 角色id——判断该角色可解锁的技能
     */
    checkSkill(id){
        return Object.keys(this.v).reduce((sofar, cur)=>{
            if(GetResType(cur) == ResType.Role) { //判断是否是角色
                if(!this.v[cur].lv){
                    this.v[cur].lv = 1;
                }
                this.setSkill(cur);
                let role = facade.config.fileMap.roledata[cur];
                                
                for(let i = 0; i < role.unlockskill1.length; i++){
                
                    if(role.unlockskill1[i] == id && Math.floor(this.v[cur].sk/10000) != 0){
                        sofar.push({id:cur, lv:this.v[cur].lv, 
                                    sk1: Math.floor(this.v[cur].sk/10000),
                                    sk2: Math.floor((this.v[cur].sk%10000)/100),
                                    sk3: Math.floor(this.v[cur].sk%100)});
                    }
                }
                for(let j = 0; j < role.unlockskill2.length; j++){
                
                    if(role.unlockskill2[j] == id && Math.floor((this.v[cur].sk%10000)/100) != 0){
                        sofar.push({id:cur, lv:this.v[cur].lv, 
                            sk1: Math.floor(this.v[cur].sk/10000),
                            sk2: Math.floor((this.v[cur].sk%10000)/100),
                            sk3: Math.floor(this.v[cur].sk%100)});
                    }
                }
                for(let k = 0; k < role.unlockskill3.length; k++){
                
                    if(role.unlockskill3[k] == id && Math.floor(this.v[cur].sk%100) != 0){
                        sofar.push({id:cur, lv:this.v[cur].lv, 
                            sk1: Math.floor(this.v[cur].sk/10000),
                            sk2: Math.floor((this.v[cur].sk%10000)/100),
                            sk3: Math.floor(this.v[cur].sk%100)});
                    }
                }
            }
            return sofar;
        }, []);
    }

    /**
     * 能否解锁角色关联场景
     * 目前只有火影场景 2017.9.25
     * @param sceneid: "1" 火影场景
     */
    unlockedScene(sceneid = "1") {
        //todo 请改为配置表
        let conditions = {
            1: {
                status: facade.const.UserStatus.unlockedNinjaScene,     //解锁场景的状态位
                conditions: [1031,1032,1033],                           //前置条件：需要拥有的角色列表
            }
        };

        if(!this.parent.baseMgr.info.CheckStatus(conditions[sceneid].status)) {
            if(conditions[sceneid].conditions.reduce((sofar,cur)=>{
                sofar = sofar && !!this.v[cur];
                return sofar;
            }, true)) {
                this.parent.baseMgr.info.SetStatus(conditions[sceneid].status);
                return {code:ReturnCode.Success};
            } else {
                return {code:ReturnCode.taskNotFinished};
            }
        }
        else {
            return {code:ReturnCode.taskBonusHasGot};
        }
    }

    /**
     * 获取角色列表，包含等级信息
     * @returns {*}
     */
    getRoleList() {
        return Object.keys(this.v).reduce((sofar, cur) => {
            if(GetResType(cur) == ResType.Role) { //判断是否是角色
                if(!this.v[cur].lv){
                    this.v[cur].lv = 1;
                }
                this.setSkill(cur);
                sofar.push({
                    id:cur, 
                    lv:this.v[cur].lv, 
                    sk1:Math.floor(this.v[cur].sk/10000), 
                    sk2:Math.floor((this.v[cur].sk%10000)/100), 
                    sk3:Math.floor(this.v[cur].sk%100)
                });
            }
            return sofar;
        }, []);
    }

    /**
     * 升级角色技能
     * @param id 角色id
     * @param skid 技能id
     * @param price 技能升级价格
     */
    upgradeSkill(id,skid,price){
        let role = facade.config.fileMap.roledata[id];
        if(!role || (skid != 1 && skid != 2 && skid != 3)){
            return {code: ReturnCode.illegalData};
        }
        if(!this.v[id].sk){
           this.setSkill(id);
        }
        //判断金币数值是否合法
        let base = facade.config.fileMap.constdata.skillMoneyBase.num;
        let current = 0;
        if(skid == 1){
            current = Math.ceil(base * Math.pow(Math.floor(this.v[id].sk/10000),1.6));
        }
        else if(skid == 2){
            current = Math.ceil(base * Math.pow(Math.floor((this.v[id].sk%10000)/100),1.6));
        }
        else{
            current = Math.ceil(base * Math.pow( Math.floor(this.v[id].sk%100),1.6));
        }
        if(price == current){
            //判断用户金币储量以及升级技能所需关联角色等级            
            if(this.GetRes(ResType.Coin) >=price){
                this.parent.getBonus({type:ResType.Coin, num:-price});
                if(skid == 1){
                    if(role.unlockskill1.length == 0){
                        if(this.v[id].lv > Math.floor(this.v[id].sk/10000)){
                            this.v[id].sk += 10000;
                        }
                        else {
                            return {code: ReturnCode.RoleLeveltooLow};
                        }
                    }
                    else{
                        let allow = 1;
                        for(let i = 0; i < role.unlockskill1.length; i++){
                                if(this.v[role.unlockskill1[i]].lv > Math.floor(this.v[id].sk/10000)){
                                    allow = allow&1;
                                }
                                else {
                                    allow = allow&0;
                                }
                        }
                        if(allow == 1){
                            this.v[id].sk += 10000;
                        }
                        else {
                            return {code: ReturnCode.RoleLeveltooLow};
                        }
                    }
                }
                else if(skid == 2){
                    if(role.unlockskill2.length == 0){
                        if(this.v[id].lv > Math.floor((this.v[id].sk%10000)/100)){
                            this.v[id].sk += 100;
                        }
                        else {
                            return {code: ReturnCode.RoleLeveltooLow};
                        }
                    }
                    else{
                        let allow = 1;
                        for(let i = 0; i < role.unlockskill2.length; i++){
                                if(this.v[role.unlockskill2[i]].lv > Math.floor((this.v[id].sk%10000)/100)){
                                    allow = allow&1;
                                }
                                else {
                                    allow = allow&0;
                                }
                        }
                        if(allow == 1){
                            this.v[id].sk += 100;
                        }
                        else {
                            return {code: ReturnCode.RoleLeveltooLow};
                        }
                    }
                }
                else{
                    if(role.unlockskill3.length == 0){
                        if(this.v[id].lv > Math.floor(this.v[id].sk%100)){
                            this.v[id].sk += 1;
                        }
                        else {
                            return {code: ReturnCode.RoleLeveltooLow};
                        }
                    }
                    else{
                        let allow = 1;
                        for(let i = 0; i < role.unlockskill3.length; i++){
                                if(this.v[role.unlockskill3[i]].lv > Math.floor(this.v[id].sk%100)){
                                    allow = allow&1;
                                }
                                else {
                                    allow = allow&0;
                                }
                        }
                        if(allow == 1){
                            this.v[id].sk += 1;
                        }
                        else {
                            return {code: ReturnCode.RoleLeveltooLow};
                        }
                    }
                    
                }
                return{code:ReturnCode.Success,data:{id:id,sk1: Math.floor(this.v[id].sk/10000),sk2: Math.floor((this.v[id].sk%10000)/100),sk3: Math.floor(this.v[id].sk%100),}};
            }
            else{
                return {code:ReturnCode.MoneyNotEnough};
            }
        }
        else{
            return {code: ReturnCode.illegalData};
        }
    }

    /**
     * 升级角色
     * @param id
     */
    upgradeRole(id){
        let role = facade.config.fileMap.roledata[id];     
        if(!role){
            return {code: ReturnCode.illegalData};
        }
        let chipId = role.pieceid;

        let it = this.v[id];
        if(!it){
            it = {num:1, lv:0 ,sk:0}; //不存在的角色，准备执行激活操作
        }

        //碎片数量 = 当前等级所需数量 + 碎片成长系数 x (当前等级-1)，其中，碎片成长系数默认为0.2，配在常量表中
        if(!upgradeChip[it.lv+1]){
            return {code: ReturnCode.roleMaxLevel};
        }

        let cnum = upgradeChip[it.lv+1];
        if(!this.v[chipId] || this.v[chipId].num < cnum){
            return {code: ReturnCode.roleChipNotEnough};
        }

        this.AddRes(-cnum, true, chipId);
        let data = [];
        if(!this.v[id] || !this.v[id].lv){
            //判断角色技能解锁情况
            this.v[id] = it;
            this.setSkill(id);
            data = this.checkSkill(id);
        }
        else{
            this.v[id].lv += 1;
        }     
        return {
            code: ReturnCode.Success,
            data:{
                id: id,
                lv: this.v[id].lv,
                chip: !!this.v[chipId] ? this.v[chipId].num : 0,
                sk1: Math.floor(this.v[id].sk/10000),
                sk2: Math.floor((this.v[id].sk%10000)/100),
                sk3: Math.floor(this.v[id].sk%100),
                unlock: data
            }
        };
    }

    /**
     * 判断给定奖励和指定类型是否相关
     */
    relation(bonus, $type, $ret = false) {
        function $relation(_bonus, _type) {
            switch(_type){
                case ResType.Action:
                    return _bonus.id == 23; //目前满体力情况下能买矿泉水，但不能买咖啡机
                }
            return _bonus.type == _type;
        }

        if(typeof bonus == 'string') {
            let bo = this.parent.getBonus(JSON.parse(bonus));
            $ret = $ret || $relation(bo,$type);
        }
        else if(Array.isArray(bonus)) {
            bonus.map(item=>{
                $ret = $ret || $relation(item,$type);
            });
        }
        else{
            $ret = $ret || $relation(bonus,$type);
        }
        return $ret;
    }


    /**
     * 返回体力描述信息结构
     */
    getActionData(){
        this.actionData.cur = this.GetRes(ResType.Action);
        this.actionData.max = this.GetResMaxValue(ResType.Action);
        this.actionData.money = this.GetRes(ResType.Coin);
        this.actionData.diamond = this.GetRes(ResType.Diamond);
        return this.actionData;
    }
    /**
     * 使用指定道具
     * @param {Number} xid
     * @param {Number} num
     */
    useItem(xid, num=1) {
        if(typeof num == 'string') {
            num = parseInt(num);
        }

        if(this.GetRes(xid) >= num) {
            this.AddRes(-num, true, xid);
            //触发了特殊道具被使用事件
            this.parent.core.notifyEvent('user.itemUsed', {user:this.parent, data:{type:xid, value:num}});
            return {code: ReturnCode.Success, data:this.getList()};
        }
        else{
            return {code: ReturnCode.itemNotExist};
        }
    }
}

exports = module.exports = item;
