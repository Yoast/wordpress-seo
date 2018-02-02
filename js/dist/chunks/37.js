yoastWebpackJsonp([37],{

/***/ 522:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.sv = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "sv", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var r = String(e).split("."),
          n = !r[1],
          t = Number(r[0]) == e,
          o = t && r[0].slice(-1),
          i = t && r[0].slice(-2);return a ? 1 != o && 2 != o || 11 == i || 12 == i ? "other" : "one" : 1 == e && n ? "one" : "other";
    }, fields: { year: { displayName: "år", relative: { 0: "i år", 1: "nästa år", "-1": "i fjol" }, relativeTime: { future: { one: "om {0} år", other: "om {0} år" }, past: { one: "för {0} år sedan", other: "för {0} år sedan" } } }, month: { displayName: "månad", relative: { 0: "denna månad", 1: "nästa månad", "-1": "förra månaden" }, relativeTime: { future: { one: "om {0} månad", other: "om {0} månader" }, past: { one: "för {0} månad sedan", other: "för {0} månader sedan" } } }, day: { displayName: "dag", relative: { 0: "i dag", 1: "i morgon", 2: "i övermorgon", "-2": "i förrgår", "-1": "i går" }, relativeTime: { future: { one: "om {0} dag", other: "om {0} dagar" }, past: { one: "för {0} dag sedan", other: "för {0} dagar sedan" } } }, hour: { displayName: "timme", relative: { 0: "denna timme" }, relativeTime: { future: { one: "om {0} timme", other: "om {0} timmar" }, past: { one: "för {0} timme sedan", other: "för {0} timmar sedan" } } }, minute: { displayName: "minut", relative: { 0: "denna minut" }, relativeTime: { future: { one: "om {0} minut", other: "om {0} minuter" }, past: { one: "för {0} minut sedan", other: "för {0} minuter sedan" } } }, second: { displayName: "sekund", relative: { 0: "nu" }, relativeTime: { future: { one: "om {0} sekund", other: "om {0} sekunder" }, past: { one: "för {0} sekund sedan", other: "för {0} sekunder sedan" } } } } }, { locale: "sv-AX", parentLocale: "sv" }, { locale: "sv-FI", parentLocale: "sv" }];
});

/***/ })

});