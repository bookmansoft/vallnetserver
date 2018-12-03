class randomHelp {
    /**
     * 构造函数
     * @param {*}  监控对象ID
     */
    constructor(){
    }
    /**
     * 产生随机字符串和数字组合
     * @param {*} len 长度
     */
    randomString(len) {
    　　len = len || 32;
    　　var $chars = 'abcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    　　var maxPos = $chars.length;
    　　var pwd = '';
    　　for (var i = 0; i < len; i++) {
    　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　}
    　　return pwd;
    }
    
    /**
     * 产生随机数字
     * @param {*} n 个数
     */
    randomNum(n){
        var rnd="";
        for(var i=0; i<n; i++)
            rnd += Math.floor(Math.random()*10);
        return rnd;
    }

}

module.exports = randomHelp;