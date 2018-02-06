yoastWebpackJsonp([31],{

/***/ 528:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.th = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "th", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return "other";
    }, fields: { year: { displayName: "ปี", relative: { 0: "ปีนี้", 1: "ปีหน้า", "-1": "ปีที่แล้ว" }, relativeTime: { future: { other: "ในอีก {0} ปี" }, past: { other: "{0} ปีที่แล้ว" } } }, month: { displayName: "เดือน", relative: { 0: "เดือนนี้", 1: "เดือนหน้า", "-1": "เดือนที่แล้ว" }, relativeTime: { future: { other: "ในอีก {0} เดือน" }, past: { other: "{0} เดือนที่ผ่านมา" } } }, day: { displayName: "วัน", relative: { 0: "วันนี้", 1: "พรุ่งนี้", 2: "มะรืนนี้", "-2": "เมื่อวานซืน", "-1": "เมื่อวาน" }, relativeTime: { future: { other: "ในอีก {0} วัน" }, past: { other: "{0} วันที่ผ่านมา" } } }, hour: { displayName: "ชั่วโมง", relative: { 0: "ชั่วโมงนี้" }, relativeTime: { future: { other: "ในอีก {0} ชั่วโมง" }, past: { other: "{0} ชั่วโมงที่ผ่านมา" } } }, minute: { displayName: "นาที", relative: { 0: "นาทีนี้" }, relativeTime: { future: { other: "ในอีก {0} นาที" }, past: { other: "{0} นาทีที่ผ่านมา" } } }, second: { displayName: "วินาที", relative: { 0: "ขณะนี้" }, relativeTime: { future: { other: "ในอีก {0} วินาที" }, past: { other: "{0} วินาทีที่ผ่านมา" } } } } }];
});

/***/ })

});