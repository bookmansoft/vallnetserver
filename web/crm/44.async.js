(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[44],{"2mOV":function(e,t,a){"use strict";var l=a("g09b"),n=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("IzEo");var d=l(a("bx4M")),r=l(a("jehZ"));a("+L6B");var u=l(a("2/Rp"));a("jCWc");var o=l(a("kPKH"));a("14J3");var i=l(a("BMrR")),f=l(a("2Taf")),s=l(a("vZ4D")),c=l(a("l4Ni")),m=l(a("ujKo")),p=l(a("MhPg"));a("5NDa");var g=l(a("5rEg"));a("iQDF");var h=l(a("+eQT"));a("OaEy");var E=l(a("2fM7"));a("y8nQ");var y,v,b,k,C=l(a("Vl3Y")),_=n(a("q1tI")),w=a("MuoO"),x=(a("LLXN"),l(a("3a4m"))),F=(l(a("wd/R")),l(a("zHco"))),T=(l(a("KNhs")),C.default.Item),W=E.default.Option,I=(h.default.RangePicker,g.default.TextArea),B=(y=(0,w.connect)(function(e){var t=e.fundinglist,a=e.gamelist,l=e.loading;return{fundinglist:t,gamelist:a,loading:l.models.fundinglist,submitting:l.effects["fundinglist/newFunding"]}}),v=C.default.create(),y(b=v((k=function(e){function t(){var e,a;(0,f.default)(this,t);for(var l=arguments.length,n=new Array(l),d=0;d<l;d++)n[d]=arguments[d];return a=(0,c.default)(this,(e=(0,m.default)(t)).call.apply(e,[this].concat(n))),a.state={stock_num:1,stock_amount:1,develop_text:""},a.handleCreate=function(e,t){var l=a.props,n=l.dispatch;l.form;console.log(e,t),n({type:"fundinglist/newFunding",payload:{data:e,state:t}}).then(function(e){console.log(e),0===e.code?x.default.push("/funding/fundingapplysuccess"):x.default.push("/funding/fundingapplyerror")})},a.renderImg=function(e){if(e&&e.length){var t=e.map(function(e,t){return _.default.createElement("img",{width:120,src:e,key:t})});return t}},a.handleCpidChange=function(e){var t=a.props,l=t.dispatch;t.form;l({type:"gamelist/getGameRecord",payload:{id:e}})},a.handleStockNumChange=function(e){a.state.stock_num=parseInt(e.target.value)},a.handleStockAmountChange=function(e){a.state.stock_amount=parseInt(e.target.value)},a.handleDevelopTextChange=function(e){console.log(e.target.value),a.state.develop_text=e.target.value},a.renderOptions=function(){var e=a.props.fundinglist.cp_list;return e?e.map(function(e){return _.default.createElement(W,{key:e.id,value:e.id}," ",e.cp_text)}):""},a}return(0,p.default)(t,e),(0,s.default)(t,[{key:"componentDidMount",value:function(){var e=this.props.dispatch;e({type:"fundinglist/fetchCp"})}},{key:"render",value:function(){var e=this,t=(this.props.submitting,this.props),a=t.gamelist.gameRecord,l=t.form,n=l.getFieldDecorator,f=(l.getFieldValue,{wrapperCol:{xs:{span:24,offset:0},sm:{span:10,offset:7}}});return _.default.createElement(F.default,{title:"\u4f17\u7b79\u7533\u8bf7",content:""},_.default.createElement(C.default,{onSubmit:this.handleSubmit,hideRequiredMark:!1,style:{marginTop:8}},_.default.createElement(d.default,{bordered:!1},_.default.createElement(i.default,null,_.default.createElement("br",null),_.default.createElement("h3",null,_.default.createElement("b",null,"\u4f17\u7b79\u76ee\u6807")),_.default.createElement("br",null)),_.default.createElement(i.default,{gutter:16,style:{marginBottom:16}},_.default.createElement(o.default,{span:3},_.default.createElement("div",{align:"right",style:{fontWeight:"bold",marginTop:5}},"\u9009\u62e9\u53d1\u884c\u6e38\u620f:")),_.default.createElement(o.default,{span:5},_.default.createElement(T,null,n("cpid",{rules:[{required:!0}]})(_.default.createElement(E.default,{placeholder:"\u8bf7\u9009\u62e9",style:{width:"100%",display:"block"},onChange:this.handleCpidChange},_.default.createElement(W,{value:"-1"},"\u8bf7\u9009\u62e9"),this.renderOptions()))))),_.default.createElement(i.default,{gutter:16,style:{marginBottom:16}},_.default.createElement(o.default,{span:3},_.default.createElement("div",{align:"right",style:{fontWeight:"bold",marginTop:5}},"\u53d1\u884c\u51ed\u8bc1\u6570\u91cf:")),_.default.createElement(o.default,{span:5},_.default.createElement(T,null,n("stock_num",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u53d1\u884c\u51ed\u8bc1\u6570\u91cf"}]})(_.default.createElement(g.default,{placeholder:"\u8bf7\u8f93\u5165",style:{width:"100%"},onChange:this.handleStockNumChange})))),_.default.createElement(o.default,{span:8},_.default.createElement("div",{align:"left",style:{fontWeight:"bold",marginTop:5}},"\u4efd\uff08\u5355\u6b21\u53d1\u884c\u6570\u91cf\u4e0d\u5f97\u9ad8\u4e8e100\u4e07\u4efd\uff09"))),_.default.createElement(i.default,{gutter:16,style:{marginBottom:16}},_.default.createElement(o.default,{span:3},_.default.createElement("div",{align:"right",style:{fontWeight:"bold",marginTop:5}},"\u53d1\u884c\u4ef7(\u5343\u514b):")),_.default.createElement(o.default,{span:5},_.default.createElement(T,null,n("stock_amount",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u53d1\u884c\u4ef7"}]})(_.default.createElement(g.default,{addonAfter:"\u5343\u514b",placeholder:"\u8bf7\u8f93\u5165",style:{width:"100%"},onChange:this.handleStockAmountChange})))),_.default.createElement(o.default,{span:8},_.default.createElement("div",{align:"left",style:{fontWeight:"bold",marginTop:5}},"\u5343\u514b/\u4efd\uff08\u9996\u6b21\u53d1\u884c\u5355\u4ef7\u4e0d\u5f97\u9ad8\u4e8e50\u5343\u514b\uff09"))),_.default.createElement("br",null),_.default.createElement("h2",null,_.default.createElement("b",null,"\u57fa\u672c\u4fe1\u606f\u9884\u89c8")),_.default.createElement("br",null),_.default.createElement(i.default,{gutter:16,style:{marginBottom:16}},_.default.createElement(o.default,{span:8},_.default.createElement("div",{style:{fontWeight:"bold"}},"\u6e38\u620f\u540d\u79f0\uff1a",a.cp_text)),_.default.createElement(o.default,{span:8},_.default.createElement("div",{style:{fontWeight:"bold"}},"\u6e38\u620f\u7c7b\u578b\uff1a",a.cp_type)),_.default.createElement(o.default,{span:8},_.default.createElement("div",{style:{fontWeight:"bold"}},"\u5f00\u53d1\u8005\uff1a",a.develop_name))),_.default.createElement(i.default,{gutter:16,style:{marginBottom:16}},_.default.createElement(o.default,{span:8},_.default.createElement("div",{style:{fontWeight:"bold"}},"\u53d1\u884c\u51ed\u8bc1\u603b\u6570(\u4efd)\uff1a",this.state.stock_num)),_.default.createElement(o.default,{span:8},_.default.createElement("div",{style:{fontWeight:"bold"}},"\u53d1\u884c\u4ef7(\u5343\u514b/\u4efd)\uff1a",parseFloat(this.state.stock_amount/1e5).toFixed(3))),_.default.createElement(o.default,{span:8},_.default.createElement("div",{style:{fontWeight:"bold"}},"\u4f17\u7b79\u603b\u91d1\u989d(\u5343\u514b)\uff1a",parseFloat(this.state.stock_amount/1e5).toFixed(3)*this.state.stock_num))),_.default.createElement(i.default,{gutter:16,style:{marginBottom:16}},_.default.createElement(o.default,{span:3},_.default.createElement("div",{align:"right",style:{fontWeight:"bold",marginTop:5}},"\u5f00\u53d1\u56e2\u961f\u4ecb\u7ecd:")),_.default.createElement(o.default,{span:13},_.default.createElement(T,null,n("develop_text",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5f00\u53d1\u56e2\u961f\u4ecb\u7ecd"}]})(_.default.createElement(I,{placeholder:"\u8bf7\u8f93\u5165",style:{width:"100%"},onChange:this.handleDevelopTextChange}))))),_.default.createElement(T,(0,r.default)({},f,{style:{marginTop:32}}),_.default.createElement(u.default,{type:"primary",onClick:function(){return e.handleCreate(a,e.state)}},"\u63d0\u4ea4")))))}}]),t}(_.PureComponent),b=k))||b)||b),M=B;t.default=M},KNhs:function(e,t,a){e.exports={card:"antd-pro\\pages\\-funding\\style-card",heading:"antd-pro\\pages\\-funding\\style-heading",steps:"antd-pro\\pages\\-funding\\style-steps",errorIcon:"antd-pro\\pages\\-funding\\style-errorIcon",errorPopover:"antd-pro\\pages\\-funding\\style-errorPopover",errorListItem:"antd-pro\\pages\\-funding\\style-errorListItem",errorField:"antd-pro\\pages\\-funding\\style-errorField",editable:"antd-pro\\pages\\-funding\\style-editable",advancedForm:"antd-pro\\pages\\-funding\\style-advancedForm",optional:"antd-pro\\pages\\-funding\\style-optional"}}}]);