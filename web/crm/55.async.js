(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[55],{KnTa:function(e,t,a){e.exports={tableList:"antd-pro\\pages\\-operator\\-operator-list-tableList",tableListOperator:"antd-pro\\pages\\-operator\\-operator-list-tableListOperator",tableListForm:"antd-pro\\pages\\-operator\\-operator-list-tableListForm",submitButtons:"antd-pro\\pages\\-operator\\-operator-list-submitButtons"}},U3V5:function(e,t,a){"use strict";var l=a("g09b"),r=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("IzEo");var n=l(a("bx4M"));a("14J3");var o=l(a("BMrR"));a("+L6B");var d=l(a("2/Rp"));a("jCWc");var u=l(a("kPKH")),s=l(a("p0pE")),i=l(a("2Taf")),f=l(a("vZ4D")),c=l(a("l4Ni")),p=l(a("ujKo")),m=l(a("MhPg"));a("7Kak");var h=l(a("9yH6"));a("OaEy");var v=l(a("2fM7"));a("5NDa");var b=l(a("5rEg"));a("FJo9");var y=l(a("L41K"));a("y8nQ");var E,g,F,w,L=l(a("Vl3Y")),k=r(a("q1tI")),V=a("LLXN"),S=a("MuoO"),M=l(a("usdK")),x=(l(a("wd/R")),l(a("i9A2"))),O=l(a("zHco")),R=l(a("KnTa")),T=L.default.Item,C=(y.default.Step,b.default.TextArea,v.default.Option),D=(h.default.Group,function(e){return Object.keys(e).map(function(t){return e[t]}).join(",")}),I=(E=(0,S.connect)(function(e){var t=e.operatorlist,a=e.loading;return{operatorlist:t,loading:a.models.operatorlist}}),g=L.default.create(),E(F=g((w=function(e){function t(){var e,a;(0,i.default)(this,t);for(var l=arguments.length,r=new Array(l),n=0;n<l;n++)r[n]=arguments[n];return a=(0,c.default)(this,(e=(0,p.default)(t)).call.apply(e,[this].concat(r))),a.state={modalVisible:!1,updateModalVisible:!1,expandForm:!1,selectedRows:[],formValues:{},stepFormValues:{}},a.columns=[{title:"\u767b\u5f55\u540d",dataIndex:"login_name"},{title:"\u7ec8\u7aef\u7801",dataIndex:"cid"},{title:"\u8d26\u6237\u4f59\u989d",dataIndex:"balance"},{title:"\u5907\u6ce8",dataIndex:"remark"},{title:"\u64cd\u4f5c",render:function(e,t){return k.default.createElement(k.Fragment,null,k.default.createElement("a",{onClick:function(){return a.handleDeal(!0,t)}},1==t.state&&"\u7981\u7528",0==t.state&&"\u542f\u7528")," |",k.default.createElement("a",{onClick:function(){return a.handleTransfer(t)}},"\u8f6c\u8d26"))}}],a.handleStandardTableChange=function(e,t,l){var r=a.props.dispatch,n=a.state.formValues,o=Object.keys(t).reduce(function(e,a){var l=(0,s.default)({},e);return l[a]=D(t[a]),l},{}),d=(0,s.default)({currentPage:e.current,pageSize:e.pageSize},n,o);l.field&&(d.sorter="".concat(l.field,"_").concat(l.order)),r({type:"operatorlist/fetch",payload:d})},a.handleFormReset=function(){var e=a.props,t=e.form,l=e.dispatch;t.resetFields(),a.setState({formValues:{}}),l({type:"operatorlist/fetch",payload:{}})},a.handleSearch=function(e){e.preventDefault();var t=a.props,l=t.dispatch,r=t.form;r.validateFields(function(e,t){if(!e){var r=(0,s.default)({},t);a.setState({formValues:r}),l({type:"operatorlist/fetch",payload:r})}})},a.handleTransfer=function(e){M.default.push("/wallet/walletpay?id=".concat(e.cid))},a.handleDeal=function(e,t){var l=a.props,r=l.dispatch,n=l.form;r({type:"operatorlist/change",payload:{id:t.id,state:1==t.state?0:1}}).then(function(e){0===e.code&&n.validateFields(function(e,t){if(!e){var l=(0,s.default)({},t);a.setState({formValues:l}),r({type:"operatorlist/fetch",payload:l})}})})},a}return(0,m.default)(t,e),(0,f.default)(t,[{key:"componentDidMount",value:function(){var e=this.props.dispatch;e({type:"operatorlist/fetch"})}},{key:"renderForm",value:function(){var e=this.props.form.getFieldDecorator;return k.default.createElement(L.default,{onSubmit:this.handleSearch,layout:"inline"},k.default.createElement(o.default,{gutter:{md:16,lg:24,xl:48}},k.default.createElement(u.default,{md:12,sm:24},k.default.createElement(T,{label:"\u64cd\u4f5c\u5458\u767b\u5f55\u540d\uff1a"},e("login_name")(k.default.createElement(b.default,{placeholder:"\u8bf7\u8f93\u5165"})))),k.default.createElement(u.default,{md:6,sm:24},k.default.createElement(T,{label:"\u72b6\u6001\uff1a"},e("state")(k.default.createElement(v.default,{placeholder:"\u8bf7\u9009\u62e9",style:{width:"100%"}},k.default.createElement(C,{value:""},"\u5168\u90e8"),k.default.createElement(C,{value:"1"},"\u6b63\u5e38"),k.default.createElement(C,{value:"0"},"\u4f5c\u5e9f"))))),k.default.createElement(u.default,{md:6,sm:24},k.default.createElement("span",{className:R.default.submitButtons},k.default.createElement(d.default,{type:"primary",htmlType:"submit"},"\u641c\u7d22"),k.default.createElement(d.default,{style:{marginLeft:8},onClick:this.handleFormReset},"\u91cd\u7f6e")))))}},{key:"render",value:function(){var e=this.props,t=e.operatorlist.data,a=e.loading,l=this.state,r=l.selectedRows;l.modalVisible,l.updateModalVisible,l.stepFormValues;return k.default.createElement(O.default,{title:(0,V.formatMessage)({id:"menu.operator.operatorlist"})},k.default.createElement(n.default,{bordered:!1},k.default.createElement("div",{className:R.default.tableList},k.default.createElement("div",{className:R.default.tableListForm},this.renderForm()),k.default.createElement("div",{className:R.default.tableListOperator}),k.default.createElement(x.default,{selectedRows:r,loading:a,data:t,columns:this.columns,onSelectRow:null,onChange:this.handleStandardTableChange}))))}}]),t}(k.PureComponent),F=w))||F)||F),K=I;t.default=K}}]);