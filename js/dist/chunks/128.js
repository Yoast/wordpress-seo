yoastWebpackJsonp([128],{

/***/ 431:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.ksh = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "ksh", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 0 == e ? "zero" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "Johr", relative: { 0: "diß Johr", 1: "näx Johr", "-1": "läz Johr" }, relativeTime: { future: { zero: "en keinem Johr", one: "en {0} Johr", other: "en {0} Johre" }, past: { zero: "vör keijnem Johr", one: "vör {0} Johr", other: "vör {0} Johre" } } }, month: { displayName: "Mohnd", relative: { 0: "diese Mohnd", 1: "nächste Mohnd", "-1": "lätzde Mohnd" }, relativeTime: { future: { other: "+{0} m" }, past: { other: "-{0} m" } } }, day: { displayName: "Daach", relative: { 0: "hück", 1: "morje", 2: "övvermorje", "-2": "vörjestere", "-1": "jestere" }, relativeTime: { future: { other: "+{0} d" }, past: { other: "-{0} d" } } }, hour: { displayName: "Schtund", relative: { 0: "this hour" }, relativeTime: { future: { other: "+{0} h" }, past: { other: "-{0} h" } } }, minute: { displayName: "Menutt", relative: { 0: "this minute" }, relativeTime: { future: { other: "+{0} min" }, past: { other: "-{0} min" } } }, second: { displayName: "Sekond", relative: { 0: "now" }, relativeTime: { future: { other: "+{0} s" }, past: { other: "-{0} s" } } } } }];
});

/***/ })

});