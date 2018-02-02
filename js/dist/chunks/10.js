yoastWebpackJsonp([10],{

/***/ 549:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.wae = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "wae", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "Jár", relative: { 0: "this year", 1: "next year", "-1": "last year" }, relativeTime: { future: { one: "I {0} jár", other: "I {0} jár" }, past: { one: "vor {0} jár", other: "cor {0} jár" } } }, month: { displayName: "Mánet", relative: { 0: "this month", 1: "next month", "-1": "last month" }, relativeTime: { future: { one: "I {0} mánet", other: "I {0} mánet" }, past: { one: "vor {0} mánet", other: "vor {0} mánet" } } }, day: { displayName: "Tag", relative: { 0: "Hitte", 1: "Móre", 2: "Ubermóre", "-2": "Vorgešter", "-1": "Gešter" }, relativeTime: { future: { one: "i {0} tag", other: "i {0} täg" }, past: { one: "vor {0} tag", other: "vor {0} täg" } } }, hour: { displayName: "Schtund", relative: { 0: "this hour" }, relativeTime: { future: { one: "i {0} stund", other: "i {0} stunde" }, past: { one: "vor {0} stund", other: "vor {0} stunde" } } }, minute: { displayName: "Mínütta", relative: { 0: "this minute" }, relativeTime: { future: { one: "i {0} minüta", other: "i {0} minüte" }, past: { one: "vor {0} minüta", other: "vor {0} minüte" } } }, second: { displayName: "Sekunda", relative: { 0: "now" }, relativeTime: { future: { one: "i {0} sekund", other: "i {0} sekunde" }, past: { one: "vor {0} sekund", other: "vor {0} sekunde" } } } } }];
});

/***/ })

});