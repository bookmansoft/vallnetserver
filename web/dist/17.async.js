(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[17],{"6bXN":function(e,t,n){"use strict";var a=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a(n("p0pE")),u=a(n("d6i3")),c=n("KE/+"),i={namespace:"geographic",state:{province:[],city:[],isLoading:!1},effects:{fetchProvince:u.default.mark(function e(t,n){var a,r,i;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=n.call,r=n.put,e.next=3,r({type:"changeLoading",payload:!0});case 3:return e.next=5,a(c.queryProvince);case 5:return i=e.sent,e.next=8,r({type:"setProvince",payload:i});case 8:return e.next=10,r({type:"changeLoading",payload:!1});case 10:case"end":return e.stop()}},e)}),fetchCity:u.default.mark(function e(t,n){var a,r,i,o;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,r=n.call,i=n.put,e.next=4,i({type:"changeLoading",payload:!0});case 4:return e.next=6,r(c.queryCity,a);case 6:return o=e.sent,e.next=9,i({type:"setCity",payload:o});case 9:return e.next=11,i({type:"changeLoading",payload:!1});case 11:case"end":return e.stop()}},e)})},reducers:{setProvince:function(e,t){return(0,r.default)({},e,{province:t.payload})},setCity:function(e,t){return(0,r.default)({},e,{city:t.payload})},changeLoading:function(e,t){return(0,r.default)({},e,{isLoading:t.payload})}}};t.default=i},"KE/+":function(e,t,n){"use strict";var a=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.queryProvince=i,t.queryCity=p;var r=a(n("d6i3")),u=a(n("1l/V")),c=a(n("t3Un"));function i(){return o.apply(this,arguments)}function o(){return o=(0,u.default)(r.default.mark(function e(){return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,c.default)("/api/geographic/province"));case 1:case"end":return e.stop()}},e)})),o.apply(this,arguments)}function p(e){return s.apply(this,arguments)}function s(){return s=(0,u.default)(r.default.mark(function e(t){return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,c.default)("/api/geographic/city/".concat(t)));case 1:case"end":return e.stop()}},e)})),s.apply(this,arguments)}}}]);