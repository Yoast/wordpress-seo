yoastWebpackJsonp([97],{

/***/ 462:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.mzn = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "mzn", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return "other";
    }, fields: { year: { displayName: "سال", relative: { 0: "امسال", 1: "سال دیگه", "-1": "پارسال" }, relativeTime: { future: { other: "{0} سال دله" }, past: { other: "{0} سال پیش" } } }, month: { displayName: "ماه", relative: { 0: "این ماه", 1: "ماه ِبعد", "-1": "ماه قبل" }, relativeTime: { future: { other: "{0} ماه دله" }, past: { other: "{0} ماه پیش" } } }, day: { displayName: "روز", relative: { 0: "اَمروز", 1: "فِردا", "-1": "دیروز" }, relativeTime: { future: { other: "{0} روز دله" }, past: { other: "{0} روز پیش" } } }, hour: { displayName: "ساعِت", relative: { 0: "this hour" }, relativeTime: { future: { other: "{0} ساعِت دله" }, past: { other: "{0} ساعِت پیش" } } }, minute: { displayName: "دقیقه", relative: { 0: "this minute" }, relativeTime: { future: { other: "{0} دقیقه دله" }, past: { other: "{0} دَقه پیش" } } }, second: { displayName: "ثانیه", relative: { 0: "now" }, relativeTime: { future: { other: "{0} ثانیه دله" }, past: { other: "{0} ثانیه پیش" } } } } }];
});

/***/ })

});