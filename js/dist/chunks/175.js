yoastWebpackJsonp([175],{

/***/ 384:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.gu = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "gu", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? 1 == e ? "one" : 2 == e || 3 == e ? "two" : 4 == e ? "few" : 6 == e ? "many" : "other" : e >= 0 && e <= 1 ? "one" : "other";
    }, fields: { year: { displayName: "વર્ષ", relative: { 0: "આ વર્ષે", 1: "આવતા વર્ષે", "-1": "ગયા વર્ષે" }, relativeTime: { future: { one: "{0} વર્ષમાં", other: "{0} વર્ષમાં" }, past: { one: "{0} વર્ષ પહેલાં", other: "{0} વર્ષ પહેલાં" } } }, month: { displayName: "મહિનો", relative: { 0: "આ મહિને", 1: "આવતા મહિને", "-1": "ગયા મહિને" }, relativeTime: { future: { one: "{0} મહિનામાં", other: "{0} મહિનામાં" }, past: { one: "{0} મહિના પહેલાં", other: "{0} મહિના પહેલાં" } } }, day: { displayName: "દિવસ", relative: { 0: "આજે", 1: "આવતીકાલે", 2: "પરમદિવસે", "-2": "ગયા પરમદિવસે", "-1": "ગઈકાલે" }, relativeTime: { future: { one: "{0} દિવસમાં", other: "{0} દિવસમાં" }, past: { one: "{0} દિવસ પહેલાં", other: "{0} દિવસ પહેલાં" } } }, hour: { displayName: "કલાક", relative: { 0: "આ કલાક" }, relativeTime: { future: { one: "{0} કલાકમાં", other: "{0} કલાકમાં" }, past: { one: "{0} કલાક પહેલાં", other: "{0} કલાક પહેલાં" } } }, minute: { displayName: "મિનિટ", relative: { 0: "આ મિનિટ" }, relativeTime: { future: { one: "{0} મિનિટમાં", other: "{0} મિનિટમાં" }, past: { one: "{0} મિનિટ પહેલાં", other: "{0} મિનિટ પહેલાં" } } }, second: { displayName: "સેકન્ડ", relative: { 0: "હમણાં" }, relativeTime: { future: { one: "{0} સેકંડમાં", other: "{0} સેકંડમાં" }, past: { one: "{0} સેકંડ પહેલાં", other: "{0} સેકંડ પહેલાં" } } } } }];
});

/***/ })

});