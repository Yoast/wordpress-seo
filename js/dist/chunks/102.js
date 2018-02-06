yoastWebpackJsonp([102],{

/***/ 457:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.mr = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "mr", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? 1 == e ? "one" : 2 == e || 3 == e ? "two" : 4 == e ? "few" : "other" : e >= 0 && e <= 1 ? "one" : "other";
    }, fields: { year: { displayName: "वर्ष", relative: { 0: "हे वर्ष", 1: "पुढील वर्ष", "-1": "मागील वर्ष" }, relativeTime: { future: { one: "{0} वर्षामध्ये", other: "{0} वर्षांमध्ये" }, past: { one: "{0} वर्षापूर्वी", other: "{0} वर्षांपूर्वी" } } }, month: { displayName: "महिना", relative: { 0: "हा महिना", 1: "पुढील महिना", "-1": "मागील महिना" }, relativeTime: { future: { one: "{0} महिन्यामध्ये", other: "{0} महिन्यांमध्ये" }, past: { one: "{0} महिन्यापूर्वी", other: "{0} महिन्यांपूर्वी" } } }, day: { displayName: "दिवस", relative: { 0: "आज", 1: "उद्या", "-1": "काल" }, relativeTime: { future: { one: "{0} दिवसामध्ये", other: "{0} दिवसांमध्ये" }, past: { one: "{0} दिवसापूर्वी", other: "{0} दिवसांपूर्वी" } } }, hour: { displayName: "तास", relative: { 0: "तासात" }, relativeTime: { future: { one: "{0} तासामध्ये", other: "{0} तासांमध्ये" }, past: { one: "{0} तासापूर्वी", other: "{0} तासांपूर्वी" } } }, minute: { displayName: "मिनिट", relative: { 0: "या मिनिटात" }, relativeTime: { future: { one: "{0} मिनिटामध्ये", other: "{0} मिनिटांमध्ये" }, past: { one: "{0} मिनिटापूर्वी", other: "{0} मिनिटांपूर्वी" } } }, second: { displayName: "सेकंद", relative: { 0: "आत्ता" }, relativeTime: { future: { one: "{0} सेकंदामध्ये", other: "{0} सेकंदांमध्ये" }, past: { one: "{0} सेकंदापूर्वी", other: "{0} सेकंदांपूर्वी" } } } } }];
});

/***/ })

});