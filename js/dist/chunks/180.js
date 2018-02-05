yoastWebpackJsonp([180],{

/***/ 379:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, n) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = n() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (n),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.fy = n());
}(undefined, function () {
  "use strict";
  return [{ locale: "fy", pluralRuleFunction: function pluralRuleFunction(e, n) {
      var r = !String(e).split(".")[1];return n ? "other" : 1 == e && r ? "one" : "other";
    }, fields: { year: { displayName: "Jier", relative: { 0: "dit jier", 1: "folgjend jier", "-1": "foarich jier" }, relativeTime: { future: { one: "Oer {0} jier", other: "Oer {0} jier" }, past: { one: "{0} jier lyn", other: "{0} jier lyn" } } }, month: { displayName: "Moanne", relative: { 0: "dizze moanne", 1: "folgjende moanne", "-1": "foarige moanne" }, relativeTime: { future: { one: "Oer {0} moanne", other: "Oer {0} moannen" }, past: { one: "{0} moanne lyn", other: "{0} moannen lyn" } } }, day: { displayName: "dei", relative: { 0: "vandaag", 1: "morgen", 2: "Oermorgen", "-2": "eergisteren", "-1": "gisteren" }, relativeTime: { future: { one: "Oer {0} dei", other: "Oer {0} deien" }, past: { one: "{0} dei lyn", other: "{0} deien lyn" } } }, hour: { displayName: "oere", relative: { 0: "this hour" }, relativeTime: { future: { one: "Oer {0} oere", other: "Oer {0} oere" }, past: { one: "{0} oere lyn", other: "{0} oere lyn" } } }, minute: { displayName: "Minút", relative: { 0: "this minute" }, relativeTime: { future: { one: "Oer {0} minút", other: "Oer {0} minuten" }, past: { one: "{0} minút lyn", other: "{0} minuten lyn" } } }, second: { displayName: "Sekonde", relative: { 0: "nu" }, relativeTime: { future: { one: "Oer {0} sekonde", other: "Oer {0} sekonden" }, past: { one: "{0} sekonde lyn", other: "{0} sekonden lyn" } } } } }];
});

/***/ })

});