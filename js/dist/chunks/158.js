yoastWebpackJsonp([158],{

/***/ 401:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, o) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = o() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (o),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.it = o());
}(undefined, function () {
  "use strict";
  return [{ locale: "it", pluralRuleFunction: function pluralRuleFunction(e, o) {
      var t = !String(e).split(".")[1];return o ? 11 == e || 8 == e || 80 == e || 800 == e ? "many" : "other" : 1 == e && t ? "one" : "other";
    }, fields: { year: { displayName: "anno", relative: { 0: "quest’anno", 1: "anno prossimo", "-1": "anno scorso" }, relativeTime: { future: { one: "tra {0} anno", other: "tra {0} anni" }, past: { one: "{0} anno fa", other: "{0} anni fa" } } }, month: { displayName: "mese", relative: { 0: "questo mese", 1: "mese prossimo", "-1": "mese scorso" }, relativeTime: { future: { one: "tra {0} mese", other: "tra {0} mesi" }, past: { one: "{0} mese fa", other: "{0} mesi fa" } } }, day: { displayName: "giorno", relative: { 0: "oggi", 1: "domani", 2: "dopodomani", "-2": "l’altro ieri", "-1": "ieri" }, relativeTime: { future: { one: "tra {0} giorno", other: "tra {0} giorni" }, past: { one: "{0} giorno fa", other: "{0} giorni fa" } } }, hour: { displayName: "ora", relative: { 0: "quest’ora" }, relativeTime: { future: { one: "tra {0} ora", other: "tra {0} ore" }, past: { one: "{0} ora fa", other: "{0} ore fa" } } }, minute: { displayName: "minuto", relative: { 0: "questo minuto" }, relativeTime: { future: { one: "tra {0} minuto", other: "tra {0} minuti" }, past: { one: "{0} minuto fa", other: "{0} minuti fa" } } }, second: { displayName: "secondo", relative: { 0: "ora" }, relativeTime: { future: { one: "tra {0} secondo", other: "tra {0} secondi" }, past: { one: "{0} secondo fa", other: "{0} secondi fa" } } } } }, { locale: "it-CH", parentLocale: "it" }, { locale: "it-SM", parentLocale: "it" }, { locale: "it-VA", parentLocale: "it" }];
});

/***/ })

});