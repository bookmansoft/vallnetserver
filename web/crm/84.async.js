(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[84],{ncuP:function(e,t,a){"use strict";var l=a("g09b"),n=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("IzEo");var d=l(a("bx4M"));a("14J3");var u=l(a("BMrR"));a("+L6B");var r=l(a("2/Rp"));a("jCWc");var i=l(a("kPKH"));a("5NDa");var o=l(a("5rEg")),s=l(a("p0pE")),f=l(a("2Taf")),c=l(a("vZ4D")),p=l(a("l4Ni")),m=l(a("ujKo")),h=l(a("MhPg"));a("OaEy");var v=l(a("2fM7"));a("y8nQ");var g,y,E,b,w=l(a("Vl3Y")),V=n(a("q1tI")),F=a("MuoO"),_=l(a("wd/R")),M=l(a("i9A2")),k=l(a("zHco")),S=l(a("eCrs")),x=w.default.Item,I=v.default.Option,C=function(e){return Object.keys(e).map(function(t){return e[t]}).join(",")},R=(g=(0,F.connect)(function(e){var t=e.fundingauditlist,a=e.gamelist,l=e.loading;return{fundingauditlist:t,gamelist:a,loading:l.models.fundingauditlist}}),y=w.default.create(),g(E=y((b=function(e){function t(){var e,a;(0,f.default)(this,t);for(var l=arguments.length,n=new Array(l),d=0;d<l;d++)n[d]=arguments[d];return a=(0,p.default)(this,(e=(0,m.default)(t)).call.apply(e,[this].concat(n))),a.state={modalVisible:!1,updateModalVisible:!1,expandForm:!1,selectedRows:[],formValues:{},stepFormValues:{},aa:5},a.columns=[{title:"\u5e8f\u53f7",dataIndex:"id"},{title:"\u6e38\u620f\u5168\u540d",dataIndex:"cp_text"},{title:"\u6e38\u620f\u7c7b\u578b",dataIndex:"cp_type"},{title:"\u63d0\u4ea4\u65f6\u95f4",dataIndex:"modify_date",render:function(e){return V.default.createElement("span",null,(0,_.default)(1e3*e).format("YYYY-MM-DD HH:mm:ss"))}},{title:"\u62df\u53d1\u884c\u51ed\u8bc1\u603b\u91cf",dataIndex:"stock_num"},{title:"\u7b79\u6b3e\u76ee\u6807\u91d1\u989d(\u5343\u514b)",dataIndex:"total_amount",render:function(e){return V.default.createElement("span",null,parseInt(e/100)/1e3)}},{title:"\u64cd\u4f5c",render:function(e,t){return V.default.createElement(V.Fragment,null,V.default.createElement("a",{onClick:function(){return a.handleView(!0,t)}},"\u8be6\u60c5"),"\xa0")}}],a.handleStandardTableChange=function(e,t,l){var n=a.props.dispatch,d=a.state.formValues,u=Object.keys(t).reduce(function(e,a){var l=(0,s.default)({},e);return l[a]=C(t[a]),l},{}),r=(0,s.default)({currentPage:e.current,pageSize:e.pageSize},d,u);l.field&&(r.sorter="".concat(l.field,"_").concat(l.order)),n({type:"fundingauditlist/fetch",payload:r})},a.handleFormReset=function(){a.state.aa=6;var e=a.props,t=e.form,l=e.dispatch;t.resetFields(),a.setState({formValues:{}}),l({type:"fundingauditlist/fetch",payload:{}})},a.handleSearch=function(e){e.preventDefault();var t=a.props,l=t.dispatch,n=t.form;n.validateFields(function(e,t){if(!e){var n=(0,s.default)({},t,{updatedAt:t.updatedAt&&t.updatedAt.valueOf()});a.setState({formValues:n}),l({type:"fundingauditlist/fetch",payload:n})}})},a.handleView=function(e,t){console.log(t),2==t.audit_state_id?a.props.history.push("./fundingview?id=".concat(t.id)):a.props.history.push("./fundingauditview?id=".concat(t.id))},a.handleDeal=function(e,t){a.setState({updateModalVisible:!!e,stepFormValues:t||{}})},a}return(0,h.default)(t,e),(0,c.default)(t,[{key:"componentDidMount",value:function(){var e=this.props.dispatch;e({type:"gamelist/fetchCpType"})}},{key:"renderForm",value:function(){var e=this.props.form.getFieldDecorator;return V.default.createElement(w.default,{onSubmit:this.handleSearch,layout:"inline"},V.default.createElement(u.default,{gutter:16},V.default.createElement(i.default,{span:6},V.default.createElement(x,{label:"\u6e38\u620f\u5168\u540d\uff1a"},e("cp_text")(V.default.createElement(o.default,{placeholder:"\u8bf7\u8f93\u5165"})))),V.default.createElement(i.default,{span:6},V.default.createElement(x,{label:"\u5ba1\u6838\u72b6\u6001\uff1a"},e("audit_state_id",{initialValue:"1"})(V.default.createElement(v.default,{placeholder:"\u8bf7\u9009\u62e9",style:{width:"100%"}},V.default.createElement(I,{value:"1"},"\u672a\u5ba1\u6838"),V.default.createElement(I,{value:"2"},"\u5df2\u5ba1\u6838"))))),V.default.createElement(i.default,{span:6},V.default.createElement("span",{className:S.default.submitButtons},V.default.createElement(r.default,{type:"primary",htmlType:"submit"},"\u641c\u7d22"),V.default.createElement(r.default,{style:{marginLeft:8},onClick:this.handleFormReset},"\u91cd\u7f6e")))))}},{key:"render",value:function(){var e=this.props,t=e.fundingauditlist.data,a=e.loading,l=this.state,n=l.selectedRows;l.modalVisible,l.updateModalVisible,l.stepFormValues;return V.default.createElement(k.default,{title:"\u5f85\u5ba1\u6838\u5217\u8868(\u4f17\u7b79)"},V.default.createElement(d.default,{bordered:!1},V.default.createElement("div",{className:S.default.tableList},V.default.createElement("div",{className:S.default.tableListForm},this.renderForm()),V.default.createElement("div",{className:S.default.tableListOperator}),V.default.createElement(M.default,{selectedRows:n,loading:a,data:t,columns:this.columns,onSelectRow:null,onChange:this.handleStandardTableChange}))))}}]),t}(V.PureComponent),E=b))||E)||E),D=R;t.default=D}}]);