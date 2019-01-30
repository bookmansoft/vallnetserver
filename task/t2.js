var str = "nonce_str mch_billno mch_id appid bill_type";
var strArr=str.split(/\s+/gi);
var s1 = Array.prototype.sort.call(strArr,function(a,b){
	for(var i=0; i<a.length;i++){
		if(a.charCodeAt(i)==b.charCodeAt(i)) continue;
		return a.charCodeAt(i) - b.charCodeAt(i);
	}
});
console.log(s1)