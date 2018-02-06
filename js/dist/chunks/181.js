yoastWebpackJsonp([181],{

/***/ 378:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.fur = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "fur", pluralRuleFunction: function pluralRuleFunction(e, a) {
      return a ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "an", relative: { 0: "this year", 1: "next year", "-1": "last year" }, relativeTime: { future: { one: "ca di {0} an", other: "ca di {0} agns" }, past: { one: "{0} an indaûr", other: "{0} agns indaûr" } } }, month: { displayName: "mês", relative: { 0: "this month", 1: "next month", "-1": "last month" }, relativeTime: { future: { one: "ca di {0} mês", other: "ca di {0} mês" }, past: { one: "{0} mês indaûr", other: "{0} mês indaûr" } } }, day: { displayName: "dì", relative: { 0: "vuê", 1: "doman", 2: "passantdoman", "-2": "îr l’altri", "-1": "îr" }, relativeTime: { future: { one: "ca di {0} zornade", other: "ca di {0} zornadis" }, past: { one: "{0} zornade indaûr", other: "{0} zornadis indaûr" } } }, hour: { displayName: "ore", relative: { 0: "this hour" }, relativeTime: { future: { one: "ca di {0} ore", other: "ca di {0} oris" }, past: { one: "{0} ore indaûr", other: "{0} oris indaûr" } } }, minute: { displayName: "minût", relative: { 0: "this minute" }, relativeTime: { future: { one: "ca di {0} minût", other: "ca di {0} minûts" }, past: { one: "{0} minût indaûr", other: "{0} minûts indaûr" } } }, second: { displayName: "secont", relative: { 0: "now" }, relativeTime: { future: { one: "ca di {0} secont", other: "ca di {0} seconts" }, past: { one: "{0} secont indaûr", other: "{0} seconts indaûr" } } } } }];
});

/***/ })

});