yoastWebpackJsonp([107],{

/***/ 452:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.mgo = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "mgo", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "fituʼ", relative: { 0: "this year", 1: "next year", "-1": "last year" }, relativeTime: { future: { other: "+{0} y" }, past: { other: "-{0} y" } } }, month: { displayName: "iməg", relative: { 0: "this month", 1: "next month", "-1": "last month" }, relativeTime: { future: { one: "+{0} m", other: "+{0} m" }, past: { one: "-{0} m", other: "-{0} m" } } }, day: { displayName: "anəg", relative: { 0: "tèchɔ̀ŋ", 1: "isu", 2: "isu ywi", "-1": "ikwiri" }, relativeTime: { future: { one: "+{0} d", other: "+{0} d" }, past: { one: "-{0} d", other: "-{0} d" } } }, hour: { displayName: "Hour", relative: { 0: "this hour" }, relativeTime: { future: { one: "+{0} h", other: "+{0} h" }, past: { one: "-{0} h", other: "-{0} h" } } }, minute: { displayName: "Minute", relative: { 0: "this minute" }, relativeTime: { future: { one: "+{0} min", other: "+{0} min" }, past: { one: "-{0} min", other: "-{0} min" } } }, second: { displayName: "Second", relative: { 0: "now" }, relativeTime: { future: { one: "+{0} s", other: "+{0} s" }, past: { one: "-{0} s", other: "-{0} s" } } } } }];
});

/***/ })

});