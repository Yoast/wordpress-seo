yoastWebpackJsonp([14],{

/***/ 545:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.vi = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "vi", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t && 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "Năm", relative: { 0: "năm nay", 1: "năm sau", "-1": "năm ngoái" }, relativeTime: { future: { other: "sau {0} năm nữa" }, past: { other: "{0} năm trước" } } }, month: { displayName: "Tháng", relative: { 0: "tháng này", 1: "tháng sau", "-1": "tháng trước" }, relativeTime: { future: { other: "sau {0} tháng nữa" }, past: { other: "{0} tháng trước" } } }, day: { displayName: "Ngày", relative: { 0: "Hôm nay", 1: "Ngày mai", 2: "Ngày kia", "-2": "Hôm kia", "-1": "Hôm qua" }, relativeTime: { future: { other: "sau {0} ngày nữa" }, past: { other: "{0} ngày trước" } } }, hour: { displayName: "Giờ", relative: { 0: "giờ này" }, relativeTime: { future: { other: "sau {0} giờ nữa" }, past: { other: "{0} giờ trước" } } }, minute: { displayName: "Phút", relative: { 0: "phút này" }, relativeTime: { future: { other: "sau {0} phút nữa" }, past: { other: "{0} phút trước" } } }, second: { displayName: "Giây", relative: { 0: "bây giờ" }, relativeTime: { future: { other: "sau {0} giây nữa" }, past: { other: "{0} giây trước" } } } } }];
});

/***/ })

});