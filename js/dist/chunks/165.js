yoastWebpackJsonp([165],{

/***/ 394:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.hu = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "hu", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? 1 == e || 5 == e ? "one" : "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "év", relative: { 0: "ez az év", 1: "következő év", "-1": "előző év" }, relativeTime: { future: { one: "{0} év múlva", other: "{0} év múlva" }, past: { one: "{0} évvel ezelőtt", other: "{0} évvel ezelőtt" } } }, month: { displayName: "hónap", relative: { 0: "ez a hónap", 1: "következő hónap", "-1": "előző hónap" }, relativeTime: { future: { one: "{0} hónap múlva", other: "{0} hónap múlva" }, past: { one: "{0} hónappal ezelőtt", other: "{0} hónappal ezelőtt" } } }, day: { displayName: "nap", relative: { 0: "ma", 1: "holnap", 2: "holnapután", "-2": "tegnapelőtt", "-1": "tegnap" }, relativeTime: { future: { one: "{0} nap múlva", other: "{0} nap múlva" }, past: { one: "{0} nappal ezelőtt", other: "{0} nappal ezelőtt" } } }, hour: { displayName: "óra", relative: { 0: "ebben az órában" }, relativeTime: { future: { one: "{0} óra múlva", other: "{0} óra múlva" }, past: { one: "{0} órával ezelőtt", other: "{0} órával ezelőtt" } } }, minute: { displayName: "perc", relative: { 0: "ebben a percben" }, relativeTime: { future: { one: "{0} perc múlva", other: "{0} perc múlva" }, past: { one: "{0} perccel ezelőtt", other: "{0} perccel ezelőtt" } } }, second: { displayName: "másodperc", relative: { 0: "most" }, relativeTime: { future: { one: "{0} másodperc múlva", other: "{0} másodperc múlva" }, past: { one: "{0} másodperccel ezelőtt", other: "{0} másodperccel ezelőtt" } } } } }];
});

/***/ })

});