yoastWebpackJsonp([137],{

/***/ 422:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.kl = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "kl", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "Year", relative: { 0: "this year", 1: "next year", "-1": "last year" }, relativeTime: { future: { one: "om {0} ukioq", other: "om {0} ukioq" }, past: { one: "for {0} ukioq siden", other: "for {0} ukioq siden" } } }, month: { displayName: "Month", relative: { 0: "this month", 1: "next month", "-1": "last month" }, relativeTime: { future: { one: "om {0} qaammat", other: "om {0} qaammat" }, past: { one: "for {0} qaammat siden", other: "for {0} qaammat siden" } } }, day: { displayName: "Day", relative: { 0: "today", 1: "tomorrow", "-1": "yesterday" }, relativeTime: { future: { one: "om {0} ulloq unnuarlu", other: "om {0} ulloq unnuarlu" }, past: { one: "for {0} ulloq unnuarlu siden", other: "for {0} ulloq unnuarlu siden" } } }, hour: { displayName: "Hour", relative: { 0: "this hour" }, relativeTime: { future: { one: "om {0} nalunaaquttap-akunnera", other: "om {0} nalunaaquttap-akunnera" }, past: { one: "for {0} nalunaaquttap-akunnera siden", other: "for {0} nalunaaquttap-akunnera siden" } } }, minute: { displayName: "Minute", relative: { 0: "this minute" }, relativeTime: { future: { one: "om {0} minutsi", other: "om {0} minutsi" }, past: { one: "for {0} minutsi siden", other: "for {0} minutsi siden" } } }, second: { displayName: "Second", relative: { 0: "now" }, relativeTime: { future: { one: "om {0} sekundi", other: "om {0} sekundi" }, past: { one: "for {0} sekundi siden", other: "for {0} sekundi siden" } } } } }];
});

/***/ })

});