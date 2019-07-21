# 微信支付接口

## 微信支付使用的场景

1. 购买 VIP 服务
2. 购买凭证

## 支付流程

1. 客户端申请支付，服务端生成订单并下发，此时订单状态为'未处理'
2. 客户端根据下发的订单，调用微信支付接口，获得调用结果后显示给用户，同时上行状态到服务端，服务端将订单状态修改为'待确认'
3. 服务端收到微信回调，修改订单状态为'已确认'，处理订单内容，然后推送处理结果给客户端
4. 如果逾期没有收到通知，服务端主动向微信问询订单处理结果
4. 客户端根据推送结果，做相应的提醒工作

商户接入微信支付，调用API必须遵循以下规则：
- 传输方式	为保证交易安全性，采用HTTPS传输
- 提交方式	采用POST方法提交
- 数据格式	提交和返回数据都为XML格式，根节点名为xml
- 字符编码	统一采用UTF-8字符编码
- 签名算法	MD5/HMAC-SHA256
- 签名要求	请求和接收数据均需要校验签名，详细方法请参考安全规范-签名算法
- 证书要求	调用申请退款、撤销订单、红包接口等需要商户api证书，各api接口文档均有说明。
- 判断逻辑	先判断协议字段返回，再判断业务返回，最后判断交易状态

## 查询订单

URL地址：https://api.mch.weixin.qq.com/pay/orderquery

字段名	    变量名	        必填	类型	        示例值	                            描述
公众账号ID	appid	        是	    String(32)	    wxd678efh567hg6787	                微信支付分配的公众账号ID（企业号corpid即为此appId）
商户号	    mch_id	        是	    String(32)	    1230000109	                        微信支付分配的商户号
微信订单号	transaction_id	二选一	String(32)	    1009660380201506130728806387	    微信的订单号，建议优先使用
商户订单号	out_trade_no	二选一  String(32)	    20150806125346	                    商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。 详见商户订单号
随机字符串	nonce_str	    是	    String(32)	    C380BEC2BFD727A4B6845133519F3AD6	随机字符串，不长于32位。推荐随机数生成算法
签名	    sign	        是	    String(32)	    5K8264ILTKCH16CQ2502SI8ZNMTM67VS	通过签名算法计算得出的签名值，详见签名生成算法
签名类型	sign_type	    否	    String(32)	    HMAC-SHA256	                        签名类型，目前支持HMAC-SHA256和MD5，默认为MD5

返回结果
返回状态码      return_code	String(16)	SUCCESS/FAIL    此字段是通信标识，非交易标识，交易是否成功需要查看trade_state来判断
返回信息        return_msg	    String(128)	OK	            当return_code为FAIL时返回信息为错误原因 ，例如签名失败/参数格式校验错误
公众账号ID	    appid	是	String(32)	wxd678efh567hg6787	微信分配的公众账号ID
商户号	        mch_id	是	String(32)	1230000109	微信支付分配的商户号
随机字符串	    nonce_str	是	String(32)	5K8264ILTKCH16CQ2502SI8ZNMTM67VS	随机字符串，不长于32位。推荐随机数生成算法
签名	        sign	是	String(32)	C380BEC2BFD727A4B6845133519F3AD6	签名，详见签名生成算法
业务结果	    result_code	是	String(16)	SUCCESS	SUCCESS/FAIL
错误代码	    err_code	否	String(32)	 	当result_code为FAIL时返回错误代码，详细参见下文错误列表
错误代码描述	err_code_des	否	String(128)	 	当result_code为FAIL时返回错误描述，详细参见下文错误列表
交易状态	    trade_state	是	String(32)	SUCCESS	
                    SUCCESS—支付成功
                    REFUND—转入退款
                    NOTPAY—未支付
                    CLOSED—已关闭
                    REVOKED—已撤销（付款码支付）
                    USERPAYING--用户支付中（付款码支付）
                    PAYERROR--支付失败(其他原因，如银行返回失败)
微信支付订单号	    transaction_id	是	String(32)	1009660380201506130728806387	微信支付订单号
商户订单号	        out_trade_no	是	String(32)	20150806125346	商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。
附加数据	    attach	否	String(128)	深圳分店	附加数据，原样返回
支付完成时间	time_end	是	String(14)	20141030133525	订单支付时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010。其他详见时间规则
交易状态描述	trade_state_desc	是	String(256)	支付失败，请重新下单支付	对当前查询订单状态的描述和下一步操作的指引

微信 JS API 只能在微信内置浏览器中使用，其他浏览器调用无效。

微信提供 getBrandWCPayRequest 接口供商户前端网页调用，调用之前微信会鉴定商户支付权限，若商户具有调起支付的权限，则将开始支付流程。

这里主要介绍支付前的接口调用规则，支付状态消息通知机制请参加下文。接口需要注意：所有传入参数都是字符串类型！

getBrandWCPayRequest参数如下图所示。

参数	        名称	            必填	格式	                    说明
appId	        公众号id	        是	    字符串类型	                商户注册具有支付权限的公众号成功后即可获得；
timeStamp	    时间戳	            是	    字符串类型，32个字节以下	商户生成，从1970年1月1日00:00:00至今的秒数，即当前的时间，且最终需要转换为字符串形式；
nonceStr	    随机字符串	        是	    字符串类型，32个字节以下	商户生成的随机字符串；
package	        订单详情扩展字符串	是	    字符串类型，4096个字节以下	 商户将订单信息组成该字符串，具体组成方案参见接口使用说明中package组包帮劣；由商户按照规范拼接后传入；
signType	    签名方式	        是	    字符串类型，参数取值"SHA1"	按照文档中所示填入，目前仅支持SHA1；
paySign	        签名	            是	  字符串类型 商户将接口列表中的参数按照指定方式迚行签名，签名方式使用signType中标示的签名方式，具体签名方案参见接口使用说明中签名帮劣；由商户按照规范签名后传入；

getBrandWCPayRequest返回值如下表所示。

返回值	    说明
err_msg	    
            get_brand_wcpay_request:ok  支付成功
            get_brand_wcpay_request:cancel 支付过程中用户取消
            get_brand_wcpay_request:fail 支付失败

JS API的返回结果 get_brand_wcpay_request:ok 仅在用户成功完成支付时返回。
由于前端交互复杂，get_brand_wcpay_request:cancel 或者 get_brand_wcpay_request:fail 可以统一处理为用户遇到错误或者主动放弃，不必细化区分。