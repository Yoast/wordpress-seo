yoastWebpackJsonp([190],{

/***/ 369:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.et = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "et", pluralRuleFunction: function pluralRuleFunction(e, t) {
      var a = !String(e).split(".")[1];return t ? "other" : 1 == e && a ? "one" : "other";
    }, fields: { year: { displayName: "aasta", relative: { 0: "käesolev aasta", 1: "järgmine aasta", "-1": "eelmine aasta" }, relativeTime: { future: { one: "{0} aasta pärast", other: "{0} aasta pärast" }, past: { one: "{0} aasta eest", other: "{0} aasta eest" } } }, month: { displayName: "kuu", relative: { 0: "käesolev kuu", 1: "järgmine kuu", "-1": "eelmine kuu" }, relativeTime: { future: { one: "{0} kuu pärast", other: "{0} kuu pärast" }, past: { one: "{0} kuu eest", other: "{0} kuu eest" } } }, day: { displayName: "päev", relative: { 0: "täna", 1: "homme", 2: "ülehomme", "-2": "üleeile", "-1": "eile" }, relativeTime: { future: { one: "{0} päeva pärast", other: "{0} päeva pärast" }, past: { one: "{0} päeva eest", other: "{0} päeva eest" } } }, hour: { displayName: "tund", relative: { 0: "praegusel tunnil" }, relativeTime: { future: { one: "{0} tunni pärast", other: "{0} tunni pärast" }, past: { one: "{0} tunni eest", other: "{0} tunni eest" } } }, minute: { displayName: "minut", relative: { 0: "praegusel minutil" }, relativeTime: { future: { one: "{0} minuti pärast", other: "{0} minuti pärast" }, past: { one: "{0} minuti eest", other: "{0} minuti eest" } } }, second: { displayName: "sekund", relative: { 0: "nüüd" }, relativeTime: { future: { one: "{0} sekundi pärast", other: "{0} sekundi pärast" }, past: { one: "{0} sekundi eest", other: "{0} sekundi eest" } } } } }];
});

/***/ })

});