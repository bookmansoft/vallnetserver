(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[35],{"0RLS":function(e,t,a){e.exports={tableList:"antd-pro\\pages\\-user-mgr\\-user-list-tableList",tableListOperator:"antd-pro\\pages\\-user-mgr\\-user-list-tableListOperator",tableListForm:"antd-pro\\pages\\-user-mgr\\-user-list-tableListForm",submitButtons:"antd-pro\\pages\\-user-mgr\\-user-list-submitButtons"}},A9dZ:function(e,t,a){e.exports={standardTable:"antd-pro\\components\\-user-list-standard-table\\index-standardTable",tableAlert:"antd-pro\\components\\-user-list-standard-table\\index-tableAlert"}},DsGC:function(e,t,a){"use strict";var l=a("284h"),r=a("TqRt");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("g9YV");var n=r(a("wCAj"));a("fOrg");var d=r(a("+KLJ"));a("+L6B");var s=r(a("2/Rp")),u=r(a("lwsE")),o=r(a("W8MJ")),i=r(a("a1gu")),c=r(a("Nsbk")),f=r(a("7W2i")),p=r(a("MVZn")),m=l(a("q1tI")),h=r(a("A9dZ"));function g(e){var t=[];return e.forEach(function(e){e.needTotal&&t.push((0,p.default)({},e,{total:0}))}),t}var v=function(e){function t(e){var a;(0,u.default)(this,t),a=(0,i.default)(this,(0,c.default)(t).call(this,e)),a.handleRowSelectChange=function(e,t){var l=a.state.needTotalList;l=l.map(function(e){return(0,p.default)({},e,{total:t.reduce(function(t,a){return t+parseFloat(a[e.dataIndex],10)},0)})});var r=a.props.onSelectRow;r&&r(t),a.setState({selectedRowKeys:e,needTotalList:l})},a.handleTableChange=function(e,t,l){var r=a.props.onChange;r&&r(e,t,l)},a.cleanSelectedKeys=function(){a.handleRowSelectChange([],[])};var l=e.columns,r=g(l);return a.state={selectedRowKeys:[],needTotalList:r},a}return(0,f.default)(t,e),(0,o.default)(t,[{key:"render",value:function(){var e=this.state,t=e.selectedRowKeys,a=(e.needTotalList,this.props),l=a.data,r=l.list,u=l.pagination,o=l.total,i=a.loading,c=a.columns,f=a.rowKey,g=a.handlePropsSend,v=(0,p.default)({showSizeChanger:!0,showQuickJumper:!0},u),y={selectedRowKeys:t,onChange:this.handleRowSelectChange,getCheckboxProps:function(e){return{disabled:e.disabled}}};return m.default.createElement("div",{className:h.default.standardTable},m.default.createElement("div",{className:h.default.tableAlert},m.default.createElement(d.default,{message:m.default.createElement(m.Fragment,null,"\u672c\u6b21\u641c\u7d22\u5230",o||"-","\u4f4d\u7528\u6237, \u5df2\u9009\u62e9   ",m.default.createElement("a",{style:{fontWeight:600}},t.length)," \u4f4d\u7528\u6237\xa0\xa0",t.length>0?m.default.createElement(s.default,{type:"primary",onClick:g,style:{marginLeft:"50%"}},"\u8d60\u9001\u9053\u5177"):m.default.createElement(s.default,{disabled:!0,style:{marginLeft:"50%"}},"\u8d60\u9001\u9053\u5177")),type:"info",showIcon:!0})),m.default.createElement(n.default,{loading:i,rowKey:f||"key",rowSelection:y,dataSource:r,columns:c,pagination:v,onChange:this.handleTableChange}))}}],[{key:"getDerivedStateFromProps",value:function(e){if(0===e.selectedRows.length){var t=g(e.columns);return{selectedRowKeys:[],needTotalList:t}}return null}}]),t}(m.PureComponent),y=v;t.default=y},cQS8:function(e,t,a){"use strict";var l=a("g09b"),r=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("IzEo");var n=l(a("bx4M"));a("14J3");var d=l(a("BMrR"));a("+L6B");var s=l(a("2/Rp"));a("jCWc");var u=l(a("kPKH"));a("2qtc");var o=l(a("kLXV")),i=l(a("p0pE")),c=l(a("2Taf")),f=l(a("vZ4D")),p=l(a("l4Ni")),m=l(a("ujKo")),h=l(a("MhPg"));a("7Kak");var g=l(a("9yH6"));a("OaEy");var v=l(a("2fM7"));a("5NDa");var y=l(a("5rEg"));a("FJo9");var b=l(a("L41K"));a("y8nQ");var E,w,S,R,L=l(a("Vl3Y")),C=r(a("q1tI")),k=a("MuoO"),T=(l(a("wd/R")),l(a("DsGC"))),F=l(a("zHco")),x=l(a("3a4m")),K=l(a("0RLS")),O=L.default.Item,V=(b.default.Step,y.default.TextArea,v.default.Option),P=(g.default.Group,function(e){return Object.keys(e).map(function(t){return e[t]}).join(",")}),_=(E=(0,k.connect)(function(e){var t=e.userlist,a=e.gamelist,l=e.loading;return{userlist:t,gamelist:a,loading:l.models.userlist}}),w=L.default.create(),E(S=w((R=function(e){function t(){var e,a;(0,c.default)(this,t);for(var l=arguments.length,r=new Array(l),n=0;n<l;n++)r[n]=arguments[n];return a=(0,p.default)(this,(e=(0,m.default)(t)).call.apply(e,[this].concat(r))),a.state={modalVisible:!1,updateModalVisible:!1,expandForm:!1,selectedRows:[],formValues:{},stepFormValues:{}},a.columns=[{title:"\u7528\u6237\u94b1\u5305\u5730\u5740",dataIndex:"addr"},{title:"\u73a9\u8fc7\u7684\u6e38\u620f\u7c7b\u578b",dataIndex:"game",render:function(e){return e||0}},{title:"\u6d88\u8d39\u91d1\u989d(\u5428)",dataIndex:"sum",render:function(e){return C.default.createElement("span",null,e/1e8)}},{title:"\u6700\u540e\u6d88\u8d39\u65f6\u95f4",dataIndex:"lastBuy",render:function(e){return e||"-"}}],a.handleSelectRows=function(e){a.setState({selectedRows:e})},a.handleStandardTableChange=function(e,t,l){var r=a.props.dispatch,n=a.state.formValues,d=Object.keys(t).reduce(function(e,a){var l=(0,i.default)({},e);return l[a]=P(t[a]),l},{}),s=(0,i.default)({currentPage:e.current,pageSize:e.pageSize},n,d);l.field&&(s.sorter="".concat(l.field,"_").concat(l.order)),r({type:"userlist/fetch",payload:s})},a.handlePropsSend=function(){a.props.dispatch;var e=a.state.selectedRows;if(e.length>0){var t=new Array,l=0,r=!0,n=!1,d=void 0;try{for(var s,u=e[Symbol.iterator]();!(r=(s=u.next()).done);r=!0){var i=s.value;t[l]=i.addr,l++}}catch(c){n=!0,d=c}finally{try{r||null==u.return||u.return()}finally{if(n)throw d}}t=JSON.stringify(t),x.default.push("/gameprops/present/"+t)}else o.default.error({title:"\u9519\u8bef",content:"\u8bf7\u9009\u62e9\u7528\u6237\uff01"})},a.handleFormReset=function(){var e=a.props,t=e.form,l=e.dispatch;t.resetFields(),a.setState({formValues:{}}),l({type:"userlist/fetch",payload:{}})},a.handleSearch=function(e){e.preventDefault();var t=a.props,l=t.dispatch,r=t.form;r.validateFields(function(e,t){if(!e){var r=(0,i.default)({},t);a.setState({formValues:r}),l({type:"userlist/fetch",payload:r})}})},a.handleDeal=function(e,t){console.log(t.addr),a.props.history.push("../gameprops/present?address="+t.addr)},a.renderOptions=function(){var e=a.props.gamelist.cp_type_list;return e?e.map(function(e){return C.default.createElement(V,{key:e.id,value:e.cp_type_id}," ",e.cp_type_id)}):""},a}return(0,h.default)(t,e),(0,f.default)(t,[{key:"componentDidMount",value:function(){var e=this.props.dispatch;e({type:"userlist/fetch"}),e({type:"gamelist/fetchCpType"})}},{key:"renderForm",value:function(){var e=this.props.form.getFieldDecorator;return C.default.createElement(L.default,{onSubmit:this.handleSearch,layout:"inline"},C.default.createElement(d.default,{gutter:{md:16,lg:24,xl:48}},C.default.createElement(u.default,{md:16,sm:24},C.default.createElement(O,{label:"\u9009\u62e9\u6e38\u620f\u7c7b\u578b\uff1a"},e("cp_type")(C.default.createElement(v.default,{placeholder:"\u8bf7\u9009\u62e9",style:{width:"100%"}},C.default.createElement(V,{value:""},"\u5168\u90e8"),this.renderOptions())))),C.default.createElement(u.default,{md:8,sm:24}),C.default.createElement(u.default,{md:16,sm:24},C.default.createElement(O,{label:"\xa0\xa0\xa0\u6700\u5c0f\u6e38\u620f\u91d1\uff1a"},e("amount")(C.default.createElement(y.default,{placeholder:"\u8bf7\u8f93\u5165"})))),C.default.createElement(u.default,{md:8,sm:24}),C.default.createElement(u.default,{md:16,sm:24},C.default.createElement(O,{label:"\u6709\u6548\u671f\uff08\u5929\uff09\uff1a"},e("max_second")(C.default.createElement(y.default,{placeholder:"\u8bf7\u8f93\u5165"})))),C.default.createElement(u.default,{md:8,sm:24},C.default.createElement("span",{className:K.default.submitButtons},C.default.createElement(s.default,{type:"primary",htmlType:"submit"},"\u641c\u7d22"),C.default.createElement(s.default,{style:{marginLeft:8},onClick:this.handleFormReset},"\u91cd\u7f6e")))))}},{key:"render",value:function(){var e=this.props,t=e.userlist.data,a=e.loading,l=this.state,r=l.selectedRows;l.modalVisible,l.updateModalVisible,l.stepFormValues;return C.default.createElement(F.default,{title:"\u7528\u6237\u5217\u8868"},C.default.createElement(n.default,{bordered:!1},C.default.createElement("div",{className:K.default.tableList},C.default.createElement("div",{className:K.default.tableListForm},this.renderForm()),C.default.createElement("div",{className:K.default.tableListOperator}),C.default.createElement(T.default,{selectedRows:r,rowKey:"rank",loading:a,data:t,columns:this.columns,onSelectRow:this.handleSelectRows,onChange:this.handleStandardTableChange,handlePropsSend:this.handlePropsSend}))))}}]),t}(C.PureComponent),S=R))||S)||S),M=_;t.default=M}}]);