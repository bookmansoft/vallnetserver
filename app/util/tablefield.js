let blockGame = ['id','game_code','game_title','game_resource_uri','game_ico_uri','game_link_url','game_desc','sort','category_id',
    'category_title','provider_id','provider_name','ad_title','ranking','star_level','down_count','comment_count',
    'create_time','update_time','store_status','game_version',
    'developer','update_desc','game_screenshots','player_count','cpid','cpurl','cp_addr','cp_name'
];

let blockGameCate = [
    'id','category_id','category_title'
];

let blockGameProp = [ 
    'id',
    'cpid',
    'prop_id',
    'oid',
    'prop_name',
    'icon_small',
    'icon_large',
    'prop_info',
    'create_time',
    'prop_price',
    'prop_value',
    'nstatus'
];

let blockGameProvider = [
    'id',
    'provider_id',
    'provider_name',
    'contact',
    'phone',
    'addr',
    'uri',
    'game_number',
    'comprehensive_grade'
];

let userBase = [
    'id',
    'user_name',
    'password_hash',
    'auth_key',
    'registration_ip',
    'remember_token',
    'openid',
    'created_at',
    'updated_at',
    'blocked_at',
    'flags',
    'user_type'
];

let userProfile = [
    'id',
    'uid',
    'nick',
    'phone',
    'email',
    'gender',
    'birth',
    'country',
    'province',
    'city',
    'prop_count',
    'current_prop_count',
    'block_addr',
    'nlevel',
    'avatar',
    'ranking',
    'star_level',
    'down_count',
    'game_count',
    'follow_count',
    'no_reading_msg_count',
    'comment_count',
    'buy_count',
    'unionid',
    'games',
    'avatar_uri',
    'desc'
];

let userWallet = [
    'id',
    'uid',
    'cid',
    'addr',
    'cp_uid',
    'openid',
    'mnemonic_word',
    'wallet_service_uri',
    'remaining_coin',
    'gift',
    'donate_count',
    'buy_count'
];

let userGame = [
    'id',
    'uid',
    'openid',
    'game_id'
];

let userProp = [
    'uid',
    'openid',
    'cid',
    'oid',
    'pid',
    'oper',
    'current_hash',
    'current_index',
    'current_rev',
    'current_height',
    'time',
    'gold',
    'status',
    'cp_url',
    'cp_name',
    'cp_ip'
];

let userBaseWechat = [
    'id',
    'openid',
    'ntype',
    'uid',
    'unionid',
    'first_time',
    'last_time'
];

let cpUser = [
    'id',
    'openid',
    'addr',
    'nick',
    'avatar_uri',
    'created_at'
];

let cpProp = [
    'id',
    'oid',
    'prop_id',
    'prop_name',
    'prop_icon',
    'prop_info',
    'gold',
    'price'
];

let cpOrder = [
    'id',
    'uid',
    'openid',
    'user_addr',
    'order_sn',
    'order_num',
    'prop_id',
    'prop_name',
    'prop_oid',
    'prop_value',
    'prop_icon',
    'order_status',
    'prop_status',
    'pay_status',
    'create_time',
    'update_time'
];

let order = [ 
    'uid',
    'order_sn',
    'order_num',
    'product_id',
    'product_info',
    'order_status',
    'pay_status',
    'create_time',
    'update_time',
]

let vip = [ 
    'uid',
    'is_expired',
    'vip_level',
    'vip_start_time',
    'vip_end_time',
    'vip_last_get_time',
    'vip_last_get_count',
    'vip_usable_count',
    'create_at',
    'update_at',
]

let vipdraw = [ 
    'uid',
    'draw_count',
    'pay_status',
    'remainder',
    'draw_at',
]

let blockNotify = [
    'sn',
    'h',
    'status',
    'content',
    'type',
    'openid',
    'create_time',
    'update_time'
]

let redpack = [
    'act_name',
    'mch_billno',
    'nick_name',
    're_openid',
    'remark',
    'send_name',
    'total_amount',
    'total_num',
    'wishing',
    'return_msg',
    'order_status'
]
exports = module.exports = tableField = {
    blockGame, blockGameCate, blockGameProp, blockGameProvider,
    userBase, userProfile, userWallet, userBaseWechat, redpack,
    cpUser, cpProp, cpOrder, userGame, userProp, order, vipdraw, vip, blockNotify
}