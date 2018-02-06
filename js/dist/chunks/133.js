yoastWebpackJsonp([133],{

/***/ 426:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.ko = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "ko", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return "other";
    }, fields: { year: { displayName: "년", relative: { 0: "올해", 1: "내년", "-1": "작년" }, relativeTime: { future: { other: "{0}년 후" }, past: { other: "{0}년 전" } } }, month: { displayName: "월", relative: { 0: "이번 달", 1: "다음 달", "-1": "지난달" }, relativeTime: { future: { other: "{0}개월 후" }, past: { other: "{0}개월 전" } } }, day: { displayName: "일", relative: { 0: "오늘", 1: "내일", 2: "모레", "-2": "그저께", "-1": "어제" }, relativeTime: { future: { other: "{0}일 후" }, past: { other: "{0}일 전" } } }, hour: { displayName: "시", relative: { 0: "현재 시간" }, relativeTime: { future: { other: "{0}시간 후" }, past: { other: "{0}시간 전" } } }, minute: { displayName: "분", relative: { 0: "현재 분" }, relativeTime: { future: { other: "{0}분 후" }, past: { other: "{0}분 전" } } }, second: { displayName: "초", relative: { 0: "지금" }, relativeTime: { future: { other: "{0}초 후" }, past: { other: "{0}초 전" } } } } }, { locale: "ko-KP", parentLocale: "ko" }];
});

/***/ })

});