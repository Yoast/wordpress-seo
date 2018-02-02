yoastWebpackJsonp([164],{

/***/ 395:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.hy = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "hy", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? 1 == e ? "one" : "other" : e >= 0 && e < 2 ? "one" : "other";
    }, fields: { year: { displayName: "տարի", relative: { 0: "այս տարի", 1: "հաջորդ տարի", "-1": "նախորդ տարի" }, relativeTime: { future: { one: "{0} տարուց", other: "{0} տարուց" }, past: { one: "{0} տարի առաջ", other: "{0} տարի առաջ" } } }, month: { displayName: "ամիս", relative: { 0: "այս ամիս", 1: "հաջորդ ամիս", "-1": "նախորդ ամիս" }, relativeTime: { future: { one: "{0} ամսից", other: "{0} ամսից" }, past: { one: "{0} ամիս առաջ", other: "{0} ամիս առաջ" } } }, day: { displayName: "օր", relative: { 0: "այսօր", 1: "վաղը", 2: "վաղը չէ մյուս օրը", "-2": "երեկ չէ առաջի օրը", "-1": "երեկ" }, relativeTime: { future: { one: "{0} օրից", other: "{0} օրից" }, past: { one: "{0} օր առաջ", other: "{0} օր առաջ" } } }, hour: { displayName: "ժամ", relative: { 0: "այս ժամին" }, relativeTime: { future: { one: "{0} ժամից", other: "{0} ժամից" }, past: { one: "{0} ժամ առաջ", other: "{0} ժամ առաջ" } } }, minute: { displayName: "րոպե", relative: { 0: "այս րոպեին" }, relativeTime: { future: { one: "{0} րոպեից", other: "{0} րոպեից" }, past: { one: "{0} րոպե առաջ", other: "{0} րոպե առաջ" } } }, second: { displayName: "վայրկյան", relative: { 0: "այժմ" }, relativeTime: { future: { one: "{0} վայրկյանից", other: "{0} վայրկյանից" }, past: { one: "{0} վայրկյան առաջ", other: "{0} վայրկյան առաջ" } } } } }];
});

/***/ })

});