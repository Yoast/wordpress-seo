yoastWebpackJsonp([142],{

/***/ 417:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.kea = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "kea", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return "other";
    }, fields: { year: { displayName: "Anu", relative: { 0: "es anu li", 1: "prósimu anu", "-1": "anu pasadu" }, relativeTime: { future: { other: "di li {0} anu" }, past: { other: "a ten {0} anu" } } }, month: { displayName: "Mes", relative: { 0: "es mes li", 1: "prósimu mes", "-1": "mes pasadu" }, relativeTime: { future: { other: "di li {0} mes" }, past: { other: "a ten {0} mes" } } }, day: { displayName: "Dia", relative: { 0: "oji", 1: "manha", "-1": "onti" }, relativeTime: { future: { other: "di li {0} dia" }, past: { other: "a ten {0} dia" } } }, hour: { displayName: "Ora", relative: { 0: "this hour" }, relativeTime: { future: { other: "di li {0} ora" }, past: { other: "a ten {0} ora" } } }, minute: { displayName: "Minutu", relative: { 0: "this minute" }, relativeTime: { future: { other: "di li {0} minutu" }, past: { other: "a ten {0} minutu" } } }, second: { displayName: "Sigundu", relative: { 0: "now" }, relativeTime: { future: { other: "di li {0} sigundu" }, past: { other: "a ten {0} sigundu" } } } } }];
});

/***/ })

});