(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[108],{DZGM:function(e,t,a){"use strict";var l=a("g09b"),d=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("IzEo");var r=l(a("bx4M"));a("+L6B");var u=l(a("2/Rp"));a("iQDF");var n=l(a("+eQT"));a("/zsF");var m=l(a("PArb"));a("5NDa");var f=l(a("5rEg"));a("14J3");var s=l(a("BMrR"));a("jCWc");var c=l(a("kPKH")),i=l(a("2Taf")),o=l(a("vZ4D")),E=l(a("l4Ni")),g=l(a("ujKo")),p=l(a("MhPg"));a("y8nQ");var h,y,x,v,k=l(a("Vl3Y")),b=d(a("q1tI")),q=a("MuoO"),_=(l(a("fqkP")),l(a("UjoV")),l(a("Z0Lh"))),B=l(a("usdK")),T=(l(a("wd/R")),l(a("zHco"))),w=k.default.Item,D=(h=(0,q.connect)(function(e){var t=e.redpacketadd,a=e.loading;return{redpacketadd:t,loading:a.models.redpacketadd}}),y=k.default.create(),h(x=y((v=function(e){function t(){var e,a;(0,i.default)(this,t);for(var l=arguments.length,d=new Array(l),r=0;r<l;r++)d[r]=arguments[r];return a=(0,E.default)(this,(e=(0,g.default)(t)).call.apply(e,[this].concat(d))),a.renderImg=function(e){if(e&&e.length){var t=e.map(function(e,t){return b.default.createElement("div",null,b.default.createElement("img",{width:300,src:e,key:t}),b.default.createElement("br",null))});return t}},a.handleBack=function(){history.back()},a.handleSubmit=function(e){var t=a.props,l=t.dispatch,d=t.form;e.preventDefault(),d.validateFieldsAndScroll(function(e,t){console.log(t),e||l({type:"redpacketadd/add",payload:t}).then(function(e){console.log("B \u6267\u884c\u5b8c\u6210\uff01"),0===e.code?B.default.push("/redpacket/redpacketaddsuccess"):B.default.push("/redpacket/redpacketadderror")})})},a}return(0,p.default)(t,e),(0,o.default)(t,[{key:"componentDidMount",value:function(){var e=this.props.dispatch;e({type:"redpacketadd/add",payload:{id:this.props.location.query.id}})}},{key:"render",value:function(){var e=this.props,t=e.redpacketadd.data,a=e.form,l=a.getFieldDecorator;a.getFieldValue,e.loading;return b.default.createElement(T.default,{title:t.cp_name,action:null,content:null,extraContent:null,tabList:null},b.default.createElement(k.default,{onSubmit:this.handleSubmit,hideRequiredMark:!1,style:{marginTop:8}},b.default.createElement(r.default,{style:null,bordered:!1},b.default.createElement(s.default,{style:{marginBottom:16}},b.default.createElement(c.default,{sm:24,xs:24},b.default.createElement("h3",null,b.default.createElement("b",null,"\u6d3b\u52a8\u4fe1\u606f")))),b.default.createElement(s.default,{style:{marginBottom:32}},b.default.createElement(c.default,{sm:2,xs:2},b.default.createElement("div",{align:"right",style:{marginTop:5}},"\u6d3b\u52a8ID\uff1a")),b.default.createElement(c.default,{sm:5,xs:5},l("act_sequence",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6d3b\u52a8ID"}]})(b.default.createElement(f.default,{placeholder:"\u8bf7\u8f93\u5165"}))),b.default.createElement(c.default,{sm:1,xs:1}),b.default.createElement(c.default,{sm:2,xs:2},b.default.createElement("div",{align:"right",style:{marginTop:5}},"\u6d3b\u52a8\u540d\u79f0\uff1a")),b.default.createElement(c.default,{sm:5,xs:5},l("act_name",{initialValue:"\u79ef\u5206\u62bd\u5956",rules:[{required:!0,message:"\u79ef\u5206\u62bd\u5956"}]})(b.default.createElement(f.default,{placeholder:"\u79ef\u5206\u62bd\u59561"})))),b.default.createElement(s.default,{style:{marginBottom:32}},b.default.createElement(c.default,{sm:2,xs:2},b.default.createElement("div",{align:"right",style:{marginTop:5}},"\u6d3b\u52a8\u63cf\u8ff0\uff1a")),b.default.createElement(c.default,{sm:22,xs:22},b.default.createElement(w,{label:""},l("act_desc",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6d3b\u52a8\u63cf\u8ff0"}]})(b.default.createElement(f.default,{placeholder:"\u8bf7\u8f93\u5165"}))))),b.default.createElement(m.default,{style:{margin:"20px 0"}}),b.default.createElement(s.default,{style:{marginBottom:16}},b.default.createElement(c.default,{sm:24,xs:24},b.default.createElement("h3",null,b.default.createElement("b",null,"\u6d3b\u52a8\u5185\u5bb9\u8bbe\u7f6e")))),b.default.createElement(s.default,{style:{marginBottom:32}},b.default.createElement(c.default,{sm:2,xs:2},b.default.createElement("div",{align:"right",style:{marginTop:5}},"\u7ea2\u5305\u603b\u6570\uff1a")),b.default.createElement(c.default,{sm:5,xs:5},l("total_num",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u7ea2\u5305\u603b\u6570"}]})(b.default.createElement(f.default,{placeholder:"\u8bf7\u8f93\u5165"}))),b.default.createElement(c.default,{sm:1,xs:1}),b.default.createElement(c.default,{sm:2,xs:2},b.default.createElement("div",{align:"right",style:{marginTop:5}},"\u7ea2\u5305\u5e73\u5747\u91d1\u989d\uff1a")),b.default.createElement(c.default,{sm:5,xs:5},l("each_gamegold",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u7ea2\u5305\u5e73\u5747\u91d1\u989d"}]})(b.default.createElement(f.default,{placeholder:"\u8bf7\u8f93\u5165"}))),b.default.createElement(c.default,{sm:1,xs:1}),b.default.createElement(c.default,{sm:2,xs:2},b.default.createElement("div",{align:"right",style:{marginTop:5}},"\u672c\u6b21\u6d3b\u52a8\u9884\u7b97\uff1a")),b.default.createElement(c.default,{sm:5,xs:5},l("total_gamegold",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u672c\u6b21\u6d3b\u52a8\u9884\u7b97"}]})(b.default.createElement(f.default,{placeholder:"\u8bf7\u8f93\u5165"}))),b.default.createElement(c.default,{sm:1,xs:1})),b.default.createElement(s.default,{style:{marginBottom:32}},b.default.createElement(c.default,{sm:2,xs:2},b.default.createElement("div",{align:"right",style:{marginTop:5}},"\u6bcf\u4e2a\u7528\u6237\u7ea2\u5305\u6570\u91cf\uff1a")),b.default.createElement(c.default,{sm:5,xs:5},l("each_num",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6bcf\u4e2a\u7528\u6237\u7ea2\u5305\u6570\u91cf"}]})(b.default.createElement(f.default,{placeholder:"\u8bf7\u8f93\u5165"}))),b.default.createElement(c.default,{sm:1,xs:1}),b.default.createElement(c.default,{sm:2,xs:2},b.default.createElement("div",{align:"right",style:{marginTop:5}},"\u8bbe\u7f6e\u5f00\u59cb\u65e5\u671f\uff1a")),b.default.createElement(c.default,{sm:5,xs:5},l("act_start_at",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6d3b\u52a8\u5f00\u59cb\u65e5\u671f"}]})(b.default.createElement(n.default,{locale:_.default}))),b.default.createElement(c.default,{sm:1,xs:1}),b.default.createElement(c.default,{sm:2,xs:2},b.default.createElement("div",{align:"right",style:{marginTop:5}},"\u8bbe\u7f6e\u7ed3\u675f\u65e5\u671f\uff1a")),b.default.createElement(c.default,{sm:5,xs:5},l("act_end_at",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6d3b\u52a8\u7ed3\u675f\u65e5\u671f"}]})(b.default.createElement(n.default,{locale:_.default}))),b.default.createElement(c.default,{sm:1,xs:1})),b.default.createElement(s.default,{style:{marginBottom:32}},b.default.createElement(c.default,{sm:24,xs:24},"\u8bf4\u660e\uff1a\u8bf7\u8ba4\u771f\u6838\u5bf9\u6d3b\u52a8\u5185\u5bb9\u8bbe\u7f6e")),b.default.createElement(s.default,{style:{marginBottom:32}},b.default.createElement(c.default,{sm:8,xs:8}),b.default.createElement(c.default,{sm:4,xs:4},b.default.createElement(u.default,{type:"primary",htmlType:"submit"},"\u63d0\u4ea4")),b.default.createElement(c.default,{sm:4,xs:4},b.default.createElement(u.default,{type:"primary",onClick:this.handleBack},"\u53d6\u6d88"))))))}}]),t}(b.Component),x=v))||x)||x),M=D;t.default=M}}]);