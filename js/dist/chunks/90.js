yoastWebpackJsonp([90],{

/***/ 469:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, n) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = n() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (n),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.nl = n());
}(undefined, function () {
  "use strict";
  return [{ locale: "nl", pluralRuleFunction: function pluralRuleFunction(e, n) {
      var a = !String(e).split(".")[1];return n ? "other" : 1 == e && a ? "one" : "other";
    }, fields: { year: { displayName: "jaar", relative: { 0: "dit jaar", 1: "volgend jaar", "-1": "vorig jaar" }, relativeTime: { future: { one: "over {0} jaar", other: "over {0} jaar" }, past: { one: "{0} jaar geleden", other: "{0} jaar geleden" } } }, month: { displayName: "maand", relative: { 0: "deze maand", 1: "volgende maand", "-1": "vorige maand" }, relativeTime: { future: { one: "over {0} maand", other: "over {0} maanden" }, past: { one: "{0} maand geleden", other: "{0} maanden geleden" } } }, day: { displayName: "dag", relative: { 0: "vandaag", 1: "morgen", 2: "overmorgen", "-2": "eergisteren", "-1": "gisteren" }, relativeTime: { future: { one: "over {0} dag", other: "over {0} dagen" }, past: { one: "{0} dag geleden", other: "{0} dagen geleden" } } }, hour: { displayName: "uur", relative: { 0: "binnen een uur" }, relativeTime: { future: { one: "over {0} uur", other: "over {0} uur" }, past: { one: "{0} uur geleden", other: "{0} uur geleden" } } }, minute: { displayName: "minuut", relative: { 0: "binnen een minuut" }, relativeTime: { future: { one: "over {0} minuut", other: "over {0} minuten" }, past: { one: "{0} minuut geleden", other: "{0} minuten geleden" } } }, second: { displayName: "seconde", relative: { 0: "nu" }, relativeTime: { future: { one: "over {0} seconde", other: "over {0} seconden" }, past: { one: "{0} seconde geleden", other: "{0} seconden geleden" } } } } }, { locale: "nl-AW", parentLocale: "nl" }, { locale: "nl-BE", parentLocale: "nl" }, { locale: "nl-BQ", parentLocale: "nl" }, { locale: "nl-CW", parentLocale: "nl" }, { locale: "nl-SR", parentLocale: "nl" }, { locale: "nl-SX", parentLocale: "nl" }];
});

/***/ })

});