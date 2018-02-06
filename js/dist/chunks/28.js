yoastWebpackJsonp([28],{

/***/ 531:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.tk = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "tk", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "ýyl", relative: { 0: "şu ýyl", 1: "indiki ýyl", "-1": "geçen ýyl" }, relativeTime: { future: { one: "{0} ýyldan", other: "{0} ýyldan" }, past: { one: "{0} ýyl öň", other: "{0} ýyl öň" } } }, month: { displayName: "aý", relative: { 0: "şu aý", 1: "indiki aý", "-1": "geçen aý" }, relativeTime: { future: { one: "{0} aýdan", other: "{0} aýdan" }, past: { one: "{0} aý öň", other: "{0} aý öň" } } }, day: { displayName: "gün", relative: { 0: "şu gün", 1: "ertir", "-1": "düýn" }, relativeTime: { future: { one: "{0} günden", other: "{0} günden" }, past: { one: "{0} gün öň", other: "{0} gün öň" } } }, hour: { displayName: "sagat", relative: { 0: "this hour" }, relativeTime: { future: { one: "{0} sagatdan", other: "{0} sagatdan" }, past: { one: "{0} sagat öň", other: "{0} sagat öň" } } }, minute: { displayName: "minut", relative: { 0: "this minute" }, relativeTime: { future: { one: "{0} minutdan", other: "{0} minutdan" }, past: { one: "{0} minut öň", other: "{0} minut öň" } } }, second: { displayName: "sekunt", relative: { 0: "now" }, relativeTime: { future: { one: "{0} sekuntdan", other: "{0} sekuntdan" }, past: { one: "{0} sekunt öň", other: "{0} sekunt öň" } } } } }];
});

/***/ })

});