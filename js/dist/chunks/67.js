yoastWebpackJsonp([67],{

/***/ 492:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.ro = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "ro", pluralRuleFunction: function pluralRuleFunction(e, t) {
      var a = String(e).split("."),
          u = !a[1],
          n = Number(a[0]) == e && a[0].slice(-2);return t ? 1 == e ? "one" : "other" : 1 == e && u ? "one" : !u || 0 == e || 1 != e && n >= 1 && n <= 19 ? "few" : "other";
    }, fields: { year: { displayName: "an", relative: { 0: "anul acesta", 1: "anul viitor", "-1": "anul trecut" }, relativeTime: { future: { one: "peste {0} an", few: "peste {0} ani", other: "peste {0} de ani" }, past: { one: "acum {0} an", few: "acum {0} ani", other: "acum {0} de ani" } } }, month: { displayName: "lună", relative: { 0: "luna aceasta", 1: "luna viitoare", "-1": "luna trecută" }, relativeTime: { future: { one: "peste {0} lună", few: "peste {0} luni", other: "peste {0} de luni" }, past: { one: "acum {0} lună", few: "acum {0} luni", other: "acum {0} de luni" } } }, day: { displayName: "zi", relative: { 0: "azi", 1: "mâine", 2: "poimâine", "-2": "alaltăieri", "-1": "ieri" }, relativeTime: { future: { one: "peste {0} zi", few: "peste {0} zile", other: "peste {0} de zile" }, past: { one: "acum {0} zi", few: "acum {0} zile", other: "acum {0} de zile" } } }, hour: { displayName: "oră", relative: { 0: "ora aceasta" }, relativeTime: { future: { one: "peste {0} oră", few: "peste {0} ore", other: "peste {0} de ore" }, past: { one: "acum {0} oră", few: "acum {0} ore", other: "acum {0} de ore" } } }, minute: { displayName: "minut", relative: { 0: "minutul acesta" }, relativeTime: { future: { one: "peste {0} minut", few: "peste {0} minute", other: "peste {0} de minute" }, past: { one: "acum {0} minut", few: "acum {0} minute", other: "acum {0} de minute" } } }, second: { displayName: "secundă", relative: { 0: "acum" }, relativeTime: { future: { one: "peste {0} secundă", few: "peste {0} secunde", other: "peste {0} de secunde" }, past: { one: "acum {0} secundă", few: "acum {0} secunde", other: "acum {0} de secunde" } } } } }, { locale: "ro-MD", parentLocale: "ro" }];
});

/***/ })

});