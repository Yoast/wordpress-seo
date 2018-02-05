yoastWebpackJsonp([163],{

/***/ 396:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (a, e) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = e() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (a.ReactIntlLocaleData = a.ReactIntlLocaleData || {}, a.ReactIntlLocaleData.id = e());
}(undefined, function () {
  "use strict";
  return [{ locale: "id", pluralRuleFunction: function pluralRuleFunction(a, e) {
      return "other";
    }, fields: { year: { displayName: "Tahun", relative: { 0: "tahun ini", 1: "tahun depan", "-1": "tahun lalu" }, relativeTime: { future: { other: "Dalam {0} tahun" }, past: { other: "{0} tahun yang lalu" } } }, month: { displayName: "Bulan", relative: { 0: "bulan ini", 1: "Bulan berikutnya", "-1": "bulan lalu" }, relativeTime: { future: { other: "Dalam {0} bulan" }, past: { other: "{0} bulan yang lalu" } } }, day: { displayName: "Hari", relative: { 0: "hari ini", 1: "besok", 2: "lusa", "-2": "kemarin dulu", "-1": "kemarin" }, relativeTime: { future: { other: "Dalam {0} hari" }, past: { other: "{0} hari yang lalu" } } }, hour: { displayName: "Jam", relative: { 0: "jam ini" }, relativeTime: { future: { other: "Dalam {0} jam" }, past: { other: "{0} jam yang lalu" } } }, minute: { displayName: "Menit", relative: { 0: "menit ini" }, relativeTime: { future: { other: "Dalam {0} menit" }, past: { other: "{0} menit yang lalu" } } }, second: { displayName: "Detik", relative: { 0: "sekarang" }, relativeTime: { future: { other: "Dalam {0} detik" }, past: { other: "{0} detik yang lalu" } } } } }];
});

/***/ })

});