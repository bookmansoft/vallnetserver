(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[63],{ERDS:function(e,t,a){e.exports={headerList:"antd-pro\\pages\\-stock\\-stock-view-headerList",tabsCard:"antd-pro\\pages\\-stock\\-stock-view-tabsCard",noData:"antd-pro\\pages\\-stock\\-stock-view-noData",heading:"antd-pro\\pages\\-stock\\-stock-view-heading",stepDescription:"antd-pro\\pages\\-stock\\-stock-view-stepDescription",textSecondary:"antd-pro\\pages\\-stock\\-stock-view-textSecondary"}},Y0Mf:function(e,t,a){"use strict";var l=a("g09b"),n=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("IzEo");var r=l(a("bx4M"));a("+L6B");var o=l(a("2/Rp"));a("/zsF");var s=l(a("PArb"));a("14J3");var d=l(a("BMrR"));a("jCWc");var i=l(a("kPKH")),u=l(a("2Taf")),c=l(a("vZ4D")),f=l(a("l4Ni")),p=l(a("ujKo")),m=l(a("MhPg")),E=l(a("SQvw"));a("FJo9");var y=l(a("L41K"));a("y8nQ");var h,g,k,v,w,D,B=l(a("Vl3Y")),S=n(a("q1tI")),b=a("MuoO"),x=l(a("fqkP")),z=l(a("UjoV")),q=(l(a("wd/R")),l(a("TSYQ")),l(a("+kNj")),l(a("zHco"))),I=(l(a("ERDS")),l(a("usdK"))),L=(B.default.Item,y.default.Step,function(){return window.innerWidth||document.documentElement.clientWidth}),M=(h=(0,b.connect)(function(e){var t=e.stocklist,a=e.gamelist,l=e.loading;return{stocklist:t,gamelist:a,loading:l.models.stocklist}}),g=(0,z.default)(),k=(0,x.default)(200),h((D=function(e){function t(){var e,a;(0,u.default)(this,t);for(var l=arguments.length,n=new Array(l),r=0;r<l;r++)n[r]=arguments[r];return a=(0,f.default)(this,(e=(0,p.default)(t)).call.apply(e,[this].concat(n))),a.state={operationkey:"tab1",stepDirection:"horizontal",recordType:1,detail:{},game:{}},a.handleBack=function(){history.back()},a}return(0,m.default)(t,e),(0,c.default)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props,a=t.dispatch;t.stocklist.records;this.setState({recordType:this.props.location.query.type||1}),a({type:"gamelist/getGameRecord",payload:{id:this.props.location.query.id}}),a({type:"stocklist/queryDetail",payload:{id:this.props.location.query.id,type:this.props.location.query.type}}).then(function(t){t?e.setState({detail:t}):I.default.push("/stock/stocklist")}),this.setStepDirection(),window.addEventListener("resize",this.setStepDirection,{passive:!0})}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.setStepDirection),this.setStepDirection.cancel()}},{key:"setStepDirection",value:function(){var e=this.state.stepDirection,t=L();"vertical"!==e&&t<=576?this.setState({stepDirection:"vertical"}):"horizontal"!==e&&t>576&&this.setState({stepDirection:"horizontal"})}},{key:"render",value:function(){var e=this.state,t=(e.stepDirection,e.operationkey,e.detail),a=this.props,l=a.gamelist.gameRecord;a.loading;return console.log("stockview",t,l),S.default.createElement(q.default,{title:"\u51ed\u8bc1\u8be6\u60c5\u9875",action:null,content:null,extraContent:null,tabList:null},S.default.createElement(r.default,{style:null,bordered:!1},S.default.createElement(d.default,{style:{marginBottom:32}},S.default.createElement(i.default,{span:6},S.default.createElement(d.default,{style:{marginBottom:16}},S.default.createElement(i.default,{span:24},S.default.createElement("h3",null,S.default.createElement("b",null,"\u5f53\u524d\u6302\u724c\u4ef7")))),S.default.createElement(d.default,{style:{marginBottom:16}},S.default.createElement(i.default,{span:24},S.default.createElement("h1",{style:{color:"red"}},parseInt(t.sell_price/100)/1e3,"\u5343\u514b"))),S.default.createElement(d.default,{style:{marginBottom:16}},S.default.createElement(i.default,{span:12},"\u6d41\u901a\u51ed\u8bc1\u603b\u6570(\u4efd)"),S.default.createElement(i.default,{span:12},t.sell_sum)),S.default.createElement(d.default,{style:{marginBottom:16}},S.default.createElement(i.default,{span:12},"\u5f53\u524d\u6d41\u901a\u5e02\u503c(\u5343\u514b)"),S.default.createElement(i.default,{span:12},parseInt(t.sell_sum*t.sell_price/100)/1e3)),S.default.createElement(d.default,{style:{marginBottom:16}},S.default.createElement(i.default,{span:12},"\u6700\u65b0\u6302\u5355\u4ef7\u683c"),S.default.createElement(i.default,{span:12},parseInt(t.sell_price/100)/1e3)),S.default.createElement(d.default,{style:{marginBottom:16}},S.default.createElement(i.default,{span:12},"\u6302\u5355\u6570\u91cf"),S.default.createElement(i.default,{span:12},t.sum)),S.default.createElement(d.default,{style:{marginBottom:16}},S.default.createElement(i.default,{span:12},"\u53d1\u884c\u4ef7\u683c"),S.default.createElement(i.default,{span:12},parseInt(t.price/100)/1e3)),S.default.createElement(d.default,{style:{marginBottom:16}},S.default.createElement(i.default,{span:12},"\u6302\u5355\u4ef7/\u53d1\u884c\u4ef7"),S.default.createElement(i.default,{span:12},100*t.sum/t.price+"%"))),S.default.createElement(i.default,{span:18},S.default.createElement("iframe",{src:"http://"+location.hostname+":9701/echart/kline/index.html?cid="+t.cid,frameBorder:"0",width:"100%",height:"600px",scrolling:"no"}))),S.default.createElement(s.default,{style:{margin:"20px 0"}}),S.default.createElement(d.default,{style:{marginBottom:16}},S.default.createElement(i.default,{span:24},S.default.createElement("h3",null,S.default.createElement("b",null,"\u6e38\u620f\u4fe1\u606f")))),S.default.createElement(d.default,{style:{marginBottom:32}},S.default.createElement(i.default,{span:8},"\u6e38\u620f\u540d\u79f0\uff1a",t.cid),S.default.createElement(i.default,{span:8},"\u6e38\u620f\u7c7b\u578b\uff1a"),S.default.createElement(i.default,{span:8},"\u5f00\u53d1\u8005\uff1a")),S.default.createElement(d.default,{style:{marginBottom:32}},S.default.createElement(i.default,{span:8},"\u6d41\u901a\u51ed\u8bc1\u603b\u6570\uff1a100000\u4efd"),S.default.createElement(i.default,{span:8},"\u6301\u7eed\u5206\u7ea2\u65f6\u95f4\uff1a120\u5929"),S.default.createElement(i.default,{span:8},"\u7d2f\u8ba1\u5206\u7ea2\uff1a1222\u5343\u514b")),S.default.createElement(d.default,{style:{marginBottom:32}},S.default.createElement(i.default,{span:8},"\u5f53\u524d\u6d41\u901a\u5e02\u503c(\u5343\u514b)"),S.default.createElement(i.default,{span:8},"\u5355\u4efd\u51ed\u8bc1\u6536\u76ca")),S.default.createElement(d.default,{style:{marginBottom:32}},S.default.createElement(i.default,{sm:4,xs:8},S.default.createElement(o.default,{type:"primary",onClick:this.handleBack},"\u8fd4\u56de")))))}}]),t}(S.Component),w=D,(0,E.default)(w.prototype,"setStepDirection",[g,k],Object.getOwnPropertyDescriptor(w.prototype,"setStepDirection"),w.prototype),v=w))||v),R=M;t.default=R}}]);