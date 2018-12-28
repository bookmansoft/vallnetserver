let request = require('request')
let cache = require('memory-cache')
let sha1 = require('sha1')
let config = require('./wechat.cfg')

function getSign(url, callback) {
    var noncestr = config.noncestr,
        timestamp = Math.floor(Date.now()/1000), //精确到秒
        jsapi_ticket;
    /*
    if(cache.get('ticket')){
        jsapi_ticket = cache.get('ticket');
        console.log('1' + 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url);
        callback({
            noncestr:noncestr,
            timestamp:timestamp,
            url:url,
            jsapi_ticket:jsapi_ticket,
            signature:sha1('jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
        });
    }else{
        request(config.accessTokenUrl + '?grant_type=' + config.grant_type + '&appid=' + config.appid + '&secret=' + config.secret ,function(error, response, body){
            if (!error && response.statusCode == 200) {
                var tokenMap = JSON.parse(body);
                request(config.ticketUrl + '?access_token=' + tokenMap.access_token + '&type=jsapi', function(error, resp, json){
                    if (!error && response.statusCode == 200) {
                        var ticketMap = JSON.parse(json);
                        cache.put('ticket',ticketMap.ticket,config.cache_duration);  //加入缓存
                        console.log('jsapi_ticket=' + ticketMap.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url);
                        callback({
                            noncestr:noncestr,
                            timestamp:timestamp,
                            url: url,
                            jsapi_ticket:ticketMap.ticket,
                            //signature:sha1('jsapi_ticket=' + ticketMap.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
                            //signature:sha1('&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
                            signature:sha1('&noncestr=' + noncestr + '&timestamp=' + timestamp)
                        });
                    }
                })
            }
        })
    }
    */
    request(config.accessTokenUrl + '?grant_type=' + config.grant_type + '&appid=' + config.appid + '&secret=' + config.secret ,function(error, response, body){
        if (!error && response.statusCode == 200) {
            //console.log("tokenMap " + body);
            var tokenMap = JSON.parse(body);
            request(config.ticketUrl + '?access_token=' + tokenMap.access_token + '&type=jsapi', function(error, resp, json){
                if (!error && response.statusCode == 200) {
                    var ticketMap = JSON.parse(json);
                    //console.log("ticketMap " + json);
                    cache.put('ticket', ticketMap.ticket, config.cache_duration);  //加入缓存
                    //console.log('jsapi_ticket=' + ticketMap.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url);
                    callback({
                        debug: true,
                        noncestr: noncestr,
                        timestamp: timestamp,
                        url: url,
                        jsapi_ticket: ticketMap.ticket,
                        signature: sha1('jsapi_ticket=' + ticketMap.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
                        //signature:sha1('&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
                        //signature:sha1('&noncestr=' + noncestr + '&timestamp=' + timestamp)
                    });
                }
            })
        }
    })
}

exports.sign = getSign