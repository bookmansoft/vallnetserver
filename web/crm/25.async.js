(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[25],{pTqt:function(e,t,a){"use strict";var r=a("g09b"),l=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("+L6B");var n=r(a("2/Rp"));a("jCWc");var o=r(a("kPKH"));a("IzEo");var d=r(a("bx4M")),u=r(a("jehZ")),p=r(a("2Taf")),s=r(a("vZ4D")),i=r(a("l4Ni")),c=r(a("ujKo")),f=r(a("MhPg"));a("OaEy");var m=r(a("2fM7"));a("2qtc");var h=r(a("kLXV"));a("y8nQ");var g,y,b,v,E=r(a("Vl3Y")),k=l(a("q1tI")),P=a("MuoO"),C=a("LLXN"),S=r(a("zHco")),w=r(a("3a4m")),A=E.default.Item,_=h.default.confirm,x=m.default.Option,M=(g=(0,P.connect)(function(e){var t=e.gameprops,a=e.loading;return{gameprops:t,loading:a.models.gameprops}}),y=E.default.create(),g(b=y((v=function(e){function t(){var e,a;(0,p.default)(this,t);for(var r=arguments.length,l=new Array(r),n=0;n<r;n++)l[n]=arguments[n];return a=(0,i.default)(this,(e=(0,c.default)(t)).call.apply(e,[this].concat(l))),a.state={visible:!1,currentAddr:[],selectedRowKeys:[],stock:0,confirmed:0,currentPropDetail:{},totalPrice:0},a.handleSubmit=function(e){var t=a.props,r=t.dispatch,l=t.form;e.preventDefault(),l.validateFieldsAndScroll(function(e,t){var l=a.state.currentAddr,n=t.belongProps;""!=n?0!=l.length?""!=n&&l.length>0?r({type:"gameprops/sendlistremote",payload:{id:n,addr:l}}).then(function(e){return 1==e.code?void _({title:"\u8d60\u9001\u6210\u529f",content:"\u9053\u5177\u8d60\u9001\u6210\u529f\uff01",okText:"\u8fd4\u56de\u9053\u5177\u5217\u8868",okType:"primary",cancelText:"\u8d60\u9001\u9053\u5177",cancelType:"primary",onOk:function(){w.default.push("/gameprops/list")},onCancel:function(){w.default.push("/usermgr/userlist")}}):void h.default.error({title:"\u9519\u8bef",content:e.msg||"\u8d60\u9001\u5931\u8d25\u8bf7\u91cd\u8bd5\uff01"})}):h.default.error({title:"\u9519\u8bef",content:"\u8d60\u9001\u5931\u8d25\u8bf7\u91cd\u8bd5\uff01"}):h.default.error({title:"\u9519\u8bef",content:"\u8bf7\u9009\u62e9\u7528\u6237\uff01"}):h.default.error({title:"\u9519\u8bef",content:"\u9053\u5177\u9009\u62e9\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01"})})},a.handleGameChange=function(e){var t=a.props,r=t.form,l=t.dispatch;r.setFieldsValue({belongProps:""}),"undefined"!=typeof e&&""!=e&&l({type:"gameprops/getAllPropsByParams",payload:{cid:e}})},a.onPropsChange=function(e){var t=a.props.dispatch,r=e;r&&t({type:"gameprops/propsDetailReturn",payload:{id:r}}).then(function(e){if(0===e.code){var t=a.state.currentAddr,r=e.data,l=parseInt(r.props_rank);l=1==l?.05:2==l?.1:3==l?.2:4==l?.5:5==l?.8:.05;var n=t.length*r.props_price*l;n=Math.round(n/1e5*1e5)/1e5,a.setState({currentPropDetail:r,totalPrice:n})}})},a}return(0,f.default)(t,e),(0,s.default)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.dispatch,a=this.props.match.params.addr||"";""!=a&&(a=JSON.parse(a),this.setState({currentAddr:a})),t({type:"gameprops/getAllGameList",payload:{}}),t({type:"gameprops/getBalanceAll",payload:{}}).then(function(t){0===t.code&&e.setState({confirmed:JSON.stringify(t.data.confirmed)})})}},{key:"getRankNote",value:function(e){var t="";switch(parseInt(e)){case 1:t="5%(\u767d)";break;case 2:t="10%(\u7eff)";break;case 3:t="20%(\u84dd)";break;case 4:t="50%(\u7d2b)";break;case 5:t="80%(\u6a59)";break;default:t="";break}return t}},{key:"render",value:function(){var e=this.props,t=e.submitting,a=e.gameprops,r=a.gameList,l=a.propByParams,p=e.form.getFieldDecorator,s=this.state,i=s.currentAddr,c=s.currentPropDetail,f=s.totalPrice,h=s.confirmed,g={labelCol:{xs:{span:24},sm:{span:2}},wrapperCol:{xs:{span:24},sm:{span:12},md:{span:10}}},y={wrapperCol:{xs:{span:24,offset:0},sm:{span:10,offset:7}}};return k.default.createElement(S.default,{title:"\u9053\u5177\u8d60\u9001"},k.default.createElement(E.default,{onSubmit:this.handleSubmit,hideRequiredMark:!0,style:{marginTop:8}},k.default.createElement(d.default,{title:"\u5df2\u9009\u62e9\u8d60\u9001\u5bf9\u8c61",bordered:!1,headStyle:{fontWeight:600}},k.default.createElement(A,(0,u.default)({},g,{label:"\u5df2\u6dfb\u52a0\u63a5\u6536\u4eba\u6570\u91cf"}),i.length," \u4eba")),k.default.createElement(d.default,{title:"\u9009\u62e9\u9053\u5177",bordered:!1,headStyle:{fontWeight:600}},k.default.createElement(A,(0,u.default)({},g,{label:"\u9009\u62e9\u6e38\u620f\u53ca\u9053\u5177"}),k.default.createElement(o.default,{span:11},k.default.createElement(A,null,p("belongGame",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u6e38\u620f"}]})(k.default.createElement(m.default,{onChange:this.handleGameChange},r.map(function(e){return k.default.createElement(x,{key:e.cp_id,value:e.cp_id},e.cp_text)}))))),k.default.createElement(o.default,{span:11},k.default.createElement(A,null,p("belongProps",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u9053\u5177"}]})(k.default.createElement(m.default,{onChange:this.onPropsChange},l.map(function(e){return k.default.createElement(x,{key:e.id},e.props_name)}))))))),k.default.createElement(d.default,{title:"\u7ed3\u7b97",bordered:!1,headStyle:{fontWeight:600}},k.default.createElement(A,(0,u.default)({},g,{label:"\u9053\u5177\u5546\u57ce\u6807\u4ef7"}),c.props_price?parseFloat(c.props_price/1e5).toFixed(3):"","\u5343\u514b/\u4ef6"),k.default.createElement(A,(0,u.default)({},g,{label:"\u9053\u5177\u542b\u91d1\u7b49\u7ea7"}),this.getRankNote(c.props_rank)),k.default.createElement(A,(0,u.default)({},g,{label:"\u672c\u6b21\u8d60\u9001\u5c06\u6d88\u8017"}),f," \u5343\u514b"),k.default.createElement(A,(0,u.default)({},g,{label:"\u8d26\u6237\u5907\u7528\u91d1\u4f59\u989d"}),parseFloat(h/1e5).toFixed(3),"\u5343\u514b")),k.default.createElement(A,(0,u.default)({},y,{style:{marginTop:32}}),k.default.createElement(n.default,{type:"primary",htmlType:"submit",loading:t},"\u786e\u5b9a\u8d60\u9001"),k.default.createElement(n.default,{style:{marginLeft:8}},k.default.createElement(C.FormattedMessage,{id:"form.cancel"})))))}}]),t}(k.PureComponent),b=v))||b)||b),T=M;t.default=T}}]);