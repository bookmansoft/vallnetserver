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
    'games',
    'avatar_uri',
    'desc'
];

let userWallet = [
    'id',
    'uid',
    'cid',
    'addr',
    'account',
    'user_id',
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
    'attach',
    'quantity',
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
    'uid',
    'create_time',
    'update_time'
]

let redpack = [
    'user_redpack_id',
    'uid',
    'act_id',
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

let redpackAct = [
    'id',
    'act_name',
    'act_sequence',
    'total_gamegold',
    'each_gamegold',
    'total_num',
    'each_num',
    'act_desc',
    'act_start_at',
    'act_end_at',
    'cid',
    'status'
]

let userRedpack = [
    'id',
    'uid',
    'act_id',
    'act_name',
    'gamegold',
    'amount',
    'act_at',
    'status',
    'order_sn',
    'cid'
]

let userRedpackAct = [
    'id',
    'uid',
    'act_id',
    'act_name',
    'act_count',
    'amount_all',
    'last_act_at',
]

let blockGameComment = [
    'id',
    'cid',
    'reply_id',
    'uid',
    'nick',
    'avatar_url',
    'ip',
    'resp_count',
    'point_up_count',
    'create_at',
    'title',
    'content',
]

let mobileVerify = [
    'mobile',
    'code',
    'daystamp',
    'last_time',
    'send_num'
]

let stock = [
    'id',
    'cid',
    'cname',
    'totality',
    'remainder',
    'price',
    'gold',
    'title',
    'pic',
    'item_pic',
    'desc',
    'status',
    'support'
]

let userStock = [
    'id',
    'uid',
    'cid',
    'gamegold',
    'amount',
    'quantity',
    'pay_at',
    'order_sn',
    'status',
    'title',
    'src'
]

let userStockLog = [
    'id',
    'uid',
    'cid',
    'quantity',
    'pay_at',
    'status'
]

exports = module.exports = tableField = {
    blockGame, blockGameCate, blockGameProp, blockGameProvider,
    userBase, userProfile, userWallet, userBaseWechat, redpack, redpackAct,
    cpUser, cpProp, cpOrder, userGame, userProp, order, vipdraw, vip, blockNotify,
    userRedpack, userRedpackAct, blockGameComment, mobileVerify, stock, userStock, userStockLog
}