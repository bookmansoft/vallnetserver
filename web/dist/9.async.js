(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{svHX:function(e,a,t){"use strict";var n=t("g09b");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var u=n(t("p0pE")),r=n(t("d6i3")),s=t("YLDS"),d={namespace:"fundinglist",state:{data:{list:[],pagination:{}}},effects:{fetch:r.default.mark(function e(a,t){var n,u,d,c;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=a.payload,u=t.call,d=t.put,e.next=4,u(s.queryFunding,n);case 4:return c=e.sent,e.next=7,d({type:"save",payload:c});case 7:case"end":return e.stop()}},e)})},reducers:{save:function(e,a){return(0,u.default)({},e,{data:a.payload})}}};a.default=d}}]);