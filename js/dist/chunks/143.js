yoastWebpackJsonp([143],{

/***/ 416:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.kde = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "kde", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return "other";
    }, fields: { year: { displayName: "Mwaka", relative: { 0: "this year", 1: "next year", "-1": "last year" }, relativeTime: { future: { other: "+{0} y" }, past: { other: "-{0} y" } } }, month: { displayName: "Mwedi", relative: { 0: "this month", 1: "next month", "-1": "last month" }, relativeTime: { future: { other: "+{0} m" }, past: { other: "-{0} m" } } }, day: { displayName: "Lihiku", relative: { 0: "Nelo", 1: "Nundu", "-1": "Lido" }, relativeTime: { future: { other: "+{0} d" }, past: { other: "-{0} d" } } }, hour: { displayName: "Saa", relative: { 0: "this hour" }, relativeTime: { future: { other: "+{0} h" }, past: { other: "-{0} h" } } }, minute: { displayName: "Dakika", relative: { 0: "this minute" }, relativeTime: { future: { other: "+{0} min" }, past: { other: "-{0} min" } } }, second: { displayName: "Sekunde", relative: { 0: "now" }, relativeTime: { future: { other: "+{0} s" }, past: { other: "-{0} s" } } } } }];
});

/***/ })

});