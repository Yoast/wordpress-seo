yoastWebpackJsonp([101],{

/***/ 458:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.ms = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "ms", pluralRuleFunction: function pluralRuleFunction(e, a) {
      return a && 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "Tahun", relative: { 0: "tahun ini", 1: "tahun depan", "-1": "tahun lalu" }, relativeTime: { future: { other: "dalam {0} saat" }, past: { other: "{0} tahun lalu" } } }, month: { displayName: "Bulan", relative: { 0: "bulan ini", 1: "bulan depan", "-1": "bulan lalu" }, relativeTime: { future: { other: "dalam {0} bulan" }, past: { other: "{0} bulan lalu" } } }, day: { displayName: "Hari", relative: { 0: "hari ini", 1: "esok", 2: "lusa", "-2": "kelmarin", "-1": "semalam" }, relativeTime: { future: { other: "dalam {0} hari" }, past: { other: "{0} hari lalu" } } }, hour: { displayName: "Jam", relative: { 0: "jam ini" }, relativeTime: { future: { other: "dalam {0} jam" }, past: { other: "{0} jam lalu" } } }, minute: { displayName: "Minit", relative: { 0: "pada minit ini" }, relativeTime: { future: { other: "dalam {0} minit" }, past: { other: "{0} minit lalu" } } }, second: { displayName: "Saat", relative: { 0: "sekarang" }, relativeTime: { future: { other: "dalam {0} saat" }, past: { other: "{0} saat lalu" } } } } }, { locale: "ms-Arab", pluralRuleFunction: function pluralRuleFunction(e, a) {
      return "other";
    }, fields: { year: { displayName: "Year", relative: { 0: "this year", 1: "next year", "-1": "last year" }, relativeTime: { future: { other: "+{0} y" }, past: { other: "-{0} y" } } }, month: { displayName: "Month", relative: { 0: "this month", 1: "next month", "-1": "last month" }, relativeTime: { future: { other: "+{0} m" }, past: { other: "-{0} m" } } }, day: { displayName: "Day", relative: { 0: "today", 1: "tomorrow", "-1": "yesterday" }, relativeTime: { future: { other: "+{0} d" }, past: { other: "-{0} d" } } }, hour: { displayName: "Hour", relative: { 0: "this hour" }, relativeTime: { future: { other: "+{0} h" }, past: { other: "-{0} h" } } }, minute: { displayName: "Minute", relative: { 0: "this minute" }, relativeTime: { future: { other: "+{0} min" }, past: { other: "-{0} min" } } }, second: { displayName: "Second", relative: { 0: "now" }, relativeTime: { future: { other: "+{0} s" }, past: { other: "-{0} s" } } } } }, { locale: "ms-BN", parentLocale: "ms" }, { locale: "ms-SG", parentLocale: "ms" }];
});

/***/ })

});