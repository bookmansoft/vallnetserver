(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[60],{lUya:function(e,t,a){"use strict";var l=a("g09b"),n=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("IzEo");var i=l(a("bx4M"));a("2qtc");var s=l(a("kLXV")),d=l(a("jehZ"));a("14J3");var r=l(a("BMrR"));a("+L6B");var u=l(a("2/Rp"));a("jCWc");var o=l(a("kPKH"));a("5NDa");var c=l(a("5rEg")),f=l(a("p0pE")),m=l(a("2Taf")),p=l(a("vZ4D")),h=l(a("l4Ni")),b=l(a("ujKo")),y=l(a("MhPg"));a("OaEy");var k=l(a("2fM7"));a("y8nQ");var v,g,E,S,C=l(a("Vl3Y")),F=a("LLXN"),L=n(a("q1tI")),w=a("MuoO"),O=(l(a("wd/R")),l(a("i9A2"))),V=l(a("zHco")),N=l(a("v8Uv")),A=C.default.Item,B=(k.default.Option,function(e){return Object.keys(e).map(function(t){return e[t]}).join(",")}),x=(v=(0,w.connect)(function(e){var t=e.stocklist,a=e.gamelist,l=e.loading;return{stocklist:t,gamelist:a,loading:l.models.stocklist}}),g=C.default.create(),v(E=g((S=function(e){function t(){var e,a;(0,m.default)(this,t);for(var l=arguments.length,n=new Array(l),i=0;i<l;i++)n[i]=arguments[i];return a=(0,h.default)(this,(e=(0,b.default)(t)).call.apply(e,[this].concat(n))),a.state={modalVisible:!1,updateModalVisible:!1,expandForm:!1,selectedRows:[],formValues:{},stepFormValues:{},current:{},purchase:{loading:!1,visible:!1},bid:{loading:!1,visible:!1}},a.columns=[{title:"\u6e38\u620f\u7f16\u53f7",dataIndex:"cid"},{title:"\u6301\u6709\u5730\u5740",dataIndex:"addr"},{title:"\u6301\u6709\u603b\u6570",dataIndex:"sum"},{title:"\u6301\u6709\u6210\u672c",dataIndex:"price"},{title:"\u6302\u5355\u6570\u91cf",dataIndex:"sell_sum"},{title:"\u6302\u5355\u4ef7\u683c",dataIndex:"sell_price"},{title:"\u64cd\u4f5c",render:function(e,t){return L.default.createElement(L.Fragment,null,L.default.createElement("a",{onClick:function(){return a.handleSend(!0,t)}},"\u8d60\u9001"),"\xa0",L.default.createElement("a",{onClick:function(){return a.handleBid(!0,t)}},"\u62cd\u5356"),"\xa0")}}],a.handleStandardTableChange=function(e,t,l){var n=a.props.dispatch,i=a.state.formValues,s=Object.keys(t).reduce(function(e,a){var l=(0,f.default)({},e);return l[a]=B(t[a]),l},{}),d=(0,f.default)({currentPage:e.current,pageSize:e.pageSize},i,s);l.field&&(d.sorter="".concat(l.field,"_").concat(l.order)),n({type:"stocklist/mystock",payload:d})},a.handleFormReset=function(){var e=a.props,t=e.form,l=e.dispatch;t.resetFields(),a.setState({formValues:{}}),l({type:"stocklist/mystock",payload:{}})},a.handleSearch=function(e){e.preventDefault();var t=a.props,l=t.dispatch,n=t.form;n.validateFields(function(e,t){if(!e){var n=(0,f.default)({},t,{updatedAt:t.updatedAt&&t.updatedAt.valueOf()});a.setState({formValues:n}),l({type:"stocklist/mystock",payload:n})}})},a.handleSend=function(e,t){a.setState({current:t,purchase:{visible:!0}})},a.handleBid=function(e,t){a.setState({current:t,bid:{visible:!0}})},a}return(0,y.default)(t,e),(0,p.default)(t,[{key:"componentDidMount",value:function(){var e=this.props.dispatch;e({type:"stocklist/mystock"}),e({type:"gamelist/fetchCpType"})}},{key:"handleOk",value:function(e){var t=this,a=this.props,l=a.dispatch,n=a.form;e.preventDefault(),this.setState({purchase:{loading:!0,visible:!0}}),n.validateFieldsAndScroll(function(e,a){e?(n.resetFields(),t.setState({purchase:{visible:!1,loading:!1}})):t.props.dispatch({type:"stocklist/sendstock",payload:{cid:t.state.current.cid,srcAddr:t.state.current.addr,num:a["stockNum"],address:a["address"]}}).then(function(e){l({type:"stocklist/mystock"}),n.resetFields(),t.setState({purchase:{visible:!1,loading:!1}})}).catch(function(e){n.resetFields(),t.setState({purchase:{visible:!1,loading:!1}})})})}},{key:"handleCancel",value:function(){this.setState({purchase:{visible:!1}})}},{key:"handleOkBid",value:function(e){var t=this,a=this.props,l=a.dispatch,n=a.form;e.preventDefault(),this.setState({bid:{loading:!0,visible:!0}}),n.validateFieldsAndScroll(function(e,a){e?(n.resetFields(),t.setState({bid:{visible:!1,loading:!1}})):t.props.dispatch({type:"stocklist/bidstock",payload:{cid:t.state.current.cid,srcAddr:t.state.current.addr,num:a["stockNum"],price:1e5*a["price"]}}).then(function(e){l({type:"stocklist/mystock"}),n.resetFields(),t.setState({bid:{visible:!1,loading:!1}})}).catch(function(e){n.resetFields(),t.setState({bid:{visible:!1,loading:!1}})})})}},{key:"handleCancelBid",value:function(){this.setState({bid:{visible:!1}})}},{key:"renderForm",value:function(){var e=this.props.form.getFieldDecorator;return L.default.createElement(C.default,{onSubmit:this.handleSearch,layout:"inline"},L.default.createElement(r.default,{gutter:{md:16,lg:24,xl:48}},L.default.createElement(o.default,{md:6,sm:9},L.default.createElement(A,{label:"\u6e38\u620f\u5168\u540d\uff1a"},e("cp_text")(L.default.createElement(c.default,{placeholder:"\u8bf7\u8f93\u5165"})))),L.default.createElement(o.default,{md:6,sm:9},L.default.createElement("span",{className:N.default.submitButtons},L.default.createElement(u.default,{type:"primary",htmlType:"submit"},"\u641c\u7d22"),L.default.createElement(u.default,{style:{marginLeft:8},onClick:this.handleFormReset},"\u91cd\u7f6e")))))}},{key:"render",value:function(){var e=this,t=this.props,a=t.stocklist.myStock,l=t.loading,n=t.form.getFieldDecorator,r=this.state,u=r.selectedRows,o=(r.modalVisible,r.updateModalVisible,r.stepFormValues,function(t){return t=t||{},L.default.createElement(C.default,{onSubmit:e.handleOk.bind(e)},L.default.createElement(A,(0,d.default)({label:"\u8d60\u9001\u6570\u91cf"},e.formLayout),n("stockNum",{rules:[{required:!1,message:"\u8bf7\u8f93\u5165\u8d60\u9001\u6570\u91cf"}],initialValue:0})(L.default.createElement(c.default,{addonAfter:"\u4ef6",style:{width:"50%"}}))),L.default.createElement(A,(0,d.default)({label:"\u76ee\u6807\u5730\u5740"},e.formLayout),n("address",{rules:[{required:!1,message:"\u8bf7\u8f93\u5165\u76ee\u6807\u5730\u5740"}],initialValue:""})(L.default.createElement(c.default,{style:{width:"50%"}}))),L.default.createElement(A,(0,d.default)({label:"\u5f52\u5c5e\u6e38\u620f"},e.formLayout),"".concat(t.cid)),L.default.createElement(A,(0,d.default)({label:"\u5e93\u5b58\u548c\u6210\u672c"},e.formLayout),"\u5171 ".concat(t.sum," \u4ef6 ").concat(t.price/100/1e3," \u5343\u514b / \u4ef6")))}),f=function(t){return t=t||{},L.default.createElement(C.default,{onSubmit:e.handleOkBid.bind(e)},L.default.createElement(A,(0,d.default)({label:"\u62cd\u5356\u6570\u91cf"},e.formLayout),n("stockNum",{rules:[{required:!1,message:"\u8bf7\u8f93\u5165\u62cd\u5356\u6570\u91cf"}],initialValue:0})(L.default.createElement(c.default,{addonAfter:"\u4ef6",style:{width:"50%"}}))),L.default.createElement(A,(0,d.default)({label:"\u62cd\u5356\u4ef7\u683c"},e.formLayout),n("price",{rules:[{required:!1,message:"\u8bf7\u8f93\u5165\u62cd\u5356\u4ef7\u683c"}],initialValue:""})(L.default.createElement(c.default,{addonAfter:"\u5343\u514b",style:{width:"50%"}}))),L.default.createElement(A,(0,d.default)({label:"\u5f52\u5c5e\u6e38\u620f"},e.formLayout),"".concat(t.cid)),L.default.createElement(A,(0,d.default)({label:"\u5e93\u5b58\u548c\u6210\u672c"},e.formLayout),"\u5171 ".concat(t.sum," \u4ef6 ").concat(t.price/100/1e3," \u5343\u514b / \u4ef6")))};return L.default.createElement(V.default,{title:(0,F.formatMessage)({id:"menu.stock.mystock"})},L.default.createElement(s.default,{ref:"modal",width:800,destroyOnClose:!0,onCancel:this.handleCancel.bind(this),visible:this.state.purchase.visible,title:"\u8f6c\u8ba9\u6e38\u620f\u51ed\u8bc1",footer:[L.default.createElement("button",{key:"back",className:"ant-btn ant-btn-primary",onClick:this.handleCancel.bind(this)},"\u8fd4 \u56de"),L.default.createElement("button",{key:"submit",className:"ant-btn ant-btn-primary "+(this.state.purchase.loading?"ant-btn-loading":""),onClick:this.handleOk.bind(this)},"\u63d0 \u4ea4")]},o(this.state.current)),L.default.createElement(s.default,{ref:"modal",width:800,destroyOnClose:!0,onCancel:this.handleCancelBid.bind(this),visible:this.state.bid.visible,title:"\u62cd\u5356\u6e38\u620f\u51ed\u8bc1",footer:[L.default.createElement("button",{key:"back",className:"ant-btn ant-btn-primary",onClick:this.handleCancelBid.bind(this)},"\u8fd4 \u56de"),L.default.createElement("button",{key:"submit",className:"ant-btn ant-btn-primary "+(this.state.bid.loading?"ant-btn-loading":""),onClick:this.handleOkBid.bind(this)},"\u63d0 \u4ea4")]},f(this.state.current)),L.default.createElement(i.default,{bordered:!1},L.default.createElement("div",{className:N.default.tableList},L.default.createElement("div",{className:N.default.tableListForm},this.renderForm()),L.default.createElement("div",{className:N.default.tableListOperator}),L.default.createElement(O.default,{selectedRows:u,loading:l,data:a,columns:this.columns,onSelectRow:null,onChange:this.handleStandardTableChange}))))}}]),t}(L.PureComponent),E=S))||E)||E),M=x;t.default=M},v8Uv:function(e,t,a){e.exports={tableList:"antd-pro\\pages\\-stock\\-my-stock-tableList",tableListOperator:"antd-pro\\pages\\-stock\\-my-stock-tableListOperator",tableListForm:"antd-pro\\pages\\-stock\\-my-stock-tableListForm",submitButtons:"antd-pro\\pages\\-stock\\-my-stock-submitButtons"}}}]);