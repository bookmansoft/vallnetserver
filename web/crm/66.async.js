(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[66],{qgJP:function(e,t,a){"use strict";var l=a("g09b"),d=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("IzEo");var n=l(a("bx4M"));a("+L6B");var r=l(a("2/Rp"));a("14J3");var o=l(a("BMrR"));a("jCWc");var u=l(a("kPKH")),s=l(a("2Taf")),i=l(a("vZ4D")),c=l(a("l4Ni")),f=l(a("ujKo")),m=l(a("MhPg"));a("iQDF");var p=l(a("+eQT"));a("y8nQ");var g,w,E,v,y=l(a("Vl3Y")),h=d(a("q1tI")),x=a("MuoO"),k=(a("LLXN"),l(a("wd/R"))),B=(l(a("3a4m")),l(a("zHco"))),b=(l(a("zu7S")),y.default.Item,p.default.RangePicker,g=(0,x.connect)(function(e){var t=e.walletlog,a=e.loading;return{walletlog:t,loading:a.models.walletlog}}),w=y.default.create(),g(E=w((v=function(e){function t(){var e,a;(0,s.default)(this,t);for(var l=arguments.length,d=new Array(l),n=0;n<l;n++)d[n]=arguments[n];return a=(0,c.default)(this,(e=(0,f.default)(t)).call.apply(e,[this].concat(d))),a.handleBack=function(){history.back()},a}return(0,m.default)(t,e),(0,i.default)(t,[{key:"componentDidMount",value:function(){var e=this.props.dispatch;e({type:"walletlog/fetch",payload:{id:this.props.location.query.id}})}},{key:"render",value:function(){var e=this.props,t=e.walletlog.data;e.loading;return h.default.createElement(B.default,{title:"\u6d41\u6c34\u8be6\u60c5"},h.default.createElement(n.default,{bordered:!1},h.default.createElement(o.default,{style:{marginBottom:32}},h.default.createElement(u.default,{sm:24,xs:24},h.default.createElement("h3",null,h.default.createElement("b",null,"\u4ea4\u6613\u8be6\u60c5")))),h.default.createElement(o.default,{style:{marginBottom:32}},h.default.createElement(u.default,{sm:24,xs:24},"\u4ea4\u6613\u6d41\u6c34\uff1a",t.txid)),h.default.createElement(o.default,{style:{marginBottom:32}},h.default.createElement(u.default,{sm:8,xs:12},"\u4ea4\u6613\u7c7b\u578b\uff1a",!!t.details&&t.details[0].category),h.default.createElement(u.default,{sm:8,xs:12},"\u4ea4\u6613\u6e38\u620f\u91d1\u6570\u91cf\uff1a",!!t.details&&1e3*t.details[0].amount.toFixed(6)+"\u5343\u514b"),h.default.createElement(u.default,{sm:8,xs:12},"\u4ea4\u6613\u65f6\u95f4\uff1a",(0,k.default)(1e3*t.time).format("YYYY-MM-DD HH:mm:ss"))),h.default.createElement(o.default,{style:{marginBottom:32}},h.default.createElement(u.default,{sm:24,xs:24},"\u5bf9\u65b9\u94b1\u5305\u5730\u5740\uff1a",!!t.details&&t.details[0].address)),h.default.createElement(o.default,{style:{marginBottom:32}},h.default.createElement(u.default,{sm:24,xs:24},"\u4ea4\u6613\u63cf\u8ff0\uff1a",!!t.details&&t.details[0].label)),h.default.createElement(o.default,{style:{marginBottom:32}},h.default.createElement(u.default,{sm:4,xs:8},h.default.createElement(r.default,{type:"primary",onClick:this.handleBack},"\u8fd4\u56de\u94b1\u5305")))))}}]),t}(h.PureComponent),E=v))||E)||E),M=b;t.default=M},zu7S:function(e,t,a){e.exports={cardList:"antd-pro\\pages\\-wallet\\-wallet-log-cardList",card:"antd-pro\\pages\\-wallet\\-wallet-log-card",item:"antd-pro\\pages\\-wallet\\-wallet-log-item",extraImg:"antd-pro\\pages\\-wallet\\-wallet-log-extraImg",newButton:"antd-pro\\pages\\-wallet\\-wallet-log-newButton",cardAvatar:"antd-pro\\pages\\-wallet\\-wallet-log-cardAvatar",cardDescription:"antd-pro\\pages\\-wallet\\-wallet-log-cardDescription",pageHeaderContent:"antd-pro\\pages\\-wallet\\-wallet-log-pageHeaderContent",contentLink:"antd-pro\\pages\\-wallet\\-wallet-log-contentLink"}}}]);