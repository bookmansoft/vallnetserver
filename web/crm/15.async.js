(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[15],{Fi3x:function(e,t,a){"use strict";var r=a("TqRt");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var u=r(a("MVZn")),n=r(a("o0o1"));a("miYZ");var s=r(a("tsqr")),c=a("7DNP"),o=a("dCQc"),p={namespace:"form",state:{step:{payAccount:"ant-design@alipay.com",receiverAccount:"test@example.com",receiverName:"Alex",amount:"500"}},effects:{submitRegularForm:n.default.mark(function e(t,a){var r,u;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,u=a.call,e.next=4,u(o.fakeSubmitForm,r);case 4:s.default.success("\u63d0\u4ea4\u6210\u529f");case 5:case"end":return e.stop()}},e)}),submitStepForm:n.default.mark(function e(t,a){var r,u,s;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,u=a.call,s=a.put,e.next=4,u(o.fakeSubmitForm,r);case 4:return e.next=6,s({type:"saveStepFormData",payload:r});case 6:return e.next=8,s(c.routerRedux.push("/form/step-form/result"));case 8:case"end":return e.stop()}},e)}),submitAdvancedForm:n.default.mark(function e(t,a){var r,u;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,u=a.call,e.next=4,u(o.fakeSubmitForm,r);case 4:s.default.success("\u63d0\u4ea4\u6210\u529f");case 5:case"end":return e.stop()}},e)})},reducers:{saveStepFormData:function(e,t){var a=t.payload;return(0,u.default)({},e,{step:(0,u.default)({},e.step,a)})}}};t.default=p}}]);