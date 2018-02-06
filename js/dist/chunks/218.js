yoastWebpackJsonp([218],{

/***/ 341:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.bn = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "bn", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? 1 == e || 5 == e || 7 == e || 8 == e || 9 == e || 10 == e ? "one" : 2 == e || 3 == e ? "two" : 4 == e ? "few" : 6 == e ? "many" : "other" : e >= 0 && e <= 1 ? "one" : "other";
    }, fields: { year: { displayName: "বছর", relative: { 0: "এই বছর", 1: "পরের বছর", "-1": "গত বছর" }, relativeTime: { future: { one: "{0} বছরে", other: "{0} বছরে" }, past: { one: "{0} বছর পূর্বে", other: "{0} বছর পূর্বে" } } }, month: { displayName: "মাস", relative: { 0: "এই মাস", 1: "পরের মাস", "-1": "গত মাস" }, relativeTime: { future: { one: "{0} মাসে", other: "{0} মাসে" }, past: { one: "{0} মাস আগে", other: "{0} মাস আগে" } } }, day: { displayName: "দিন", relative: { 0: "আজ", 1: "আগামীকাল", 2: "আগামী পরশু", "-2": "গত পরশু", "-1": "গতকাল" }, relativeTime: { future: { one: "{0} দিনের মধ্যে", other: "{0} দিনের মধ্যে" }, past: { one: "{0} দিন আগে", other: "{0} দিন আগে" } } }, hour: { displayName: "ঘন্টা", relative: { 0: "এই ঘণ্টায়" }, relativeTime: { future: { one: "{0} ঘন্টায়", other: "{0} ঘন্টায়" }, past: { one: "{0} ঘন্টা আগে", other: "{0} ঘন্টা আগে" } } }, minute: { displayName: "মিনিট", relative: { 0: "এই মিনিট" }, relativeTime: { future: { one: "{0} মিনিটে", other: "{0} মিনিটে" }, past: { one: "{0} মিনিট আগে", other: "{0} মিনিট পূর্বে" } } }, second: { displayName: "সেকেন্ড", relative: { 0: "এখন" }, relativeTime: { future: { one: "{0} সেকেন্ডে", other: "{0} সেকেন্ডে" }, past: { one: "{0} সেকেন্ড পূর্বে", other: "{0} সেকেন্ড পূর্বে" } } } } }, { locale: "bn-IN", parentLocale: "bn" }];
});

/***/ })

});