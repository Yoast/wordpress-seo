yoastWebpackJsonp([221],{

/***/ 338:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.bg = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "bg", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "година", relative: { 0: "тази година", 1: "следващата година", "-1": "миналата година" }, relativeTime: { future: { one: "след {0} година", other: "след {0} години" }, past: { one: "преди {0} година", other: "преди {0} години" } } }, month: { displayName: "месец", relative: { 0: "този месец", 1: "следващ месец", "-1": "предходен месец" }, relativeTime: { future: { one: "след {0} месец", other: "след {0} месеца" }, past: { one: "преди {0} месец", other: "преди {0} месеца" } } }, day: { displayName: "ден", relative: { 0: "днес", 1: "утре", 2: "вдругиден", "-2": "онзи ден", "-1": "вчера" }, relativeTime: { future: { one: "след {0} ден", other: "след {0} дни" }, past: { one: "преди {0} ден", other: "преди {0} дни" } } }, hour: { displayName: "час", relative: { 0: "в този час" }, relativeTime: { future: { one: "след {0} час", other: "след {0} часа" }, past: { one: "преди {0} час", other: "преди {0} часа" } } }, minute: { displayName: "минута", relative: { 0: "в тази минута" }, relativeTime: { future: { one: "след {0} минута", other: "след {0} минути" }, past: { one: "преди {0} минута", other: "преди {0} минути" } } }, second: { displayName: "секунда", relative: { 0: "сега" }, relativeTime: { future: { one: "след {0} секунда", other: "след {0} секунди" }, past: { one: "преди {0} секунда", other: "преди {0} секунди" } } } } }];
});

/***/ })

});