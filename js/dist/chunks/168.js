yoastWebpackJsonp([168],{

/***/ 391:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.hi = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "hi", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? 1 == e ? "one" : 2 == e || 3 == e ? "two" : 4 == e ? "few" : 6 == e ? "many" : "other" : e >= 0 && e <= 1 ? "one" : "other";
    }, fields: { year: { displayName: "वर्ष", relative: { 0: "इस वर्ष", 1: "अगला वर्ष", "-1": "पिछला वर्ष" }, relativeTime: { future: { one: "{0} वर्ष में", other: "{0} वर्ष में" }, past: { one: "{0} वर्ष पहले", other: "{0} वर्ष पहले" } } }, month: { displayName: "माह", relative: { 0: "इस माह", 1: "अगला माह", "-1": "पिछला माह" }, relativeTime: { future: { one: "{0} माह में", other: "{0} माह में" }, past: { one: "{0} माह पहले", other: "{0} माह पहले" } } }, day: { displayName: "दिन", relative: { 0: "आज", 1: "कल", 2: "परसों", "-2": "बीता परसों", "-1": "कल" }, relativeTime: { future: { one: "{0} दिन में", other: "{0} दिन में" }, past: { one: "{0} दिन पहले", other: "{0} दिन पहले" } } }, hour: { displayName: "घंटा", relative: { 0: "यह घंटा" }, relativeTime: { future: { one: "{0} घंटे में", other: "{0} घंटे में" }, past: { one: "{0} घंटे पहले", other: "{0} घंटे पहले" } } }, minute: { displayName: "मिनट", relative: { 0: "यह मिनट" }, relativeTime: { future: { one: "{0} मिनट में", other: "{0} मिनट में" }, past: { one: "{0} मिनट पहले", other: "{0} मिनट पहले" } } }, second: { displayName: "सेकंड", relative: { 0: "अब" }, relativeTime: { future: { one: "{0} सेकंड में", other: "{0} सेकंड में" }, past: { one: "{0} सेकंड पहले", other: "{0} सेकंड पहले" } } } } }];
});

/***/ })

});