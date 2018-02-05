yoastWebpackJsonp([3],{

/***/ 556:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.yue = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "yue", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return "other";
    }, fields: { year: { displayName: "年", relative: { 0: "今年", 1: "下年", "-1": "舊年" }, relativeTime: { future: { other: "{0} 年後" }, past: { other: "{0} 年前" } } }, month: { displayName: "月", relative: { 0: "今個月", 1: "下個月", "-1": "上個月" }, relativeTime: { future: { other: "{0} 個月後" }, past: { other: "{0} 個月前" } } }, day: { displayName: "日", relative: { 0: "今日", 1: "聽日", 2: "後天", "-2": "前天", "-1": "尋日" }, relativeTime: { future: { other: "{0} 日後" }, past: { other: "{0} 日前" } } }, hour: { displayName: "小時", relative: { 0: "呢個小時" }, relativeTime: { future: { other: "{0} 小時後" }, past: { other: "{0} 小時前" } } }, minute: { displayName: "分鐘", relative: { 0: "呢分鐘" }, relativeTime: { future: { other: "{0} 分鐘後" }, past: { other: "{0} 分鐘前" } } }, second: { displayName: "秒", relative: { 0: "宜家" }, relativeTime: { future: { other: "{0} 秒後" }, past: { other: "{0} 秒前" } } } } }, { locale: "yue-Hans", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return "other";
    }, fields: { year: { displayName: "Year", relative: { 0: "this year", 1: "next year", "-1": "last year" }, relativeTime: { future: { other: "+{0} y" }, past: { other: "-{0} y" } } }, month: { displayName: "Month", relative: { 0: "this month", 1: "next month", "-1": "last month" }, relativeTime: { future: { other: "+{0} m" }, past: { other: "-{0} m" } } }, day: { displayName: "Day", relative: { 0: "today", 1: "tomorrow", "-1": "yesterday" }, relativeTime: { future: { other: "+{0} d" }, past: { other: "-{0} d" } } }, hour: { displayName: "Hour", relative: { 0: "this hour" }, relativeTime: { future: { other: "+{0} h" }, past: { other: "-{0} h" } } }, minute: { displayName: "Minute", relative: { 0: "this minute" }, relativeTime: { future: { other: "+{0} min" }, past: { other: "-{0} min" } } }, second: { displayName: "Second", relative: { 0: "now" }, relativeTime: { future: { other: "+{0} s" }, past: { other: "-{0} s" } } } } }];
});

/***/ })

});