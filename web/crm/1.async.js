(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[1],{mSNt:function(e,t,a){"use strict";var n=a("TqRt");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a("MVZn")),s=n(a("o0o1")),u=a("YLDS"),c={namespace:"walletinfo",state:{data:{}},effects:{fetch:s.default.mark(function e(t,a){var n,r,c,d;return s.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,r=a.call,c=a.put,e.next=4,r(u.getAddressReceive,n);case 4:return d=e.sent,e.next=7,c({type:"save",payload:d});case 7:case"end":return e.stop()}},e)})},reducers:{save:function(e,t){return(0,r.default)({},e,{data:t.payload})}}};t.default=c}}]);