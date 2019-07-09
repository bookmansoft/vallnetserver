let facade = require('gamecloud')
let {TableType} = facade.const;

class viphelp extends facade.Service
{
    /**
     * 充值
     * @param {*} uid 
     * @param {*} vip_level 
     */
    async recharge(uid, vip_level) {
        let userVips = this.core.GetMapping(TableType.Vip).groupOf().where([['uid', '==', uid]]).records();
        let current_time = parseInt(new Date().getTime() / 1000)
        let month_time =  3600 * 24 * 30
        if(userVips.length == 0 ) {
            let vipItem = {
                uid: uid,
                is_expired: 0,
                vip_level: vip_level,
                vip_start_time: current_time,
                vip_end_time: current_time + month_time,
                vip_last_get_time: current_time,
                vip_last_get_count: 0,
                vip_usable_count: 0,
                create_at: current_time,
                update_at: current_time,
            }
            this.core.GetMapping(TableType.Vip).Create(vipItem);
        } else {
            let userVip = userVips[0]
            if(userVip.orm.is_expired == 1) {   //过期，重新开卡
                userVip.setAttr('vip_start_time', current_time);
                userVip.setAttr('vip_end_time', current_time + month_time);
                userVip.setAttr('vip_last_get_time', current_time);
                userVip.setAttr('vip_last_get_count', 0);
                userVip.setAttr('vip_level', vip_level);
                userVip.setAttr('is_expired', 0);
            } else if(userVip.orm.vip_level == vip_level) {     //续费
                userVip.setAttr('vip_end_time', userVip.orm.vip_end_time + month_time);
            } else if(vip_level > userVip.orm.vip_level) {      //升级
                await this.getVip(uid);
                userVip.setAttr('vip_level', vip_level);
            }
            userVip.orm.save()
        }
    }

    /**
     * 领币
     */
    async getVip(uid) {
        let userVips = this.core.GetMapping(TableType.Vip).groupOf().where([['uid', '==', uid]]).records()
        if(userVips.length == 0 ) {
            return {vip_level: 0}
        } else {
            let userVip = userVips[0]
            if(userVip.orm.is_expired == 0) {
                let vip_usable_count = userVip.orm.vip_usable_count
                let time_get_count = 0
                switch(userVip.orm.vip_level)
                {
                    case 1:
                        time_get_count = 10
                        break;
                    case 2:
                        time_get_count = 110
                        break;
                    case 3:
                        time_get_count = 330 
                        break;
                }
                if(time_get_count > 0) {
                    //let vip_get_all_count = time_get_count * 24 * 3600 * 30
                    let current_time = parseInt(new Date().getTime() / 1000);
                    let delta_time = 0
                    if(current_time > userVip.orm.vip_end_time) {
                        delta_time = userVip.orm.vip_end_time - userVip.orm.vip_last_get_time
                        //设置过期
                        userVip.setAttr('is_expired', 1);
                    } else {
                        delta_time = current_time - userVip.orm.vip_last_get_time
                    }
                    if(delta_time > 0) {
                        let vip_last_get_count = delta_time * time_get_count
                        //let vip_get_count = vip_last_get_count - userVip.orm.vip_last_get_count
                        vip_usable_count =  userVip.orm.vip_usable_count + vip_last_get_count
                        userVip.setAttr('vip_last_get_time', current_time);
                        userVip.setAttr('vip_last_get_count', vip_last_get_count);
                        userVip.setAttr('vip_usable_count', vip_usable_count);
                        userVip.orm.save();
                    }
                }
            }
            return userVip.orm
        }
        
    }

    /**
     * 提币
     * @param {*} uid 
     */
    async vipDraw(uid, draw_count, addr) {
        let userVips = this.core.GetMapping(TableType.Vip).groupOf().where([['uid', '==', uid]]).records()
        if(userVips.length >0 ) {
            let userVip = userVips[0]
            let vip_usable_count = userVip.orm.vip_usable_count
            //let k = vip_usable_count / 100000
            if( draw_count < 10 * 100000) {
                return {result: false, errmsg: 'draw is not enouth'};
            }
            if(draw_count > vip_usable_count) {
                return {result: false, errmsg: 'draw beyond'};
            }
            let ret = await this.core.service.gamegoldHelper.execute('tx.send', [
                addr, 
                draw_count
            ]);   
            if(!!!ret) {
                return {result: false, errmsg: 'txsend fail'};
            } else {
                let remainder = vip_usable_count - draw_count
                let current_time = parseInt(new Date().getTime() / 1000)
                let drawItem = {
                    uid: uid,
                    draw_count: draw_count,
                    remainder: remainder,
                    draw_at: current_time,
                }
                this.core.GetMapping(TableType.VipDraw).Create(drawItem);
                userVip.setAttr('vip_usable_count', remainder);
                userVip.orm.save();
                return {result: true, errmsg: 'vipdraw:ok', drawItem: drawItem};
            }
        } else {
            return {result: false, errmsg: 'vipdraw:no user'};
        }
    }
}

module.exports = viphelp;