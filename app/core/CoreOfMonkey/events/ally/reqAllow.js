let facade = require('gamecloud')
let {EntityType, InviteType, NotifyType, ResType,ActivityType,em_Condition_Type,em_Condition_Checkmode, ReturnCode} = facade.const

function handle(event){ 
    /**
     * @type {UserEntity}
     */
    let $user = this.GetObject(EntityType.User, event.dst);
    /**
     * @type {AllyObject}
     */
    let $ao = this.GetObject(EntityType.Ally, event.aid);
    if(!!$user && !!$ao){
        if($ao.ReqAllowAccepted(event.src, $user) == ReturnCode.Success){
            $user.getInviteMgr().Clear(InviteType.AllyReq, 0);
            $user.getInviteMgr().Clear(InviteType.AllyInvite, 0);
        }
        $user.getInviteMgr().Clear(InviteType.AllyReq, event.aid);
        $user.getInviteMgr().Clear(InviteType.AllyInvite, event.aid);
    }
}

module.exports.handle = handle;
