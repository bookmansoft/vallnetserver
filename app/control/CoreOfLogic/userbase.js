let facade = require('gamecloud')
let {ReturnCode, NotifyType} = facade.const
let tableType = require('../../util/tabletype');

/**
 * 部分测试流程
 * Updated by liub on 2017-05-05.
 */
class userbase extends facade.Control
{
    /**
     * 列表
     * @param {*} user 
     * @param {*} objData 
     */
    List(user, objData) {
        objData.id = objData.id || 1;
        let muster = facade.GetMapping(tableType.userBase) //得到 Mapping 对象
            .groupOf() // 将 Mapping 对象转化为 Collection 对象，如果 Mapping 对象支持分组，可以带分组参数调用
            .orderby('id', 'desc') //根据id字段倒叙排列
            .paginate(5, objData.id, ['id', 'user_name']); //每页5条，显示第${objData.id}页，只选取'id'和'user_name'字段
        
        let $data = {items:[]};
        $data.total = muster.pageNum;
        $data.page = muster.pageCur;

        let $idx = (muster.pageCur-1) * muster.pageSize;
        for(let $value of muster.records()){
            $data.items[$idx] = {id: $value['id'], user_name: $value['user_name'], rank: $idx};
            $idx++ ;
        }
        return {code: ReturnCode.Success, data: $data};
    }

    /**
     * 验证码登录
     */
    MobileVerify(user, params) {
        let mobile = params.mobile
        let code = params.code
    }

    /**
     * 获取验证码
     * @param {*} user 
     * @param {*} params 
     */
    GetVerifyCode(user, params) {
        let mobile = params.mobile
    }

}

exports = module.exports = userbase;
